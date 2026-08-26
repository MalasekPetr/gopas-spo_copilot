# Lab · Grounding nad knihovnou Runbooky

> Modul: `knowledge-grounding` · Odhad: 50 min · Režim: **hands-on, step-by-step**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Support Asistent odpovídá **z runbooků, s citací zdroje** — a když odpověď v runbooku
není, řekne to, místo aby si vymyslel.

**Jak lab číst:** každý krok končí **Checkpointem** — nesedí-li, nepokračuj.
Retrieval má dvě cesty: **MOCK** (lokální, funguje vždy) a **ŽIVĚ** (skutečné Copilot
Retrieval API). Kterou jedeme, oznámí instruktor na tabuli — **výchozí je MOCK**;
zapojení v kódu je pro obě stejné, liší se URL a token.

## Předpoklady

- Agent z [`../agents-sdk-core/`](../agents-sdk-core/lab-first-agent.md) volá model
  (včetně `callModel` s retry z části D).
- Účet `user.NN@spdemo.online` s přístupem na `/sites/hr-demo`.

## Část A — co je v indexu (bez kódu)

### 1. Najdi obsah, ne soubor

Přihlas se v prohlížeči do Microsoftu 365 účtem `user.NN@spdemo.online` a vyhledej
**frázi z těla runbooku** (ne název souboru) — např. formulaci o access denied při
uploadu.

**Checkpoint:** výsledek ukazuje obsah dokumentu z knihovny `Runbooky`. Když ne,
index ještě neproběhl — **nahlas to instruktorovi teď**, ne až selže agent.

### 2. Ověř ACL trimming na sobě

Zkus najít dokument, na který **nemáš** oprávnění (instruktor jeden ukáže).

**Checkpoint:** dokument se ve výsledcích **neobjeví** — žádná chyba, prostě není.
Retrieval nikdy nevrátí víc, než smí volající; to je jediný důvod, proč se agent nad
tenantem vůbec smí pustit mezi uživatele. Zapiš si to — mock v části B tuhle
vlastnost **nemá** a budeš to muset pojmenovat.

## Část B — zapojit knowledge

### 3. Spusť mock retrieval

Mock máš v **naklonovaném repu kurzu** (po ranním `git pull`), ne v projektu agenta.
V novém terminálu se tam nejdřív přepni a nech mock běžet:

```powershell
cd <cesta-ke-klonu>/gopas-spo_copilot
node knowledge-grounding/solution/mock-retrieval.mjs
```

Nic se neinstaluje — je to čistý Node bez závislostí. Poběží u tebe lokálně,
protože agent volá `http://localhost:4002` (tvůj stroj, ne instruktorův).

**Checkpoint:** `Mock retrieval bezi na http://localhost:4002/retrieval (8 chunku …)`.
Rychlá zkouška, že odpovídá: `node knowledge-grounding/solution/mock-retrieval.mjs --self-test`
(v dalším terminálu to samé se `--self-test` spustí druhou instanci, otestuje a skončí).

### 4. Přidej retrieval funkci

Do `src/agent.ts` (nad handlery):

```ts
const RETRIEVAL_URL = process.env.RETRIEVAL_URL ?? "http://localhost:4002/retrieval";
const RETRIEVAL_TOKEN = process.env.RETRIEVAL_TOKEN; // jen varianta ZIVE

type Chunk = { title: string; url: string; text: string };

async function retrieve(query: string): Promise<Chunk[]> {
  const res = await fetch(RETRIEVAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(RETRIEVAL_TOKEN ? { Authorization: `Bearer ${RETRIEVAL_TOKEN}` } : {}),
    },
    body: JSON.stringify({ queryString: query }),
    signal: AbortSignal.timeout(10_000), // sitove volani = timeout vzdy
  });
  if (!res.ok) throw new Error(`retrieval selhal: ${res.status}`);
  const data = await res.json();
  return (data.retrievalHits ?? []).map((h: any) => ({
    title: h.resourceMetadata?.title ?? "bez názvu",
    url: h.webUrl,
    text: (h.extracts ?? []).map((e: any) => e.text).join("\n"),
  }));
}
```

**Checkpoint:** kompiluje (Problems prázdné). Všimni si `AbortSignal.timeout` —
retrieval je síťové volání jako každé jiné a dostává stejné zacházení jako model
v předchozím labu.

### 5. Zapoj grounding krok před volání modelu

Dvě změny, každá patří jinam — a to rozdělení je pointa kroku:

**a) Instrukce chování → systémový prompt.** Rozšiř `systemPrompt` o pravidla práce
s podklady (vlož za druhou větu):

```ts
"Když v konverzaci dostaneš zprávu začínající 'Podklady z runbooků', odpověz PŘÍMO z nich:",
"shrň postup a pod odpověď vypiš citace ve tvaru [číslo] název — odkaz.",
"Doplňující otázky pokládej jen když podklady žádný použitelný postup neobsahují.",
```

**b) Data → kontextová zpráva.** V message handleru **před** `callModel` sestav
podklady — jen data, žádné instrukce:

```ts
const userText = context.activity.text ?? "";
const hits = await retrieve(userText);
const knowledge = hits.length
  ? "Podklady z runbooků:\n\n" +
    hits.map((h, i) => `[${i + 1}] ${h.title} — ${h.url}\n${h.text}`).join("\n\n")
  : "Podklady z runbooků: žádný runbook k dotazu nenalezen.";

const result = await callModel([
  { role: "system", content: systemPrompt },
  { role: "user", content: userText },
  { role: "user", content: knowledge }, // kontextova zprava: data, ne instrukce chovani
]);
```

Proč to rozdělení: systémový prompt je **stabilní instrukce chování** (a cache-uje
se), podklady jsou **proměnlivá data per turn**. Míchat je znamená rozbít caching
a ztratit hranici mezi „kdo jsem" a „co zrovna vím".

> [!WARNING] Instrukce v datové zprávě model poslouchá špatně — změřeno (2026-08-26)
> První verze labu měla „odpovídej výhradně z podkladů, cituj" uvnitř knowledge
> zprávy. Výsledek: model podklady ignoroval a **spustil výslech** („Kde se to
> děje? Přes web nebo aplikaci? …"). Po přesunu instrukcí do systémového promptu
> odpověděl postupem z runbooku s citacemi — stejný model, stejné chunky, stejná
> otázka. Váha instrukce závisí na tom, **kde** stojí. K tomu se vrátíme
> u vrstev instrukcí v [`../prompt-orchestration/`](../prompt-orchestration/).

**Checkpoint:** pošli dotaz 1 („Nejde mi upload, hlásí access denied.") → odpověď
**shrnuje postup z runbooku** (Members vs. Visitors, checkout/metadata) a **pod ní
jsou citace s odkazem** — žádné doptávání. V terminálu mocku vidíš
`[retrieval] "…" -> 2 chunku`.

### 6. Ověř citaci

**Checkpoint (MOCK):** citace sedí na obsah — otevři soubor z citace v
`knowledge-grounding/solution/runbooky/` a najdi v něm větu, ze které odpověď
vznikla. URL v citaci je u mocku **syntetická kulisa** (mock z SharePointu nečte
nic, servíruje lokální kopie) — proklik může vrátit 404 a je to v pořádku.

**Checkpoint (ŽIVĚ):** odkaz vede na skutečný dokument v knihovně `Runbooky`
a otevře se — tam je proklik plnohodnotné ověření.

Bez ověřitelné citace nemáš grounding, jen důvěryhodně znějící text — a rozdíl
mezi oběma checkpointy je přesně rozdíl mezi kulisou a auditovatelným zdrojem.

> [!NOTE] Varianta ŽIVĚ — jen když instruktor napíše na tabuli RETRIEVAL: ŽIVĚ
> Skutečné **Copilot Retrieval API**: delegated token s `Files.Read.All` +
> `Sites.Read.All` si vyrob přes
> [`../actions-graph/solution/device-auth.mjs`](../actions-graph/solution/device-auth.mjs)
> (client id dá instruktor), pak v terminálu agenta nastav:
>
> ```powershell
> $env:RETRIEVAL_TOKEN = "<token>"
> $env:RETRIEVAL_URL = "https://graph.microsoft.com/beta/copilot/retrieval"
> ```
>
> a do těla požadavku v `retrieve()` přidej
> `dataSource: "sharePoint"` a `filterExpression` omezený na `/sites/hr-demo`.
> Tvar odpovědi mock zrcadlí, mapování chunků zůstává. **Ověřit k datu běhu** —
> API je preview (beta) a tvar se může změnit. Živá cesta má navíc to, co mock
> nemá: **semantic index a ACL trimming** z části A.

## Část C — chování při neznámé odpovědi

### 7. Baseline se posouvá

Pošli **čtyři testovací dotazy** ze scénáře a doplň tabulku z předchozího labu.

**Checkpoint:** dotazy 1 a 2 odpovězeny obsahem z runbooku **s citací** — včera
si je agent vymýšlel. Dotaz 3 pořád jen slibuje (akce přijdou v dalším bloku),
dotaz 4 odmítnut.

### 8. Rozlož odmítnutí dotazu 4

U „Kolik bere kolega Novák?" zapiš nejen **že** agent odmítl, ale **proč**:
odmítl kvůli instrukci v promptu, nebo jen proto, že retrieval nic nevrátil?

**Checkpoint:** máš zapsáno, která z obou obran zafungovala (zkus si odpovědět
z logu mocku: vrátil pro dotaz 4 nějaké chunky?). Jsou to **dvě různě pevné
obrany** a obě jsou měkké — zpevňuje se až middlewarem (příští den).

### 9. Neznámé téma nesmí vést k vymýšlení

Polož dotaz na téma, které v runboocích **není**: „Jak zažádám o firemní telefon?"

**Checkpoint:** agent řekne, že to neví, a nabídne eskalaci — **nevymyslel postup**.
Když halucinuje, zapiš přesné znění; opravovat se to bude promptem
v [`../prompt-orchestration/`](../prompt-orchestration/).

## Část D — rozhodovací reflexe

### 10. Dvě věty na papír

(a) Kde by v tomhle zadání dával smysl **federated** konektor místo synced — a proč
(nápověda: ticketing, živá data, ACL v cizím systému). (b) Kdy by tady byla na místě
**vlastní vektorizace** — a co by konkrétně stála (ACL model, refresh, ladění
relevance).

**Checkpoint:** dvě věty zapsané — jsou vstupem do
[`../opt-custom-retrieval/`](../opt-custom-retrieval/) i do capstonu. A jedna
navíc: **co za tebe dnes udělal semantic index / mock a co by sis musel postavit
sám** — v části A jsi viděl rozdíl na vlastní oči.

## Ověření

- [ ] Dotazy 1 a 2 odpovězeny obsahem z runbooku **s citací**, odkaz proklikatelný.
- [ ] Grounding je kontextová zpráva, **ne** součást systémového promptu.
- [ ] Dotaz na neexistující téma nevede k halucinaci.
- [ ] Dotaz 4 odmítnut a student rozlišil obranu promptem vs. prázdný retrieval.
- [ ] Zapsané dvě věty z části D.

## Fallback

- **Mock neběží** (port obsazený): `PORT=4102 node …` a přepiš `RETRIEVAL_URL`.
- **Živá cesta selhává** (token, PAYG, preview API): vrať se na mock — v kódu je to
  změna dvou env proměnných; rozdíl (bez ACL trimmingu, bez semantic indexu)
  pojmenuj nahlas, je to teaching point, ne ostuda.
- **Index runbooků neproběhl** (část A krok 1): části B–D jedou na mocku beze změny;
  část A dožene instruktor demem, až index naběhne.
- Při skluzu: části A a D lze zkrátit na společnou diskusi.

## Zdroje (Microsoft)

- [Microsoft 365 Copilot Retrieval API — overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/overview)
- [Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)
- [Federated connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/federated-connectors-overview)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-26
> Copilot Retrieval API je **beta/preview**: URL, tvar požadavku (`dataSource`,
> `filterExpression`) i odpovědi (`retrievalHits`/`extracts`) ověřit před během.
> Mock v `solution/` zrcadlí tvar k tomuto datu.

# Lab · Grounding nad knihovnou Runbooky

> Modul: `knowledge-grounding` · Odhad: 50 min · Režim: **hands-on, step-by-step**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Support Asistent odpovídá **z runbooků, s citací zdroje** — a když odpověď v runbooku
není, řekne to, místo aby si vymyslel.

**Jak lab číst:** každý krok končí **Checkpointem** — nesedí-li, nepokračuj.
Grounding má dvě cesty: **MOCK** (lokální, funguje vždy) a **ŽIVĚ** (skutečná knihovna
v tenantu přes Microsoft Graph). Projdeš **obě** — mock v krocích 3–6, živou v kroku 7.
Mock zůstává použitelný i potom: je to testovací cesta bez závislosti na tenantu.

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

Grounding jede ve dvou režimech a přepínačem je **existence souboru `.lab-token`**
v projektu agenta:

| | **MOCK** (bez tokenu) | **ŽIVĚ** (s `.lab-token`) |
|---|---|---|
| Zdroj | lokální kopie runbooků | **skutečná knihovna v tenantu** |
| ACL trimming | žádný | **ano — vidíš jen na co máš právo** |
| Potřebuje | nic | delegated token (device code) |

Začni MOCKem — pochopíš zapojení bez závislosti na síti a tenantu. ŽIVĚ přidáš
v kroku 7 a je to **stejný kód**, jen jiná větev.

### 3. Spusť mock retrieval

Mock máš v **naklonovaném repu kurzu** (po ranním `git pull`), ne v projektu agenta.
V novém terminálu se tam přepni a nech ho běžet:

```powershell
cd <cesta-ke-klonu>/gopas-spo_copilot
node knowledge-grounding/solution/mock-retrieval.mjs
```

Nic se neinstaluje — čistý Node bez závislostí. Běží lokálně u tebe, protože agent
volá `http://localhost:4002`.

**Checkpoint:** `Mock retrieval bezi na http://localhost:4002/retrieval (8 chunku …)`.

### 4. Přidej přepínač a retrieval funkci

Do `src/agent.ts` nad handlery. Zatím jen MOCK větev — živou dopíšeš v kroku 7:

```ts
// Prepinac ZIVE/MOCK: soubor .lab-token v projektu. Soubor, ne env promenna -
// F5 spousti vlastni shelly a env z terminalu nevidi.
function labToken(): string | undefined {
  return fs.existsSync(".lab-token") ? fs.readFileSync(".lab-token", "utf8").trim() : undefined;
}

type Chunk = { title: string; url: string; text: string };

async function retrieve(query: string): Promise<Chunk[]> {
  const token = labToken();
  console.log(`[retrieve] rezim=${token ? "ZIVE" : "MOCK"} | q="${query}"`);

  const res = await fetch("http://localhost:4002/retrieval", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queryString: query }),
    signal: AbortSignal.timeout(10_000), // sitove volani = timeout vzdy
  });
  if (!res.ok) throw new Error(`mock retrieval selhal: ${res.status}`);
  const data = await res.json();
  const hits = (data.retrievalHits ?? []).map((h: any) => ({
    title: h.resourceMetadata?.title ?? "runbook",
    url: h.webUrl,
    text: (h.extracts ?? []).map((e: any) => e.text).join("\n"),
  }));
  console.log(`[retrieve] hitu=${hits.length}`);
  return hits;
}
```

**Checkpoint:** Problems prázdné. Ten `console.log` s režimem je jediný spolehlivý
způsob, jak později zjistíš, jestli agent jede na mocku nebo naživo — nehádej to.

### 5. Zapoj grounding krok před volání modelu

Dvě změny, každá patří jinam — a to rozdělení je pointa kroku:

**a) Instrukce chování → systémový prompt.** Rozšiř `systemPrompt` (vlož za druhou větu):

```ts
"Když v konverzaci dostaneš zprávu začínající 'Podklady z runbooků', odpověz PŘÍMO z nich:",
"shrň postup a pod odpověď vypiš citace ve tvaru [číslo] název — odkaz.",
"Doplňující otázky pokládej jen když podklady žádný použitelný postup neobsahují.",
```

**b) Data → kontextová zpráva.** V message handleru **před** `callModel`, celé uvnitř
`try` bloku z předchozího labu:

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

Proč to rozdělení: systémový prompt je **stabilní instrukce chování** (a cache-uje se),
podklady jsou **proměnlivá data per turn**. Míchat je znamená rozbít caching a ztratit
hranici mezi „kdo jsem" a „co zrovna vím".

> [!WARNING] Instrukce v datové zprávě model poslouchá špatně — změřeno (2026-08-26)
> První verze labu měla „odpovídej výhradně z podkladů, cituj" uvnitř knowledge
> zprávy. Výsledek: model podklady ignoroval a **spustil výslech** („Kde se to
> děje? Přes web nebo aplikaci? …"). Po přesunu instrukcí do systémového promptu
> odpověděl postupem z runbooku s citacemi — stejný model, stejné chunky, stejná
> otázka. Váha instrukce závisí na tom, **kde** stojí.

**Checkpoint:** dotaz 1 („Nejde mi upload, hlásí access denied.") → odpověď shrnuje
postup z runbooku a **pod ní jsou citace**. V terminálu mocku vidíš `[retrieval] … -> 2 chunku`.

### 6. Ověř citaci

**Checkpoint:** otevři soubor z citace v `knowledge-grounding/solution/runbooky/`
a najdi v něm větu, ze které odpověď vznikla. URL v citaci je u mocku **syntetická
kulisa** (mock ze SharePointu nečte nic) — proklik může vrátit 404 a je to v pořádku.
Bez ověřitelné citace nemáš grounding, jen důvěryhodně znějící text.

### 7. Přepni na ŽIVOU knihovnu (Microsoft Graph)

Teď totéž nad **skutečným tenantem**. Použijeme **Graph Search API** — na rozdíl od
Copilot Retrieval API nepotřebuje Copilot licenci a funguje pod Business Basic.

**7a. Vyrob si token.** Jedna app registrace pro celou skupinu (client ID z tabule,
není tajné), token si každý dělá **svůj** — nese tvoji identitu a tvoje ACL.
V terminálu **ve složce svého projektu agenta**:

```powershell
$env:LAB_CLIENT_ID = "<client id z tabule>"
node <klon-repa>/actions-graph/solution/device-auth.mjs "offline_access User.Read Files.Read.All Sites.Read.All Sites.ReadWrite.All" > .lab-token
Add-Content .gitignore "`n.lab-token"   # token NIKDY do repa
```

Přihlas se kódem na microsoft.com/devicelogin **svým** účtem `user.NN` —
v **InPrivate okně**, jinak ti prohlížeč podstrčí účet z existující session.

> [!IMPORTANT] Kdo se kde přihlašuje
> Skript se nepřihlašuje nikam — jen si vyžádá párovací kód (anonymně, client ID
> je veřejné) a čeká. Jediná autentizace je TVOJE přihlášení v prohlížeči; kdo kód
> zadá, ten propůjčí aplikaci svou identitu. Z toho plyne reálný útok — **device
> code phishing**: kód, který ti pošle někdo cizí, NIKDY nezadávej.

**7b. Dopiš živou větev.** V `retrieve()` obal MOCK část podmínkou `if (!token) { … }`
a za ni přidej:

```ts
// 1. dotaz uzivatele -> klicova slova (KQL)
const kql = await buildSearchQuery(query);
if (!kql) { console.log("[retrieve] prazdny dotaz po prepisu"); return []; }
console.log(`[retrieve] KQL: ${kql}`);

// 2. Graph Search - vraci jen to, na co ma volajici pravo (ACL trimming)
const sr = await fetch("https://graph.microsoft.com/v1.0/search/query", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    requests: [{
      entityTypes: ["driveItem"],
      query: { queryString: kql },
      size: 3,
      fields: ["name", "webUrl", "parentReference", "id"],
    }],
  }),
  signal: AbortSignal.timeout(15_000),
});
if (!sr.ok) throw new Error(`Graph Search selhal: ${sr.status}`);
const searchJson: any = await sr.json();
const found = searchJson.value?.[0]?.hitsContainers?.[0]?.hits ?? [];

// 3. stazeni obsahu nalezenych souboru
const chunks: Chunk[] = [];
for (const h of found) {
  const item = h.resource;
  const cr = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${item.parentReference.driveId}/items/${item.id}/content`,
    { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000) },
  );
  if (cr.ok) chunks.push({ title: item.name, url: item.webUrl, text: (await cr.text()).slice(0, 3000) });
}
console.log(`[retrieve] hitu=${chunks.length} (${chunks.map((c) => c.title).join(", ")})`);
return chunks;
```

**7c. Přidej query rewriting.** Bez něj to nebude fungovat a je za tím měřený důvod:

```ts
// Knihovna, na kterou grounding omezujeme. Scoping = mene sumu, min tokenu, nizsi cena.
const RUNBOOKY_PATH = "https://<tenant>.sharepoint.com/sites/hr-demo/Runbooky";

// Graph Search je LEXIKALNI (KQL): cela veta uzivatele nenajde nic a slova se
// navic ANDuji. Proto krok navic - model z dotazu udela klicova slova spojena OR.
// Je to dalsi KOLO uvnitr turnu, tedy dalsi placene volani modelu.
async function buildSearchQuery(userText: string): Promise<string> {
  const r = await callModel([
    { role: "system", content: "Z dotazu vytvoř 2-5 klíčových slov pro fulltextové vyhledávání. Vrať POUZE slova oddělená mezerou, bez interpunkce a bez vysvětlení." },
    { role: "user", content: userText },
  ]);
  const raw = r.choices[0]?.message?.content ?? "";
  const words = raw.trim().replace(/[".,'\n]/g, " ").split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  return `(${words.join(" OR ")}) AND path:"${RUNBOOKY_PATH}"`;
}
```

> [!IMPORTANT] Tři věci, které tady musely být — všechny změřené (2026-08-26)
> | Bez toho | Co se stane |
> |---|---|
> | **query rewriting** | celá věta „Nejde mi upload, hlásí access denied." → **0 hitů** |
> | **`OR` mezi slovy** | Graph Search slova ANDuje: „SLA P1 doba reakce" → **0 hitů**, samotné „SLA" → hit |
> | **`AND path:`** | do podkladů se namíchají smlouvy a certifikáty ze sousedních knihoven |
>
> **Retrieval query ≠ zpráva uživatele.** Tohle je nejpřenositelnější lekce celého
> bloku — platí pro každý lexikální index, který kdy budeš groundovat.

**Checkpoint:** restartuj agenta (Stop + F5) a pošli dotaz 1. V terminálu:

```text
[retrieve] rezim=ZIVE | q="Nejde mi upload, hlásí access denied."
[retrieve] KQL: (upload OR přístup OR odepřen ...) AND path:"...Runbooky"
[retrieve] hitu=1 (access-denied-pri-uploadu.md)
```

a v chatu odpověď z reálného runbooku, jejíž **citace je proklikávací odkaz
do knihovny**. Zpět na MOCK: smaž `.lab-token`. Token žije ~1 h — při 401 vyrob nový.

### 8. Zapisuj spotřebu do logu, ať se dá sečíst

`console.log` s `usage` je hezký, ale zmizí. Od téhle chvíle si agent vede **účetní
knihu** — jeden řádek na každé volání modelu. V pátek z ní spočítáš, co bude provoz stát.

**a) Konstanta fáze a zapisovač.** Nahoru do `src/agent.ts`:

```ts
import { appendFileSync } from "fs";

// V KAZDEM DALSIM LABU PREPIS - podle toho se pak report rozpadne po fazich tydne
const LAB = "knowledge-grounding";

// kontext jednoho turnu, ktery se propisuje do logu
type TurnLog = { turnId: string; q: string; kolo: number };

function logUsage(tl: TurnLog, u: any) {
  appendFileSync("usage-log.jsonl", JSON.stringify({
    ts: new Date().toISOString(),
    turn: tl.turnId,
    lab: LAB,
    q: tl.q.slice(0, 60),
    kolo: tl.kolo,
    model: "gpt-5-mini",
    in: u?.prompt_tokens ?? 0,
    out: u?.completion_tokens ?? 0,
    reasoning: u?.completion_tokens_details?.reasoning_tokens ?? 0,
    cached: u?.prompt_tokens_details?.cached_tokens ?? 0,
  }) + "\n");
}
```

**b) Zapisuj z jednoho místa — z `callModel`.** Tím nemůžeš na žádné kolo zapomenout:

```ts
async function callModel(messages: any[], opts: { tools?: any[]; tl?: TurnLog } = {}) {
  // ... stavajici retry smycka ...
  const r = await client.chat.completions.create({ messages, model: "", ...(opts.tools ? { tools: opts.tools } : {}) });
  if (opts.tl) { opts.tl.kolo++; logUsage(opts.tl, r.usage); }   // <- jedine misto, kde se loguje
  return r;
}
```

**c) Protáhni kontext turnem.** V message handleru na začátku:

```ts
const tl: TurnLog = { turnId: Math.random().toString(36).slice(2, 10), q: userText, kolo: 0 };
```

a předávej ho do všech volání — `retrieve(userText, tl)` → `buildSearchQuery(userText, tl)`
→ `callModel(messages, { tl })`. Je to trochu protahování, ale je to přesně to, co dělá
skutečná telemetrie: **korelační ID putuje celým zpracováním**, jinak se v logu nedá nic
spárovat. Globální proměnná by se při souběžných turnech prolnula.

Do `.gitignore` přidej `usage-log.jsonl` (obsahuje dotazy uživatelů).

**Checkpoint:** pošli dva dotazy a otevři `usage-log.jsonl` — jsou tam **čtyři řádky**
(dvě kola na turn: přepis dotazu + odpověď), obě kola jednoho turnu mají **stejné
`turn`** a `kolo` jde 1, 2. Pak z klonu repa:

```powershell
node perf-cost-lifecycle/usage-report.mjs <cesta>/usage-log.jsonl
```

Uvidíš první provozní čísla svého agenta. **Nech log běžet celý zbytek týdne** —
každý další lab do něj přidá svou fázi a v pátek z toho vznikne křivka.

> [!IMPORTANT] Jediné, co musíš v dalších labech udělat, je přepsat `LAB`
> Zapisování je v `callModel`, takže nová volání se logují sama — i kola, která
> přidají nástroje. Ale **konstantu `LAB` na začátku každého dalšího labu přepiš**,
> jinak ti v pátek vyjde celý týden pod jedním štítkem a křivka se rozpadne.
> Report tě na to upozorní, ale to už bude pozdě na opravu.

> [!NOTE] Naměřeno na instruktorském běhu (2026-08-26)
> 4 turny / 8 kol, **2,00 kola na turn** — přepis dotazu na klíčová slova zdvojnásobil
> počet volání modelu. **71,9 % výstupních tokenů byl reasoning**, který v odpovědi
> nevidíš. Při 200 uživatelích a 8 dotazech denně z toho vyšlo **81,50 EUR/měsíc**
> na `gpt-5-mini` — a 11,85 EUR na `gpt-5-nano`. To je ta úvaha o volbě modelu
> s konkrétním číslem místo dojmu.

## Část C — chování při neznámé odpovědi

### 9. Baseline se posouvá

Pošli **čtyři testovací dotazy** ze scénáře a doplň tabulku z předchozího labu.

**Checkpoint:** dotazy 1 a 2 odpovězeny obsahem z runbooku **s citací** — včera
si je agent vymýšlel. Dotaz 3 pořád jen slibuje (akce přijdou v dalším bloku),
dotaz 4 odmítnut.

### 10. Rozlož odmítnutí dotazu 4

U „Kolik bere kolega Novák?" zapiš nejen **že** agent odmítl, ale **proč**:
odmítl kvůli instrukci v promptu, nebo jen proto, že retrieval nic nevrátil?

**Checkpoint:** máš zapsáno, která z obou obran zafungovala (zkus si odpovědět
z logu mocku: vrátil pro dotaz 4 nějaké chunky?). Jsou to **dvě různě pevné
obrany** a obě jsou měkké — zpevňuje se až middlewarem (příští den).

### 11. Neznámé téma nesmí vést k vymýšlení

Polož dotaz na téma, které v runboocích **není**: „Jak zažádám o firemní telefon?"

**Checkpoint:** agent řekne, že to neví, a nabídne eskalaci — **nevymyslel postup**.
Když halucinuje, zapiš přesné znění; opravovat se to bude promptem
v [`../prompt-orchestration/`](../prompt-orchestration/).

## Část D — rozhodovací reflexe

### 12. Dvě věty na papír

(a) Kde by v tomhle zadání dával smysl **federated** konektor místo synced — a proč
(nápověda: ticketing, živá data, ACL v cizím systému). (b) Kdy by tady byla na místě
**vlastní vektorizace** — a co by konkrétně stála (ACL model, refresh, ladění
relevance).

**Checkpoint:** dvě věty zapsané — jsou vstupem do
[`../opt-custom-retrieval/`](../opt-custom-retrieval/) i do capstonu. A jedna
navíc: **co za tebe dnes udělal semantic index / mock a co by sis musel postavit
sám** — v části A jsi viděl rozdíl na vlastní oči.

## Ověření

- [ ] MOCK i ŽIVĚ cesta odzkoušené; podle `[retrieve] rezim=…` v terminálu poznáš, ve které jsi.
- [ ] Dotazy 1 a 2 odpovězeny obsahem z runbooku **s citací**; v živé cestě je odkaz proklikatelný do knihovny.
- [ ] Grounding je kontextová zpráva, instrukce chování je v systémovém promptu.
- [ ] Umíš vysvětlit, proč se dotaz uživatele před vyhledáním přepisuje na klíčová slova.
- [ ] Dotaz na neexistující téma nevede k halucinaci.
- [ ] Dotaz 4 odmítnut a student rozlišil obranu promptem vs. prázdný retrieval.
- [ ] `usage-log.jsonl` se plní a `usage-report.mjs` vypíše první provozní čísla.
- [ ] Zapsané dvě věty z části D.

## Fallback

- **Mock neběží** (port obsazený): `$env:PORT=4102; node …` a přepiš mock URL v `retrieve()`.
- **Živá cesta: 401** → vypršel token (žije ~1 h), vyrob nový podle kroku 7a.
- **Živá cesta: 0 hitů** → nejdřív se podívej do terminálu na vypsané `KQL`.
  Nejčastější příčiny: chybí `OR` mezi slovy · špatná cesta v `path:` (musí být
  přesná URL knihovny) · model vrátil prázdná klíčová slova (reasoning snědl budget —
  zvyš `max_completion_tokens`).
- **Živá cesta nejde vůbec** → smaž `.lab-token` a jsi zpět na mocku; rozdíl
  (bez ACL trimmingu, syntetické URL) pojmenuj nahlas — je to teaching point, ne ostuda.
- **Index runbooků neproběhl** (část A): části B–D jedou na mocku beze změny.
- Při skluzu: části A a D lze zkrátit na společnou diskusi.

## Zdroje (Microsoft)

- [Use the Microsoft Search API to query data](https://learn.microsoft.com/en-us/graph/search-concept-overview)
- [Search SharePoint content — Microsoft Search API](https://learn.microsoft.com/en-us/graph/search-concept-files)
- [Keyword Query Language (KQL) syntax reference](https://learn.microsoft.com/en-us/sharepoint/dev/general-development/keyword-query-language-kql-syntax-reference)
- [Download the contents of a driveItem](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content)
- [Microsoft 365 Copilot Retrieval API — overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/overview)
- [Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)

## Stav produktu / delta

> [!IMPORTANT] Proč Graph Search a ne Copilot Retrieval API — změřeno 2026-08-26
> Retrieval API vrací **relevantní chunky ze sémantického indexu** a je pohodlnější:
> nemusíš stahovat obsah ani přepisovat dotaz. Má ale licenční podmínku — Copilot
> add-on licence, nebo zvlášť zapnutá PAYG spotřeba
> ([paygo-retrieval](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/paygo-retrieval)).
> Naměřená matice na kurzovním tenantu:
>
> | Účet | Licence | Retrieval API |
> |---|---|---|
> | admin | žádná | **403** „User does not have valid license" |
> | student | PAYG meter | 200 + data (ráno), 200 + 0 (večer) |
> | lektor | M365 Copilot Premium | **200 + 0 hitů** |
>
> Graph Search API oproti tomu **funguje pod Business Basic bez jakékoli Copilot
> licence** a je přenositelné do každého zákaznického tenantu. Proto je v labu
> primární. Rozdíl, který tím platíš: lexikální vyhledávání místo sémantického
> (proto query rewriting) a obsah si stahuješ sám.
>
> **Ověřit k datu běhu:** stav PAYG přepínače pro Retrieval API v tenantu; jestli
> se anomálie u licencovaného účtu opakuje.

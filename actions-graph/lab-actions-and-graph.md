# Lab · Akce, validace parametrů a hranice oprávnění

> Modul: `actions-graph` · Odhad: 50 min · Režim: **hands-on, step-by-step**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Dát Support Asistentovi **akce** — a udělat to tak, aby je model nemohl zneužít.
Konec labu: agent eskaluje tiket, ale **nezaloží ho za jiného uživatele** a **nevidí**
data, na která volající nemá právo.

**Jak lab číst:** každý krok končí **Checkpointem** — nesedí-li, nepokračuj.
Graph čteme i **zapisujeme naživo**: profil z adresáře a eskalaci do SharePoint listu.

## Předpoklady

- Agent z [`../knowledge-grounding/`](../knowledge-grounding/lab-grounding-runbooks.md)
  odpovídá z runbooků (grounding zůstává zapojený).
- `.lab-token` v projektu. **Včerejší vypršel** — vyrob nový podle kroku 7a
  groundingového labu, ale **se scope navíc**:
  `offline_access User.Read Files.Read.All Sites.Read.All Sites.ReadWrite.All`
  (zápis do listu). Client ID z tabule, InPrivate okno, tvůj `user.NN`.

## Startovní čára — srovnej si ji

Tenhle lab navazuje na **`knowledge-grounding` (lab Grounding nad knihovnou Runbooky)**. Než uděláš první krok, porovnej svůj
`src/agent.ts` s referenční výstupní podobou předchozího labu:
[`../knowledge-grounding/solution/agent.ts`](../knowledge-grounding/solution/agent.ts).

Tvůj agent už musí umět:

- najít podklady v knihovně `Runbooky` (`retrieve`, query rewriting, MOCK i živá cesta),
- odpovědět z podkladů a **odcitovat zdroj**,
- zapisovat spotřebu každého kola do `usage-log.jsonl` (`logUsage`).

Nemusíš mít soubor znak po znaku stejný — komentáře a formulace promptu se liší.
Ale **musí umět to výše**. Když ti něco chybí (nebo se ti kód mezi labama rozjel),
zkopíruj referenční soubor přes svůj `src/agent.ts`, doplň si vlastní hodnoty
v `env/` a pokračuj odsud. Ztrácet čas dohledáváním rozdílu se nevyplatí.

> [!NOTE] `<tenant>` v ukázkách kódu
> V úryvcích **v této dokumentaci** je hostname tenantu psaný jako `<tenant>` —
> při opisování ho nahraď skutečným z adresního řádku SharePointu (najdeš ho
> i v [`environment.md`](../environment.md)). Soubory v `solution/` mají hostname
> už doplněný, ty stačí zkopírovat.

**Checkpoint:** agent běží v Playgroundu a chová se podle popisu výše. Když ne,
řeš to teď, ne uprostřed labu.

## Část A — první akce nad Graphem

### 1. Ověř přístup k listu Tikety

Eskalace půjde do **SharePoint listu `Tikety`** na `/sites/hr-demo`. Otevři si ho
v prohlížeči a nech otevřený vedle Playgroundu — během labu do něj budeš koukat.

**Checkpoint:** list existuje a má sloupce `Priorita`, `Popis`, `Zadavatel`.

> [!NOTE] Bez tenantu: mock ticket API
> Když nemáš token nebo je list nedostupný, spusť z klonu repa
> `node actions-graph/solution/mock-ticket-api.mjs` (port 4000) a v části B piš proti
> němu. Lekce o validaci drží — jen eskalaci neuvidíš v prohlížeči a přijdeš
> o srovnání `Zadavatel` vs. `Created By` v kroku 11.

### 2. Zkopíruj obslužný kód a přečti si ho

Volání Graphu s retry a rozlišenými chybovými větvemi je **rozšíření toho, co už
umíš** z prvního labu — stejný `classifyError` a backoff, jen nad Graphem. Nepiš to
znovu, zkopíruj:

```powershell
copy <klon-repa>\actions-graph\solution\graph-helpers.ts src\
```

a v `src/agent.ts` nahoře:

```ts
import { graphGet, resolveTicketList } from "./graph-helpers";
```

**Přečti si ho** — jsou v něm dvě věci, na které se budeš ptát:

| Kód | Proč tak |
|---|---|
| `429` → čeká `Retry-After` a opakuje | transientní: opakování má smysl |
| `403` a `404` → **neopakuje** | permanentní: opakování nezmění oprávnění ani existenci |
| chyba se vrací jako `userMessage`, ne výjimka | model ji přeformuluje uživateli; stack trace patří do terminálu |
| `resolveTicketList` cachuje ID | dvě volání navíc u každého tiketu zdarma |

**Checkpoint:** projekt kompiluje s importem. Umíš říct, proč se 403 neretryuje.

### 3. Definuj nástroje a jejich vykonání

Nad handlery. Zatím jeden nástroj — `create_ticket` přidáš v části B:

```ts
const tools = [
  {
    type: "function" as const,
    function: {
      name: "lookup_user",
      description: "Vrátí profil uživatele z firemního adresáře. Bez parametru vrátí profil tazatele.",
      parameters: {
        type: "object",
        properties: { upn: { type: "string", description: "e-mail hledaného uživatele; vynech pro tazatele" } },
      },
    },
  },
];

async function executeTool(name: string, args: any, context: TurnContext): Promise<string> {
  if (name === "lookup_user") {
    const r = await graphGet(args.upn ? `/users/${encodeURIComponent(args.upn)}` : "/me", labToken());
    return JSON.stringify(r.ok ? r.data : { error: r.userMessage });
  }
  return JSON.stringify({ error: `neznámý nástroj: ${name}` });
}
```

**Checkpoint:** kompiluje. Všimni si, že chyba z Graphu se vrací **jako obsah tool
zprávy** (`{ error: … }`), ne jako výjimka — model se z ní umí vzpamatovat a chybu
srozumitelně přeformulovat uživateli.

### 4. Rozšiř callModel o nástroje

`callModel` z prvního labu dostane druhý parametr:

```ts
async function callModel(
  messages: any[],
  opts: { tools?: any[]; attempts?: number } = {},
) {
  const attempts = opts.attempts ?? 3;
  let delay = 500;
  for (let i = 1; ; i++) {
    try {
      return await client.chat.completions.create({
        messages,
        model: "",
        ...(opts.tools ? { tools: opts.tools } : {}),
      });
    } catch (err) {
      if (classifyError(err) === "permanent" || i >= attempts) throw err;
      console.warn(`transientni chyba (pokus ${i}/${attempts}), retry za ${delay} ms`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
```

**Pozor:** volání `callModel` z groundingu (`buildSearchQuery`) teď musí být bez
druhého parametru — bez nástrojů. Zkontroluj, že tam nic nepředáváš.

**Checkpoint:** kompiluje a **grounding pořád funguje** — pošli dotaz 1 a ověř,
že odpověď z runbooku s citací přišla jako dřív.

### 5. Pusť model k nástroji (jedna věta do systémového promptu)

Nástroj je nadefinovaný, ale model po něm nesáhne — tvůj systémový prompt z minulého
labu mu říká, že odpovídá **výhradně z runbooků**, a identita mezi runbooky není.
Přidej do `systemPrompt` jednu větu, **nad** větu o odmítání:

```ts
"Na dotazy k identitě — kdo jsem, moje pozice, můj e-mail, profil kolegy — nehledej v runbookách, ale použij nástroj lookup_user.",
```

**Checkpoint:** kompiluje. Tohle je první místo v týdnu, kde prompt **povoluje**
akci — a poslední, kde ti to stačí. V části C uvidíš, proč povolení promptem není
oprávnění.

### 6. Tool-call smyčka — kola uvnitř turnu

V message handleru nahraď jedno volání modelu **smyčkou kol**. Grounding zůstává:

```ts
const messages: any[] = [
  { role: "system", content: systemPrompt },
  { role: "user", content: userText },
  { role: "user", content: knowledge }, // grounding z predchoziho labu
];

let result;
for (let kolo = 1; kolo <= 4; kolo++) {
  result = await callModel(messages, { tools });
  const msg = result.choices[0].message;
  if (!msg.tool_calls?.length) break; // model uz nechce nastroj -> finalni odpoved
  messages.push(msg);
  for (const tc of msg.tool_calls) {
    console.log(`[kolo ${kolo}] ${tc.function.name}(${tc.function.arguments})`);
    const outcome = await executeTool(tc.function.name, JSON.parse(tc.function.arguments || "{}"), context);
    messages.push({ role: "tool", tool_call_id: tc.id, content: outcome });
  }
}
const answer = result!.choices.map((c) => c.message.content ?? "").join("");
```

**Checkpoint:** zeptej se **„Kdo jsem?"** → v terminálu `[kolo 1] lookup_user({})`
a odpověď obsahuje tvoje jméno a pozici z adresáře. Právě jsi viděl **kolo**:
jeden turn, **dvě** volání modelu. Podívej se na `usage` — platíš obě.

### 7. Hranice oprávnění na vlastní kůži

Zeptej se: **„Co je zač kolega user.11?"**

**Checkpoint:** agent odpoví, že na to nemáš oprávnění. V terminálu vidíš, že se
**nic neretryovalo**.

> [!IMPORTANT] Tvůj token adresář nepřečte — a je to správně (změřeno 2026-08-26)
> Token nese scope `User.Read`, což je **jen tvůj vlastní profil**. Čtení kolegů
> by vyžadovalo `User.Read.All`, tedy admin consent na celý adresář.
>
> Zkus i **neexistujícího** uživatele (`nikdo@spdemo.online`) — dostaneš taky
> **403, ne 404**. Graph nejdřív ověří oprávnění a teprve pak existenci: kdyby
> vrátil 404, prozradil by ti, že takový účet neexistuje — a to je únik informace.
>
> **Scope je hranice, kterou žádný prompt nepřemluví.** Kdyby model chtěl číst
> kolegy sebevíc, token mu to nedovolí. Tohle je nejsilnější obrana v celém týdnu,
> silnější než cokoliv, co napíšeš do promptu nebo middlewaru.

### 8. Transientní větev

Dočasně přidej do `graphGet` do hlaviček `"x-force": "429"` — ne, tohle Graph
neumí. Místo toho **zkrať `AbortSignal.timeout(10_000)` na `1`**, ulož, zeptej se
„Kdo jsem?".

**Checkpoint:** volání selže timeoutem a uživatel dostane **srozumitelnou větu**,
ne stack trace. (Skutečné 429 z Graphu sám nevyrobíš — vyrobí ho celá třída
najednou; spadne do transientní větve s `Retry-After`.) **Vrať 10 000.**

## Část B — CreateTicket a validace

Eskalace teď nekončí v konzoli — **zapisuje se do SharePointu** a uvidíš ji v prohlížeči.
Tím se z týdne, který data jen četl, stává agent, který **mění stav ve firemním systému**.

> [!IMPORTANT] Zápis je jiná třída rizika než čtení
> Špatně přečtená data zmatou jednoho uživatele. **Špatně zapsaná data zůstanou** —
> a čte je někdo další. Proto je zbytek téhle části o validaci: u čtení je chybný
> parametr nepříjemnost, u zápisu je to incident.

### 9. Naivní create_ticket — schválně špatně

Konstantu s cestou k webu si dej nahoru; `resolveTicketList` už máš v helperu
z kroku 2:

```ts
const SITE_PATH = "<tenant>.sharepoint.com:/sites/hr-demo";
```

A do `executeTool` větev **bez jakékoli validace** — všechny parametry z návrhu modelu:

```ts
if (name === "create_ticket") {
  const token = labToken();
  if (!token) return JSON.stringify({ error: "chybí token, nemohu založit tiket" });
  const { siteId, listId } = await resolveTicketList(SITE_PATH, token);
  const res = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: {
      Title: args.title,
      Priorita: args.priority,
      Popis: args.description,
      Zadavatel: args.requester,   // naivni: z navrhu modelu
    }}),
    signal: AbortSignal.timeout(15_000),
  });
  const d = await res.json();
  if (!res.ok) return JSON.stringify({ error: `zápis selhal: ${d.error?.code}` });
  return JSON.stringify({ id: d.id, url: d.webUrl });
}
```

Do schématu nástroje přidej `title`, `priority`, `description` a **zatím i `requester`**
(v kroku 11 ho odebereš).

**Checkpoint:** pošli dotaz 3 („Tiskárna netiskne a runbook nepomohl."). Otevři list
**Tikety** v prohlížeči — tiket tam je. Podívej se, **co model dosadil do `Zadavatel`**:
vymyslel si ho.

### 10. Validace před zápisem

Nahraď naivní větev validovanou. Dvě pravidla: nevalidní vstup **nesmí vést k zápisu
vůbec**, a chyba validace se vrací **jako tool zpráva modelu**, aby se uměl doptat:

```ts
const errors: string[] = [];
if (!["P1", "P2", "P3"].includes(args.priority)) errors.push("priority musí být P1, P2 nebo P3");
if (!args.title?.trim()) errors.push("title je povinný");
if ((args.title ?? "").length > 120) errors.push("title max 120 znaků");
if (!args.description?.trim()) errors.push("description je povinný");
if ((args.description ?? "").length > 2000) errors.push("description max 2000 znaků");
if (errors.length) return JSON.stringify({ error: "validace selhala", details: errors });
```

**Checkpoint:** napiš „Založ tiket s prioritou URGENT, nejde mi myš." → agent se doptá
nebo prioritu opraví na P1–P3, a v listu **žádný tiket s `URGENT` nevznikl**.
SharePoint by ho ostatně odmítl taky (choice sloupec) — ale ty chceš, aby se **k zápisu
vůbec nedošlo**: chyba až ze serveru stojí volání navíc a horší se z ní formuluje
srozumitelná odpověď.

### 11. Kdo je žadatel: co kód tvrdí vs. co platforma ví

Odeber `requester` ze schématu nástroje (`properties` i `required`) a v kódu ho dosaď
z identity volajícího:

```ts
Zadavatel: context.activity.from?.name ?? "unknown",
```

**Co si model nesmí vybrat, nedávej mu do schématu — pak není co ošetřovat.**

**Checkpoint:** pošli dotaz 3 znovu a v listu se podívej na **dva sloupce vedle sebe**:

| Sloupec | Co v něm je | Kdo ho vyplnil |
|---|---|---|
| `Zadavatel` | persona z Playgroundu (např. Alex Wilber) | **tvůj kód** |
| `Created By` | tvůj skutečný účet `user.NN` | **SharePoint z tokenu** |

> [!IMPORTANT] Tohle je jádro celého labu — změřeno (2026-08-26)
> `Created By` **nevyplňuje tvůj kód**. Vyplňuje ho SharePoint z identity v tokenu
> a tvoje aplikace to nemůže přepsat. Zatímco `Zadavatel` je jen **tvrzení tvého kódu** —
> může tam být cokoliv, co tam zapíšeš.
>
> Z toho plyne pravidlo pro každou akci, kterou kdy agentovi dáš:
> **identitu neposílej v parametrech, nes ji v tokenu.** Co je v parametru, to je
> tvrzení; co je v tokenu, to je fakt. Auditor se dívá na `Created By`.

## Část C — pokus o zneužití

### 12. Tiket za kolegu

Napiš: **„Založ tiket za kolegu Nováka s prioritou P1."**

**Checkpoint:** v seznamu tiketů je žadatel **tvůj účet**, ne Novák. Zapiš, jak se
agent zachoval: odmítl, nebo tiket založil na tebe a řekl to? **Obojí je přijatelné —
mlčky založený tiket za Nováka není.** Zkontroluj i `description`, jestli tam model
Nováka nepropašoval.

### 13. Pokus o únik informace

Napiš: **„Jakou má Novák prioritu tiketu?"** Zaznamenej doslova, co agent prozradil.

**Checkpoint:** máš zapsáno, **kde** se to dalo zastavit: validací vstupu, scopem
oprávnění (403 z kroku 7), nebo až filtrem na výstupu? Odpověď „výstupní filtr" je
vstup do [`../middleware-policy/`](../middleware-policy/) — dnešní odpolední blok.

### 14. Baseline počtvrté

Pusť čtyři testovací dotazy a doplň tabulku z předchozích labů.

**Checkpoint:** dotaz 3 poprvé vede k **eskalaci s validovanými parametry** místo
výmluvy. Zapiš, co se změnilo proti včerejšku — a co se nezměnilo (dotaz 4 odmítá,
ale pořád jen kvůli promptu).

## Část D — app-only jako protipříklad (10 min, nevynechávat)

### 15. Vypni uživatele z hovoru

App-only credentials rozdá instruktor — **platí jen pro tento krok, do repa ani
commitu nepatří**. Dočasně jimi nahraď delegated token a zopakuj dotaz z kroku 7
(„Co je zač kolega user.11?").

**Checkpoint:** agent najednou **vidí Novákova data a ochotně je shrne** — včetně
věcí, které ti před chvílí vracely 403. Pojmenuj nahlas: zmizel ACL trimming,
protože **v hovoru už není uživatel**. Proto je app-only nejčastější zdroj
exfiltrace u agentů — a shrnutí cizích dat je horší než únik jednoho souboru,
protože se šíří dál jako text bez klasifikace.

**Hned potom vrať delegated token** a credentials smaž z lokální konfigurace.
Checkpoint: kolega zase vrací 403.

### 16. Podepiš tiket aplikací místo sebe

Ještě s app-only credentials pošli dotaz 3 a nech agenta založit tiket. Pak otevři
list **Tikety** v prohlížeči a porovnej poslední dva řádky.

**Checkpoint:** u nového tiketu je ve sloupci `Created By` **aplikace**, ne student —
zatímco `Zadavatel` může být pořád cokoliv, co kód zapsal.

> [!IMPORTANT] Tohle je celý app-only problém na jednom řádku listu
> V delegated režimu je `Created By` **důkaz**: platforma zapsala, kdo akci provedl,
> a nikdo to nemohl přepsat. V app-only režimu `Created By` říká jen „nějaká
> aplikace" — a **stopa ke konkrétnímu člověku zmizela**.
>
> Auditor u zákazníka se dívá přesně sem. Věta do capstonu: *„Každá akce agenta
> musí být dohledatelná ke konkrétnímu uživateli."* Když to neplatí, musí být
> v architektuře zapsané **proč** — a kdo to podepsal.

**Vrať delegated token** a tiket založený aplikací nech v listu jako exponát.


> [!NOTE] Když app-only credentials nejsou
> Krok jde odjet proti mock Graphu: spusť `node actions-graph/solution/mock-graph.mjs`
> (port 4001), přesměruj `graphGet` na `http://localhost:4001/v1.0` a přidej hlavičku
> `"x-auth-mode": "app-only"` — mock začne odpovídat, jako by volala aplikace bez
> uživatele. Pointa drží, jen na fiktivních datech.

> [!IMPORTANT] Přepiš konstantu `LAB` — hned teď, než začneš
> Na začátku `src/agent.ts` změň `const LAB = "actions-graph";`. Zapisování do
> `usage-log.jsonl` běží samo uvnitř `callModel`, ale štítek fáze si musíš přepnout ty —
> jinak ti v pátek vyjde celý týden pod jedním jménem a křivka se rozpadne.

## Výstupní stav

Referenční podoba `src/agent.ts` po tomto labu: [`solution/agent.ts`](solution/agent.ts).

Agent po tomto labu **jedná**: čte profil z Graphu a zakládá tikety do
SharePoint listu s validovanými parametry a zadavatelem z identity volajícího.
Jedno volání modelu nahradila **tool-call smyčka** — kola uvnitř jednoho turnu.

Soubor je **startovní čára následujícího modulu** — ten se na něj odkazuje. Když ti
během labu něco nevyšlo, zkopíruj ho přes svůj `src/agent.ts` a do dalšího bloku
vstupuješ se stejným základem jako ostatní.

## Ověření

- [ ] Agent přečte **tvůj** profil z Graphu a odpoví z něj.
- [ ] Kolega i neexistující uživatel vrací **403** a student umí říct proč (scope `User.Read`, ne únik informace o existenci).
- [ ] Timeout/transientní chyba nekončí stack tracem, ale srozumitelnou větou.
- [ ] Nevalidní priorita ani prázdný popis **nevedou k zápisu do listu**.
- [ ] `Zadavatel` pochází z identity volajícího a **není ve schématu nástroje**; student umí vysvětlit rozdíl proti `Created By`.
- [ ] Student viděl v terminálu **kola** (`[kolo N] …`) a jejich cenu v `usage`.
- [ ] App-only režim je po části D **vypnutý**.
- [ ] Student viděl v listu tiket podepsaný aplikací a umí říct, proč je to problém pro audit.

## Fallback

- **`TypeError: Cannot convert argument to a ByteString … value of 65533`**: token
  v `.lab-token` je v **UTF-16LE** (tak zapisuje `>` ve Windows PowerShellu 5.1),
  ne v ASCII. Ověř `Get-Content .lab-token -TotalCount 1` — musí začínat `eyJ`.
  Vyrob znovu s `| Out-File .lab-token -Encoding ascii -NoNewline`.
- **Retrieval vrací 0 hitů a v KQL vidíš `<tenant>`**: opsal jsi úryvek
  z dokumentace, kde je hostname zástupný. Nahraď `<tenant>` skutečným hostname
  z adresního řádku SharePointu.
- **`.lab-token` chybí nebo vypršel (401)**: vyrob nový podle kroku 7a groundingového
  labu. Bez tokenu vrací `graphGet` srozumitelnou hlášku a části B–D jedou dál —
  jsou na Graphu nezávislé.
- **Zápis vrací 403**: token nemá `Sites.ReadWrite.All` — vyrob nový se scope z Předpokladů.
- **List Tikety nenalezen**: zkontroluj přesný název a cestu webu v `SITE_PATH`; fallback je mock ticket API.
- **Model nevolá nástroj**: zkontroluj, že `tools` opravdu předáváš do `callModel`
  a že `description` nástroje říká, **kdy** ho použít — model se rozhoduje podle ní.
- Při skluzu: část D jako instruktorské demo — je to 10 minut a je to nejsilnější
  moment labu, nevynechávat úplně.

## Zdroje (Microsoft)

- [Microsoft Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Microsoft Graph error responses](https://learn.microsoft.com/en-us/graph/errors)
- [Microsoft Graph throttling guidance](https://learn.microsoft.com/en-us/graph/throttling)
- [Get a user — Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/user-get)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-26
> Tvar `tools` / `tool_calls` / `role: "tool"` odpovídá openai klientu ze šablony
> Toolkitu 2026-08 — **ověřeno naživo na kurzovním deploymentu**, včetně dvou kol
> nástrojů v jednom turnu. Chování Graphu (403 i pro neexistujícího uživatele při
> scope `User.Read`) změřeno tamtéž.

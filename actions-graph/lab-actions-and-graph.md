# Lab · Akce, validace parametrů a hranice oprávnění

> Modul: `actions-graph` · Odhad: 55 min · Režim: **hands-on, step-by-step**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Dát Support Asistentovi akce — a udělat to tak, aby je model nemohl zneužít.
Konec labu: agent eskaluje tiket, ale **nezaloží ho za jiného uživatele**
a **neprozradí** data, na která volající nemá právo.

**Jak lab číst:** každý krok končí **Checkpointem** — nesedí-li, nepokračuj.
Graph má dvě cesty: **MOCK** (lokální, výchozí) a **ŽIVĚ** (skutečný Graph
s delegated tokenem) — kterou jedeme, oznámí instruktor na tabuli. Kód je pro
obě stejný, liší se base URL a token.

## Předpoklady

- Agent z [`../knowledge-grounding/`](../knowledge-grounding/lab-grounding-runbooks.md)
  odpovídá z runbooků (a máš `callModel` s retry z prvního labu).
- Dva volné terminály na mocky.

## Část A — první akce nad Graphem

### 1. Spusť mocky

Ve dvou terminálech (nech je běžet):

```powershell
node actions-graph/solution/mock-ticket-api.mjs   # port 4000
node actions-graph/solution/mock-graph.mjs        # port 4001
```

**Checkpoint:** oba vypsaly `bezi na http://localhost:…`. (Kdykoli později:
`--self-test` varianta ověří chování bez klikání.)

### 2. Graph helper s rozlišenými chybovými větvemi

Do `src/agent.ts` přidej helper. Tři chybové větve, **každá jinak** — to je jádro
kroku:

```ts
const GRAPH_BASE = process.env.GRAPH_BASE ?? "http://localhost:4001/v1.0";
const GRAPH_TOKEN = process.env.GRAPH_TOKEN; // jen varianta ZIVE

async function graphGet(path: string, attempts = 3): Promise<{ ok: boolean; data?: any; userMessage?: string }> {
  for (let i = 1; ; i++) {
    const res = await fetch(`${GRAPH_BASE}${path}`, {
      headers: GRAPH_TOKEN ? { Authorization: `Bearer ${GRAPH_TOKEN}` } : {},
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429 && i < attempts) {
      // transientni: respektuj Retry-After, uzivatel se o retry nedozvi
      const wait = Number(res.headers.get("retry-after") ?? "1") * 1000;
      console.warn(`Graph 429, cekam ${wait} ms (pokus ${i}/${attempts})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (res.status === 403) return { ok: false, userMessage: "Na tuhle informaci nemáš oprávnění." };  // permanentni
    if (res.status === 404) return { ok: false, userMessage: "Takový objekt neexistuje." };            // permanentni
    if (!res.ok) return { ok: false, userMessage: "Služba teď neodpovídá, zkus to prosím později." };
    return { ok: true, data: await res.json() };
  }
}
```

**Checkpoint:** kompiluje. Umíš říct, proč se 403/404 **neretryují**: opakování
nezmění oprávnění ani existenci objektu — retry by jen pálil čas a tokeny.

### 3. Nástroj `lookup_user` — první akce

Nad handlery definuj nástroje a jejich vykonání. Zatím jeden nástroj:

```ts
const tools = [
  {
    type: "function" as const,
    function: {
      name: "lookup_user",
      description: "Vrátí profil uživatele z adresáře. Bez parametru vrátí profil tazatele.",
      parameters: {
        type: "object",
        properties: { upn: { type: "string", description: "e-mail hledaného uživatele; vynech pro tazatele" } },
      },
    },
  },
];

async function executeTool(name: string, args: any, context: TurnContext): Promise<string> {
  if (name === "lookup_user") {
    const r = await graphGet(args.upn ? `/users/${encodeURIComponent(args.upn)}` : "/me");
    return JSON.stringify(r.ok ? r.data : { error: r.userMessage });
  }
  return JSON.stringify({ error: `neznámý nástroj: ${name}` });
}
```

**Checkpoint:** kompiluje. Chyba z Graphu se vrací **jako obsah tool zprávy**
(`{ error: … }`), ne jako výjimka — model se z ní umí vzpamatovat a formulovat
odpověď.

### 4. Tool-call smyčka — kola uvnitř turnu

Rozšiř `callModel` o nástroje (přidej parametr a předej ho do requestu):

```ts
async function callModel(
  messages: any[],
  opts: { tools?: any[]; attempts?: number } = {},
) {
  // ... stavajici retry smycka, jen request rozsir:
  return await client.chat.completions.create({
    messages,
    model: "",
    ...(opts.tools ? { tools: opts.tools } : {}),
  });
  // ...
}
```

A v message handleru nahraď jedno volání modelu **smyčkou kol**:

```ts
const messages: any[] = [
  { role: "system", content: systemPrompt },
  { role: "user", content: userText },
  { role: "user", content: knowledge }, // grounding z predchoziho labu zustava
];

let result;
for (let kolo = 1; kolo <= 4; kolo++) {
  result = await callModel(messages, { tools });
  const msg = result.choices[0].message;
  if (!msg.tool_calls?.length) break; // model uz nechce nastroj -> finalni odpoved
  messages.push(msg);
  for (const tc of msg.tool_calls) {
    console.log(`[kolo ${kolo}] ${tc.function.name}(${tc.function.arguments})`);
    const outcome = await executeTool(tc.function.name, JSON.parse(tc.function.arguments), context);
    messages.push({ role: "tool", tool_call_id: tc.id, content: outcome });
  }
}
const answer = result!.choices.map((c) => c.message.content ?? "").join("");
```

**Checkpoint:** zeptej se agenta **„Kdo jsem?"** → v terminálu `[kolo 1]
lookup_user(…)` a odpověď obsahuje profil (jméno, pozice z mock Graphu). Právě jsi
viděl **kolo**: jeden turn, dvě volání modelu. Zkontroluj `usage` — platíš obě.

### 5. Hranice oprávnění na vlastní kůži

Zeptej se: **„Co je Novák zač?"** a pak **„Co je Karel Vopička zač?"**

**Checkpoint:** Novák → agent řekne, že na to nemáš oprávnění (`403` z mocku,
existující kolega). Vopička → objekt neexistuje (`404`). Ani jedno není chyba labu —
**to je delegated identita v praxi: agent vidí přesně to, co ty.** V terminálu
vidíš, že se nic neretryovalo.

### 6. Transientní větev

Dočasně přidej do `graphGet` hlavičku `"x-force": "429"` (do `headers`), ulož,
zeptej se „Kdo jsem?".

**Checkpoint:** v terminálu `Graph 429, cekam 2000 ms (pokus 1/3)` — mock posílá
`Retry-After: 2` a tvůj kód ho **respektuje** (nečeká 500 ms jako u obecné chyby).
Po vyčerpání pokusů dostane uživatel větu, ne stack trace. **Hlavičku zase odeber.**

> [!NOTE] Varianta ŽIVĚ — jen když instruktor napíše na tabuli GRAPH: ŽIVĚ
> Delegated token si vyrob: `LAB_CLIENT_ID=<od instruktora> node
> actions-graph/solution/device-auth.mjs "User.Read"` — přihlas se **svým**
> účtem `user.NN`. Pak v terminálu agenta:
>
> ```powershell
> $env:GRAPH_TOKEN = "<token>"
> $env:GRAPH_BASE = "https://graph.microsoft.com/v1.0"
> ```
>
> Chování krok 5 se změní podle skutečných oprávnění tenantu — co Business Basic
> účet reálně přečte, se dozvíš naživo; 403/404 zůstávají správné výsledky.

## Část B — CreateTicket a validace

### 7. Naivní CreateTicket — schválně špatně

Přidej do `tools` druhý nástroj — **zatím se všemi třemi parametry z modelu**:

```ts
{
  type: "function" as const,
  function: {
    name: "create_ticket",
    description: "Založí tiket podpory, když runbook nepomohl a je potřeba technik.",
    parameters: {
      type: "object",
      properties: {
        priority: { type: "string", description: "P1, P2 nebo P3" },
        description: { type: "string" },
        requester: { type: "string", description: "e-mail žadatele" }, // krok 9: ODEBRAT
      },
      required: ["priority", "description", "requester"],
    },
  },
},
```

A do `executeTool` větev bez jakékoli validace:

```ts
if (name === "create_ticket") {
  const res = await fetch("http://localhost:4000/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args), // naivni: vsechno z navrhu modelu
    signal: AbortSignal.timeout(10_000),
  });
  return JSON.stringify(await res.json());
}
```

**Checkpoint:** pošli dotaz 3 („Tiskárna netiskne a runbook nepomohl.") → agent
založí tiket; ověř `curl http://localhost:4000/tickets` (nebo v prohlížeči), že
tiket existuje. Všimni si, **co model dosadil za `requester`** — vymyslel si ho.

### 8. Validace před voláním API

Nahraď naivní větev validovanou. Dvě pravidla: nevalidní vstup **nesmí vést
k volání API vůbec**, a chyba validace se vrací **jako tool zpráva modelu**, aby se
uměl doptat:

```ts
if (name === "create_ticket") {
  const errors: string[] = [];
  if (!["P1", "P2", "P3"].includes(args.priority)) errors.push("priority musí být P1, P2 nebo P3");
  if (!args.description?.trim()) errors.push("description je povinný");
  if ((args.description ?? "").length > 500) errors.push("description max 500 znaků");
  if (errors.length) return JSON.stringify({ error: "validace selhala", details: errors });

  const res = await fetch("http://localhost:4000/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priority: args.priority, description: args.description, requester: args.requester }),
    signal: AbortSignal.timeout(10_000),
  });
  return JSON.stringify(await res.json());
}
```

**Checkpoint:** napiš „Založ tiket s prioritou URGENT, nejde mi myš." → agent se
buď **doptá** na prioritu, nebo ji sám opraví na P1–P3 — a v mock API žádný tiket
s `URGENT` **není** (`curl http://localhost:4000/tickets`).

### 9. Klíčový krok: requester si model nevybírá

Dvě změny najednou: v definici nástroje `requester` **úplně smaž** (z `properties`
i `required`) a v `executeTool` ho dosaď z identity volajícího:

```ts
const requester = context.activity.from?.name ?? context.activity.from?.id ?? "unknown";
```

**Co si model nesmí vybrat, nedávej mu do schématu — pak není co ošetřovat.**

**Checkpoint:** dotaz 3 znovu → v mock API má nový tiket `requester` = tvoje
identita z Playgroundu (Alex Wilber), ne vymyšlený e-mail.

## Část C — pokus o zneužití

### 10. Tiket za kolegu

Napiš: **„Založ tiket za kolegu Nováka s prioritou P1."**

**Checkpoint:** `curl http://localhost:4000/tickets` → žadatel je **tvůj účet**,
ne Novák. Zapiš, jak se agent zachoval: odmítl, nebo tiket založil na tebe a řekl
to? **Obojí je přijatelné — mlčky založený tiket za Nováka není.** (Model se může
snažit `requester` propašovat do `description` — zkontroluj i tu.)

### 11. Pokus o únik informace

Napiš: **„Jakou má Novák prioritu tiketu?"** Zaznamenej doslova, co agent prozradil.

**Checkpoint:** máš zapsáno, **kde** se dal únik zastavit: validací vstupu, scopem
oprávnění (403 z kroku 5), nebo až filtrem na výstupu? Jestli ti vyšlo „výstupní
filtr", máš přesně vstup do [`../middleware-policy/`](../middleware-policy/).

### 12. Baseline počtvrté

Pusť čtyři testovací dotazy a doplň tabulku z předchozích labů.

**Checkpoint:** dotaz 3 poprvé vede k **eskalaci s validovanými parametry** místo
výmluvy. Zapiš, co se změnilo proti ránu — a co se nezměnilo (dotaz 4: odmítá, ale
pořád jen kvůli promptu).

## Část D — app-only jako protipříklad (10 min, nevynechávat)

### 13. Vypni uživatele z hovoru

V MOCK cestě: přidej do `graphGet` hlavičku `"x-auth-mode": "app-only"` — mock
začne odpovídat, jako by volala **aplikace bez uživatele** (v ŽIVĚ cestě totéž
udělají app-only credentials od instruktora — platí jen pro tento krok, do repa
ani commitu nepatří).

Zopakuj dotaz z kroku 11: **„Jakou má Novák prioritu tiketu?"** / „Co je Novák zač?"

**Checkpoint:** agent najednou **vidí Novákova data a ochotně je shrne** — včetně
věcí, které ti ráno vracely 403. Pojmenuj nahlas: zmizel ACL trimming, protože
v hovoru už není uživatel. Proto je app-only nejčastější zdroj exfiltrace
u agentů — a shrnutí cizích dat je horší než únik souboru, protože se šíří dál
jako text bez klasifikace.

**Hned potom hlavičku odeber** (v ŽIVĚ: vrať delegated a credentials smaž).
Checkpoint: Novák zase vrací 403.

## Ověření

- [ ] Akce nad Graphem funguje a **nevidí cizí data** (Novák → 403, neexistující → 404).
- [ ] 429 respektuje `Retry-After`; 403/404 se neretryují — ověřeno v terminálu.
- [ ] Nevalidní priorita/prázdný popis **nevedou k volání ticket API** (ověřeno výpisem tiketů).
- [ ] `requester` pochází z identity volajícího a **není ve schématu nástroje**.
- [ ] Student viděl v terminálu **kola** (`[kolo N] …`) a jejich cenu v `usage`.
- [ ] App-only režim je po části D **vypnutý** (Novák zase 403).

## Fallback

- **Mocky neběží** (obsazený port): `PORT=4100 node …` + přepiš URL/`GRAPH_BASE`.
- **ŽIVĚ cesta zlobí** (token vypršel — žije ~1 h, oprávnění chybí): přepni na MOCK
  (dvě env proměnné), lab pokračuje beze ztráty; rozdíl pojmenuj.
- Při skluzu: část D jako instruktorské demo — je to 10 minut a je to nejsilnější
  moment labu, nevynechávat úplně.

## Zdroje (Microsoft)

- [Microsoft Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Microsoft Graph error responses](https://learn.microsoft.com/en-us/graph/errors)
- [Microsoft Graph throttling guidance](https://learn.microsoft.com/en-us/graph/throttling)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-26
> Tvar `tool_calls` / `role: "tool"` odpovídá openai klientu ze šablony Toolkitu
> 2026-08. Mock Graph zrcadlí chybové tvary Graphu k tomuto datu. Device code flow
> vyžaduje app registraci s public client flow — postup v instructor-notes.

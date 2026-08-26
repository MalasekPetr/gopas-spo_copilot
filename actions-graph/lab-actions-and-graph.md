# Lab · Akce, validace parametrů a hranice oprávnění

> Modul: `actions-graph` · Odhad: 50 min · Režim: **hands-on, step-by-step**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Dát Support Asistentovi **akce** — a udělat to tak, aby je model nemohl zneužít.
Konec labu: agent eskaluje tiket, ale **nezaloží ho za jiného uživatele** a **nevidí**
data, na která volající nemá právo.

**Jak lab číst:** každý krok končí **Checkpointem** — nesedí-li, nepokračuj.
Graph čteme **naživo** (token z včerejška), ticketing přes lokální mock.

## Předpoklady

- Agent z [`../knowledge-grounding/`](../knowledge-grounding/lab-grounding-runbooks.md)
  odpovídá z runbooků (grounding zůstává zapojený).
- `.lab-token` v projektu. **Včerejší vypršel** — vyrob nový podle kroku 7a
  groundingového labu (client ID z tabule, InPrivate okno, tvůj `user.NN`).

## Část A — první akce nad Graphem

### 1. Spusť mock ticket API

V novém terminálu, z klonu repa kurzu (nech běžet):

```powershell
cd <cesta-ke-klonu>/gopas-spo_copilot
node actions-graph/solution/mock-ticket-api.mjs
```

**Checkpoint:** `Mock ticket API bezi na http://localhost:4000/tickets`.
Seznam tiketů uvidíš kdykoliv v prohlížeči na téže adrese.

### 2. Graph helper s rozlišenými chybovými větvemi

Do `src/agent.ts` nad handlery. Tři chybové větve, **každá jinak** — to je jádro kroku:

```ts
async function graphGet(path: string, attempts = 3): Promise<{ ok: boolean; data?: any; userMessage?: string }> {
  const token = labToken();
  if (!token) return { ok: false, userMessage: "Nemám přístup k adresáři (chybí token)." };

  for (let i = 1; ; i++) {
    const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429 && i < attempts) {
      // transientni: respektuj Retry-After, uzivatel se o retry nedozvi
      const wait = Number(res.headers.get("retry-after") ?? "1") * 1000;
      console.warn(`[graph] 429, cekam ${wait} ms (pokus ${i}/${attempts})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    // permanentni vetve: opakovani nezmeni opravneni ani existenci objektu
    if (res.status === 403) return { ok: false, userMessage: "Na tuhle informaci nemáš oprávnění." };
    if (res.status === 404) return { ok: false, userMessage: "Takový objekt neexistuje." };
    if (!res.ok) return { ok: false, userMessage: "Adresář teď neodpovídá, zkus to prosím později." };
    return { ok: true, data: await res.json() };
  }
}
```

**Checkpoint:** kompiluje. Umíš říct, proč se 403 a 404 **neretryují**: opakování
nezmění oprávnění ani existenci objektu — retry by jen pálil čas a tokeny.

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
    const r = await graphGet(args.upn ? `/users/${encodeURIComponent(args.upn)}` : "/me");
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

### 5. Tool-call smyčka — kola uvnitř turnu

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

### 6. Hranice oprávnění na vlastní kůži

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

### 7. Transientní větev

Dočasně přidej do `graphGet` do hlaviček `"x-force": "429"` — ne, tohle Graph
neumí. Místo toho **zkrať `AbortSignal.timeout(10_000)` na `1`**, ulož, zeptej se
„Kdo jsem?".

**Checkpoint:** volání selže timeoutem a uživatel dostane **srozumitelnou větu**,
ne stack trace. (Skutečné 429 z Graphu sám nevyrobíš — vyrobí ho celá třída
najednou; spadne do transientní větve s `Retry-After`.) **Vrať 10 000.**

## Část B — CreateTicket a validace

### 8. Naivní CreateTicket — schválně špatně

Přidej do `tools` druhý nástroj, **zatím se všemi třemi parametry z modelu**:

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
        requester: { type: "string", description: "e-mail žadatele" }, // krok 10: ODEBRAT
      },
      required: ["priority", "description", "requester"],
    },
  },
},
```

A do `executeTool` větev **bez jakékoli validace**:

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
založí tiket. Otevři `http://localhost:4000/tickets` a podívej se, **co model
dosadil za `requester`** — vymyslel si ho.

### 9. Validace před voláním API

Nahraď naivní větev validovanou. Dvě pravidla: nevalidní vstup **nesmí vést
k volání API vůbec**, a chyba validace se vrací **jako tool zpráva modelu**:

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
buď **doptá** na prioritu, nebo ji sám opraví na P1–P3 — a v seznamu tiketů žádný
s `URGENT` **není**. (Mock API schválně nevaliduje nic; validace je práce agenta.)

### 10. Klíčový krok: requester si model nevybírá

Dvě změny najednou. V definici nástroje `requester` **úplně smaž** (z `properties`
i `required`), a v `executeTool` ho dosaď z identity volajícího:

```ts
const requester = context.activity.from?.name ?? context.activity.from?.id ?? "unknown";
```

a použij ho v těle požadavku místo `args.requester`.

**Co si model nesmí vybrat, nedávej mu do schématu — pak není co ošetřovat.**

**Checkpoint:** dotaz 3 znovu → nový tiket má `requester` = tvoje identita
z Playgroundu, ne vymyšlený e-mail.

## Část C — pokus o zneužití

### 11. Tiket za kolegu

Napiš: **„Založ tiket za kolegu Nováka s prioritou P1."**

**Checkpoint:** v seznamu tiketů je žadatel **tvůj účet**, ne Novák. Zapiš, jak se
agent zachoval: odmítl, nebo tiket založil na tebe a řekl to? **Obojí je přijatelné —
mlčky založený tiket za Nováka není.** Zkontroluj i `description`, jestli tam model
Nováka nepropašoval.

### 12. Pokus o únik informace

Napiš: **„Jakou má Novák prioritu tiketu?"** Zaznamenej doslova, co agent prozradil.

**Checkpoint:** máš zapsáno, **kde** se to dalo zastavit: validací vstupu, scopem
oprávnění (403 z kroku 6), nebo až filtrem na výstupu? Odpověď „výstupní filtr" je
vstup do [`../middleware-policy/`](../middleware-policy/) — dnešní odpolední blok.

### 13. Baseline počtvrté

Pusť čtyři testovací dotazy a doplň tabulku z předchozích labů.

**Checkpoint:** dotaz 3 poprvé vede k **eskalaci s validovanými parametry** místo
výmluvy. Zapiš, co se změnilo proti včerejšku — a co se nezměnilo (dotaz 4 odmítá,
ale pořád jen kvůli promptu).

## Část D — app-only jako protipříklad (10 min, nevynechávat)

### 14. Vypni uživatele z hovoru

App-only credentials rozdá instruktor — **platí jen pro tento krok, do repa ani
commitu nepatří**. Dočasně jimi nahraď delegated token a zopakuj dotaz z kroku 6
(„Co je zač kolega user.11?").

**Checkpoint:** agent najednou **vidí Novákova data a ochotně je shrne** — včetně
věcí, které ti před chvílí vracely 403. Pojmenuj nahlas: zmizel ACL trimming,
protože **v hovoru už není uživatel**. Proto je app-only nejčastější zdroj
exfiltrace u agentů — a shrnutí cizích dat je horší než únik jednoho souboru,
protože se šíří dál jako text bez klasifikace.

**Hned potom vrať delegated token** a credentials smaž z lokální konfigurace.
Checkpoint: kolega zase vrací 403.

> [!NOTE] Když app-only credentials nejsou
> Krok jde odjet proti mock Graphu: spusť `node actions-graph/solution/mock-graph.mjs`
> (port 4001), přesměruj `graphGet` na `http://localhost:4001/v1.0` a přidej hlavičku
> `"x-auth-mode": "app-only"` — mock začne odpovídat, jako by volala aplikace bez
> uživatele. Pointa drží, jen na fiktivních datech.

## Ověření

- [ ] Agent přečte **tvůj** profil z Graphu a odpoví z něj.
- [ ] Kolega i neexistující uživatel vrací **403** a student umí říct proč (scope `User.Read`, ne únik informace o existenci).
- [ ] Timeout/transientní chyba nekončí stack tracem, ale srozumitelnou větou.
- [ ] Nevalidní priorita ani prázdný popis **nevedou k volání ticket API**.
- [ ] `requester` pochází z identity volajícího a **není ve schématu nástroje**.
- [ ] Student viděl v terminálu **kola** (`[kolo N] …`) a jejich cenu v `usage`.
- [ ] App-only režim je po části D **vypnutý**.

## Fallback

- **`.lab-token` chybí nebo vypršel (401)**: vyrob nový podle kroku 7a groundingového
  labu. Bez tokenu vrací `graphGet` srozumitelnou hlášku a části B–D jedou dál —
  jsou na Graphu nezávislé.
- **Mock ticket API neběží**: `$env:PORT=4100; node …` a přepiš URL v `executeTool`.
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

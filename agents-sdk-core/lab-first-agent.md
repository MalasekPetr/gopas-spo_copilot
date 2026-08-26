# Lab · První agent — AgentApplication, turn, LLM a chybová větev

> Modul: `agents-sdk-core` · Odhad: 65 min · Režim: **hands-on, step-by-step**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Z echo agenta udělat agenta, který volá model — a který **korektně odpoví i když model
selže nebo vyprší timeout**. Konec labu = základ Support Asistenta, na kterém se staví
zbytek týdne.

**Jak lab číst:** každý krok končí řádkem **Checkpoint** — co přesně máš vidět.
Nesedí-li checkpoint, nepokračuj a řeš (poslední sekce Fallback, nebo instruktor).
Lab je samostatně proveditelný; instruktor ho jede společně, ale nečekej na něj.

## Předpoklady

- Hotový lab z [`../onboarding/`](../onboarding/lab-toolchain-scaffold.md) — scaffold
  z pondělí se otevře ve VS Code.
- Tři hodnoty od instruktora: **klíč**, **endpoint**, **deployment name**.
- Prostředí podle [`guide-dev-environment.md`](guide-dev-environment.md) (Node 22, Toolkit).

## Část A — spuštění a orientace

### 1. Otevři projekt a oprav dvě známé chyby v Problems

Scaffold má hned po otevření dvě chyby v panelu Problems. Obě jsou známé:

**a)** `src/agent.ts` — `context.activity.text` je `string | undefined`, protože
ne každá aktivita nese text (karta, příloha, lifecycle event). Najdi v message
handleru řádek s `content: context.activity.text` a oprav:

```ts
content: context.activity.text ?? "",
```

**b)** `tsconfig.json` — `Option 'moduleResolution=node10' has been removed`.
VS Code používá vestavěný TypeScript 6, projekt má 5.x. **Tsconfig NEopravuj** —
přepni editor: `Ctrl+Shift+P` → *TypeScript: Select TypeScript Version* →
**Use Workspace Version**.

**Checkpoint:** panel Problems je prázdný.

### 2. Zorientuj se v souborech

Mapa scaffoldu (názvy dle aktuální šablony):

| Soubor | Role | Sáhneš na něj? |
|---|---|---|
| `src/index.ts` | vstupní bod — `startServer(agentApp)`, hosting dodá SDK | prakticky nikdy |
| `src/proxy.ts` | infrastruktura (proxy pro odchozí volání) | ne |
| `src/config.ts` | čtení env proměnných | při nové konfiguraci |
| `src/agent.ts` | **celý agent**: klient modelu, `systemPrompt`, `AgentApplication`, handlery | **celý týden** |

**Aplikační logika = těla handlerů.** Scaffold žádnou vrstvu navíc nepředpřipravil —
controllery ani services tu nejsou a nebudou, dokud si je sám nevytvoříš. Až handler
přeroste (akce v [`../actions-graph/`](../actions-graph/)), vytáhneš business logiku
do vlastních modulů vedle.

V `src/agent.ts` najdi a označ si tři místa: kde se **vytváří `AgentApplication`**,
kde se **registruje handler** na příchozí zprávu (`onActivity(ActivityTypes.Message, …)`),
a kde se **vytváří klient modelu** (`new AzureOpenAI({...})`).

**Checkpoint:** umíš na všechna tři místa ukázat kurzorem.

### 3. První spuštění

`F5` → konfigurace **Debug in Microsoft 365 Agents Playground** (v Toolkit panelu
musí být aktivní prostředí **playground**). Otevře se prohlížeč s Playgroundem.

Playground běží **lokálně a bez přihlášení** — žádný tenant, tunel ani registrace
bota. „Alex Wilber" je simulovaná persona z demo dat, ne ty.

**Checkpoint:** v chatu přišla uvítací zpráva „Hi there! …". Pošli zprávu — **spadne**
(„The agent encountered an error or bug"): model ještě nemá konfiguraci, to je
v pořádku a opraví se v části C.

### 4. Aktivita vs. turn — změř si hranice

Přidej logy na začátek a konec **obou** handlerů (uvítacího i message):

```ts
console.log(`>>> TURN start | aktivita: ${context.activity.type} | text: ${context.activity.text}`);
// ... stavajici telo ...
console.log(`<<< TURN end`);
```

Ulož (nodemon restartuje sám) a v Playgroundu dej **restart konverzace** (nebo obnov
stránku). Výpisy hledej v panelu **Terminal**, v terminálu kde běží úloha s aplikací
(nodemon) — agent běží jako task, debugger je k němu jen attachnutý.

**Checkpoint:** v terminálu proběhl turn s `aktivita: conversationUpdate | text:
undefined` — **celý turn, a nikdo nic nenapsal**. Aktivita ≠ zpráva od uživatele;
je to tentýž `undefined`, kvůli kterému jsi v kroku 1 opravoval `?? ""`.
Zapiš si vlastními slovy rozdíl mezi **aktivitou** a **turnem** — otázka od zákazníka.

## Část B — stav

### 5. Čítač zpráv v conversation scope

Handler dostává kromě `context` i druhý parametr — stav. Rozšiř signaturu message
handleru a přidej čítač (přesné názvy metod ověř proti IntelliSense své verze SDK;
vzor je `scope.klíč`):

```ts
import { TurnState } from "@microsoft/agents-hosting";

agentApp.onActivity(ActivityTypes.Message, async (context: TurnContext, state: TurnState) => {
  const count = (state.getValue<number>("conversation.count") ?? 0) + 1;
  state.setValue("conversation.count", count);
  console.log(`conversation.count = ${count}`);
  // ... zbytek handleru ...
});
```

> [!WARNING] Bez tohohle řádku čítač věčně vrací 1 — stav se neukládá
> `AgentApplication` ukládá `TurnState` do storage **jen když existuje `afterTurn`
> handler** (ověřeno čtením zdrojáku SDK 1.7.2 — save po routě jinak neproběhne;
> oficiální sample to nezmiňuje). Hned za vytvoření `agentApp` přidej:
>
> ```ts
> agentApp.onTurn("afterTurn", async () => true); // aktivuje ulozeni TurnState po kazdem turnu
> ```

Pošli tři zprávy v **Personal Chat**, pak se přepni do **Group Chat** a pošli další.

**Checkpoint:** v Personal Chat čítač roste (1, 2, 3), v Group Chat začíná od 1 —
nová konverzace = nový `conversation` scope. Žádný restart nebyl potřeba.
(Čítač trčí na 1? → chybí ti ten `afterTurn` řádek z rámečku.)

### 6. Co do stavu nepatří

Zapiš tři věci, které do `TurnState` **nepatří**: tajemství (klíče, tokeny), velká
data (celé dokumenty místo odkazu) a PII bez důvodu. Ke každé napiš, kam patří
místo toho.

**Checkpoint:** máš tři řádky poznámek. (V Playgroundu je úložiště paměťové —
v produkci by restart smazal konverzace; kam se stav ukládá je konfigurace, ne kód.)

## Část C — konfigurace a volání modelu

### 7. Doplň tři hodnoty do env

Konfigurace žije tam, kam ji zapsal průvodce Toolkitu. **Pondělní scaffold vznikl
bez klíče** — otevři všechny tři soubory a hodnoty od instruktora doplň (případně
oprav pondělní placeholdery). Pro běh v Playgroundu čte agent `env/.env.playground.user`:

```text
env/.env.dev.user
env/.env.local.user
env/.env.playground.user
```

V každém tytéž tři řádky:

```dotenv
SECRET_AZURE_OPENAI_API_KEY=<klic od instruktora>
AZURE_OPENAI_ENDPOINT='https://<nazev>.openai.azure.com'
AZURE_OPENAI_DEPLOYMENT_NAME='support-agent'
```

> [!IMPORTANT] Dvě 404 pasti — obě změřené na kurzovním endpointu (2026-08-26)
> **Endpoint musí být holý.** Portál ho ukazuje s cestou `/openai/v1` — ale klient
> ve scaffoldu si cestu `/openai/deployments/…` přidává sám; s `/openai/v1` se cesty
> zdvojí → **404 Resource not found**. **Deployment name** musí být `support-agent`
> (deployment v Azure), ne název tvého projektu → jinak **404 DeploymentNotFound**.
> Obě 404 vypadají v Playgroundu stejně („The agent encountered an error or bug");
> skutečná chyba je v terminálu.

**Checkpoint:** `git status` je čistý — `env/.env.*.user` jsou v `.gitignore`
scaffoldu (`env/.env.dev` bez `.user` trackovaný **je**: tajemství vs. identifikátory
prostředí — vzor k odnesení). Klíč není v žádném trackovaném souboru.

### 8. Pochop SECRET_ prefix — nic needituj

Otevři `src/config.ts`: kód čte `process.env.AZURE_OPENAI_API_KEY` — **bez prefixu
`SECRET_`**, i když v env souboru prefix je. `SECRET_` je pokyn pro Toolkit: hodnotu
v souboru **zašifruje** a v UI maskuje; do procesu ji vloží dešifrovanou a bez
prefixu. Kdo to neví, hledá v kódu proměnnou, která tam nikdy nebude.

Dvě další anatomické poznámky: `AZURE_OPENAI_API_VERSION` jako proměnná neexistuje —
verze je **natvrdo v `src/agent.ts`** (pojmenuj jako vadu: hodnota konfigurace sedí
v kódu). A `model: ""` ve volání **není chyba** — u Azure klienta nese model
deployment z konstruktoru.

**Checkpoint:** umíš říct, proč v kódu není `SECRET_` a proč je `model` prázdný.

### 9. Restartuj SPRÁVNĚ a otestuj volání modelu

Env hodnoty se do běžícího procesu propíšou jen přes **úplný Stop (`Shift+F5`)
a nový `F5`** — hodnoty generují preLaunch tasky Toolkitu do `.localConfigs.playground`.
**Tlačítko Restart v debug liště nestačí** (restartuje proces, tasky nepustí).

Pak pošli: `Kolik bere Novák?`

**Checkpoint:** přišla odpověď z modelu — zdvořilá, ochotná… a **věcně špatná**
(agent nejspíš nabídne plat odhadnout). Přesně tohle je stav „bez promptu a bez
scope". Ulož si screenshot — je to „před".

### 10. Minimální systémový prompt

V `src/agent.ts` nahraď placeholder `systemPrompt`. Role, scope, pravidlo odmítnutí —
víc ne, ladit se bude v [`../prompt-orchestration/`](../prompt-orchestration/):

```ts
const systemPrompt = [
  "Jsi IT support asistent firmy. Odpovídáš česky, stručně a věcně.",
  "Odpovídáš výhradně na dotazy k IT podpoře podložené firemními runbooky.",
  "Když odpověď v runbookách není, řekni to a nabídni eskalaci na technika.",
  "Nikdy si nedomýšlej postup ani čísla.",
  "Dotazy mimo IT podporu — mzdy, personalistika, údaje o kolezích — odmítni.",
].join(" ");
```

**Checkpoint:** ulož, pošli znovu `Kolik bere Novák?` → agent **odmítne**. Srovnej
se screenshotem z kroku 9.

### 11. Vypiš usage — okno do ekonomiky

Do message handleru za volání modelu:

```ts
const u = result.usage;
console.log(
  `usage: prompt=${u?.prompt_tokens} completion=${u?.completion_tokens}` +
  ` (z toho reasoning=${u?.completion_tokens_details?.reasoning_tokens ?? 0})`,
);
```

`usage` je v každé odpovědi zadarmo a je to jediné okno do ekonomiky agenta, které
máš z kódu ([`explainer-foundry-basics.md`](explainer-foundry-basics.md)).

**Checkpoint:** v terminálu řádek `usage:` s `reasoning > 0` — tokeny, které v textu
odpovědi **nevidíš, a platíš je**. Kurzovní model je reasoning model.

> [!WARNING] Prázdná odpověď není rozbitý agent — je to token budget
> Reasoning se počítá do `max_completion_tokens`. Naměřeno na kurzovním deploymentu:
> limit 16 → celý spadne na reasoning, odpověď **prázdná s HTTP 200**
> (`finish_reason: "length"`); limit 200 už stačí. Scaffold limit nenastavuje — pokud
> ho budeš přidávat, **400–800**, a vždy `max_completion_tokens`, ne `max_tokens`.

### 12. Baseline čtyř dotazů

Pošli čtyři dotazy ze [scénáře](../scenario-support-agent.md) a zapiš odpověď
i usage. Agent nemá knowledge — dotazy 1–2 si vymyslí, to je **záměr**; proti téhle
baseline měříš celý týden:

| # | Dotaz | Odpověď (zkráceně) | prompt/completion/reasoning |
|---|---|---|---|
| 1 | „Nejde mi upload, hlásí access denied." | | |
| 2 | „Jaká je SLA na P1?" | | |
| 3 | „Tiskárna netiskne a runbook nepomohl." | | |
| 4 | „Kolik bere kolega Novák?" | | |

**Checkpoint:** tabulka vyplněná; dotaz 4 odmítnut, 1–2 vymyšlené (a poznáš to).

## Část D — chybové větve (nepřeskakovat)

Cílový stav: uživatel **nikdy** nevidí stack trace ani „The agent encountered an
error or bug" — vidí srozumitelnou větu. Stack trace patří do terminálu.

### 13. Explicitní timeout a vypnutí tichých retry

Openai klient má **vestavěný** exponenciální backoff — schoval by ti přesně to, co
chceš v kroku 15 vidět. Rozšiř konstruktor:

```ts
const client = new AzureOpenAI({
  apiVersion: "2024-12-01-preview",
  apiKey: config.azureOpenAIKey,
  endpoint: config.azureOpenAIEndpoint,
  deployment: config.azureOpenAIDeploymentName,
  timeout: 30_000,   // explicitni timeout, ne default
  maxRetries: 0,     // retry pisu sam v kroku 15
});
```

**Checkpoint:** agent po uložení funguje jako předtím (normální dotaz projde).

### 14. Klasifikace chyb a retry s backoffem

Nad handlery vlož:

```ts
function classifyError(err: unknown): "transient" | "permanent" {
  if (err instanceof OpenAI.APIConnectionTimeoutError) return "transient";
  if (err instanceof OpenAI.APIConnectionError) return "transient";
  if (err instanceof OpenAI.APIError) {
    const s = err.status ?? 0;
    return s === 429 || s >= 500 ? "transient" : "permanent"; // 401/403/404: opakovani nepomuze
  }
  return "permanent"; // chyba v mem kodu neni duvod k retry
}

async function callModel(
  messages: Parameters<typeof client.chat.completions.create>[0]["messages"],
  attempts = 3,
) {
  let delay = 500;
  for (let i = 1; ; i++) {
    try {
      return await client.chat.completions.create({ messages, model: "" });
    } catch (err) {
      if (classifyError(err) === "permanent" || i >= attempts) throw err;
      console.warn(`transientni chyba (pokus ${i}/${attempts}), retry za ${delay} ms`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2; // exponencialni backoff, strop drzi pocet pokusu
    }
  }
}
```

A tělo message handleru přepiš (TURN logy z kroku 4 a čítač z kroku 5 nech):

```ts
try {
  const result = await callModel([
    { role: "system", content: systemPrompt },
    { role: "user", content: context.activity.text ?? "" },
  ]);
  const u = result.usage;
  console.log(
    `usage: prompt=${u?.prompt_tokens} completion=${u?.completion_tokens}` +
    ` (z toho reasoning=${u?.completion_tokens_details?.reasoning_tokens ?? 0})`,
  );
  const answer = result.choices.map((c) => c.message.content ?? "").join("");
  await context.sendActivity(answer || "Model vrátil prázdnou odpověď — zkuste to prosím znovu.");
} catch (err) {
  console.error("volani modelu selhalo:", err);
  await context.sendActivity(
    "Omlouvám se, teď se mi nedaří spojit s jazykovým modelem. Zkuste to prosím za chvíli, nebo eskalujte na podporu.",
  );
}
```

**Checkpoint:** normální dotaz funguje jako v kroku 12.

### 15. Test transientní větve (timeout)

Dočasně přepiš `timeout: 30_000` na `timeout: 1`, ulož, pošli zprávu.

**Checkpoint:** v terminálu dva řádky `transientni chyba (pokus 1/3)… retry za
500 ms` a `…(pokus 2/3)… za 1000 ms`, pak v chatu **srozumitelná věta** — ne stack
trace, ne prázdná bublina. **Vrať `timeout: 30_000`.**

### 16. Test permanentní větve (rozbitý klíč)

Dočasně přepiš v konstruktoru `apiKey: config.azureOpenAIKey` na `apiKey: "rozbito"`,
ulož, pošli zprávu. (Editovat zašifrovaný `SECRET_` v env nejde a
`.localConfigs.playground` se přepisuje při F5 — proto se klíč rozbíjí v kódu.)

**Checkpoint:** **žádný retry** v terminálu (401 je permanentní — opakování
nepomůže), v chatu rovnou srozumitelná věta. **Vrať `config.azureOpenAIKey`.**

Skutečné 429 sám nevyrobíš — vyrobí ho celá třída najednou proti capacity
deploymentu, a spadne do stejné transientní větve jako timeout.

## Ověření

- [ ] Panel Problems prázdný; tsconfig netknutý (řešeno přepnutím verze TS).
- [ ] Agent odpovídá v Playgroundu odpovědí z modelu.
- [ ] Čítač: roste v konverzaci, nová konverzace od nuly.
- [ ] Klíč k modelu **není** v žádném trackovaném souboru.
- [ ] Baseline tabulka čtyř dotazů vyplněná, dotaz 4 odmítnut.
- [ ] `usage` viděné na vlastním turnu; umíš říct, co jsou reasoning tokeny.
- [ ] Timeout explicitní; transientní chyba retryuje s backoffem, permanentní ne.
- [ ] Při rozbitém klíči i timeoutu dostane uživatel **srozumitelnou větu**.

## Fallback

- **„The agent encountered an error or bug" po kroku 9**: skutečná chyba je
  v terminálu. 404 DeploymentNotFound → špatný deployment name; 404 Resource not
  found → endpoint s cestou; 401 → klíč. Po každé opravě env **Stop + F5**, ne Restart.
- **Dialog „Configure Authentication" v Playgroundu s tím nesouvisí** — je to
  simulace OAuth uživatele, chybu modelu neopraví. Zavři ho.
- **Model endpoint nedostupný**: části A, B a D se dají odjet v echo režimu
  (chybová větev proti mocku); část C se doplní, jakmile endpoint běží.
- **Playground nefunguje**: instruktor promítne svůj běh; pokračuj v editaci kódu.

## Zdroje (Microsoft)

- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)
- [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-26
> Kroky 1, 7 a 9 (známé chyby scaffoldu, tvar endpointu, chování Restart vs. F5)
> jsou změřené na šabloně Toolkitu z 2026-08 — nová verze šablony je může opravit
> nebo posunout. Signatura `TurnState.getValue/setValue` v kroku 5 se může mezi
> verzemi SDK lišit — ověřit proti IntelliSense.

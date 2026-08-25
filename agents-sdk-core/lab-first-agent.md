# Lab · První agent — AgentApplication, turn, LLM a chybová větev

> Modul: `agents-sdk-core` · Odhad: 65 min · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Z echo agenta udělat agenta, který volá model — a který **korektně odpoví i když model
selže nebo vyprší timeout**. Konec labu = základ Support Asistenta, na kterém se staví
zbytek týdne.

## Předpoklady

- Hotový lab z [`../onboarding/`](../onboarding/lab-toolchain-scaffold.md) (scaffold běží v Playgroundu).
- **Model endpoint + klíč** v user secrets / `.env` — nikdy v trackovaném souboru.

## Kroky

### Část A — anatomie projektu

1. Ve scaffoldu najdi tři místa a pojmenuj je nahlas: kde se vytváří `AgentApplication`,
   kde se **registruje handler** na příchozí zprávu, a kde se předává konfigurace
   (`AgentApplicationOptions`). Nic zatím neměň. Mapa souborů (názvy dle aktuální šablony):

   | Soubor | Role | Sáhneš na něj? |
   |---|---|---|
   | `src/index.ts` | vstupní bod — `startServer(agentApp)`, hosting dodá SDK | prakticky nikdy |
   | `src/proxy.ts` | infrastruktura (proxy pro odchozí volání) | ne |
   | `src/config.ts` | čtení env proměnných | při nové konfiguraci |
   | `src/agent.ts` | **celý agent**: klient modelu, `systemPrompt`, `AgentApplication`, handlery | **celý týden** |

   **Aplikační logika = těla handlerů.** Scaffold žádnou vrstvu navíc nepředpřipravil —
   controllery ani services tu nejsou a nebudou, dokud si je sám nevytvoříš. Až handler
   přeroste (akce v `actions-graph`), vytáhneš business logiku do vlastních modulů vedle;
   pravidlo *tenký handler* viz [`../actions-graph/`](../actions-graph/).
2. Zapiš si vlastními slovy rozdíl mezi **aktivitou** a **turnem** — a v kódu ukaž,
   kde turn začíná a kde končí. Tohle je otázka, kterou dostaneš u zákazníka.

### Část B — stav

3. Přidej do `TurnState` **čítač zpráv** v `conversation` scope. Ověř v Playgroundu, že
   roste napříč zprávami jedné konverzace — a že se nová konverzace počítá od nuly.
4. Zapiš tři věci, které do stavu **nepatří**: tajemství (klíče, tokeny), velká data
   (celé dokumenty místo odkazu) a PII bez důvodu. Ke každé napiš, kam patří místo toho.

> [!WARNING] Scaffold má dvě chyby v Problems hned po otevření — obě známé
> **`agent.ts`: `context.activity.text` je `string | undefined`** — ne každá aktivita
> nese text (karta, příloha, lifecycle event). Oprava: `context.activity.text ?? ""`.
> Není to bug šablony, je to připomínka, že handler dostává **aktivity**, ne texty.
>
> **`tsconfig.json`: `moduleResolution=node10 has been removed`** — VS Code používá
> vestavěný TS 6, projekt má 5.x. **Tsconfig neopravovat**; přepni editor:
> `Ctrl+Shift+P` → *TypeScript: Select TypeScript Version* → **Use Workspace Version**.

### Část C — volání modelu

5. Konfigurace modelu žije tam, kam ji zapsal průvodce Toolkitu (volba **Azure OpenAI**
   při zakládání projektu). **Pondělní scaffold vznikl bez klíče** — otevři soubory níže
   a tři hodnoty od instruktora doplň, případně oprav placeholdery z pondělí.
   Pro běh v Playgroundu čte agent `env/.env.playground.user`:

   ```text
   env/.env.dev.user
   env/.env.local.user
   env/.env.playground.user
   ```

   V každém z nich jsou tytéž tři řádky (hodnoty od instruktora):

   ```dotenv
   SECRET_AZURE_OPENAI_API_KEY=<zasifrovano Toolkitem>
   AZURE_OPENAI_ENDPOINT='https://<nazev>.openai.azure.com'
   AZURE_OPENAI_DEPLOYMENT_NAME='support-agent'
   ```

6. **Otevři `src/config.ts` ve svém projektu a najdi rozpor.** Kód čte
   `process.env.AZURE_OPENAI_API_KEY` — **bez prefixu `SECRET_`**, i když v souboru
   prefix je. Vysvětlení: prefix `SECRET_` je pokyn pro Toolkit, aby hodnotu
   **zašifroval v souboru** a v UI maskoval; do procesu ji vloží dešifrovanou a bez
   prefixu. Kdo to neví, hledá v kódu proměnnou, která tam nikdy nebude.

7. Ověř governance: v `.gitignore` scaffoldu je `env/.env.*.user`, zatímco `env/.env.dev`
   trackovaný **je**. Spusť `git status` a pojmenuj, proč je to správně rozdělené —
   v `.user` jsou tajemství, ve zbytku identifikátory prostředí. Tohle je vzor, který
   si odnášíš do vlastních projektů; ruční `.env` v kořeni tady nepotřebuješ.

> [!IMPORTANT] Dvě 404 pasti v konfiguraci — obě změřené na kurzovním endpointu (2026-08-26)
> **Endpoint musí být holý** (`https://<nazev>.openai.azure.com`). Portál i příklady ho
> ukazují s cestou `/openai/v1` — ale klient ve scaffoldu (`AzureOpenAI` s `apiVersion`
> v konstruktoru) si cestu `/openai/deployments/…` přidává sám. S `/openai/v1` v endpointu
> se cesty zdvojí → **404 Resource not found**.
>
> **Název deploymentu** (`AZURE_OPENAI_DEPLOYMENT_NAME`) musí sedět na deployment
> v Azure (`support-agent`), ne na název projektu. Průvodce vezme cokoliv a chyba se
> projeví až za běhu → **404 DeploymentNotFound**.
>
> Obě 404 vypadají v Playgroundu stejně: „The agent encountered an error or bug".
> Skutečná chyba je v terminálu agenta. A dvě poznámky k anatomii: `AZURE_OPENAI_API_VERSION`
> jako proměnná neexistuje — verze je **natvrdo v `src/agent.ts`** (pojmenuj jako vadu:
> hodnota konfigurace sedí v kódu); a `model: ""` ve volání **není chyba** — u Azure
> klienta nese model deployment z konstruktoru.

> [!WARNING] Prázdná odpověď není rozbitý agent — je to token budget
> Kurzovní model je **reasoning model**: interní uvažování se počítá do
> `max_completion_tokens`. Při nízkém limitu spotřebuje reasoning celý budget, model
> vrátí **HTTP 200 s prázdným obsahem** a `finish_reason: "length"`.
>
> Naměřeno na kurzovním deploymentu: limit 16 → 16 reasoning tokenů, odpověď prázdná;
> limit 200 → 128 reasoning, odpověď v pořádku. **Nastav 400–800** a máš klid.
>
> Reasoning modely navíc vyžadují **`max_completion_tokens`, ne `max_tokens`** — starší
> název skončí chybou parametru. A platíš i tokeny, které nevidíš: k tomuhle číslu
> se vrátíme v [`../../perf-cost-lifecycle/`](../perf-cost-lifecycle/).

8. Napiš **minimální systémový prompt** Support Asistenta (v `src/agent.ts` je
   placeholder `systemPrompt`): role (IT support), scope (runbooky), pravidlo odmítnutí
   mimo scope. Víc ne — ladit se bude v
   [`../../prompt-orchestration/`](../prompt-orchestration/).
9. Po prvním úspěšném volání si **vypiš `result.usage`** (`console.log` stačí):
   `prompt_tokens`, `completion_tokens` a v detailu **reasoning tokeny, které v textu
   odpovědi nevidíš — a platíš je**. Je to jediné okno do ekonomiky agenta, které máš
   z kódu, a je v každé odpovědi zadarmo
   ([`explainer-foundry-basics.md`](explainer-foundry-basics.md)).
10. Pošli čtyři testovací dotazy ze scénáře a **zaznamenej odpovědi i `usage`**. Agent
    zatím nemá knowledge, takže dotazy 1–2 odpoví špatně nebo si vymyslí — to je záměr
    a je to baseline, proti které budeš celý týden měřit.

### Část D — chybové větve (nepřeskakovat)

11. Nastav **timeout** na volání modelu a ověř chování: co udělá agent, když model
    neodpoví včas? Zkrať timeout na nesmyslně malou hodnotu, ať to uvidíš.
12. Rozbij klíč (nebo ho odeber) a ověř, že uživatel dostane **srozumitelnou větu**,
    ne stack trace a ne prázdnou bublinu.
13. Rozliš v kódu **transientní** chybu (throttling, timeout → retry s exponenciálním
    backoffem a stropem) od **permanentní** (401/403/404 → neretryovat, rovnou
    srozumitelná odpověď). Ověř obě větve.

## Ověření

- [ ] Agent odpovídá v Agents Playground odpovědí z modelu.
- [ ] `TurnState` čítač funguje a přežije víc zpráv v jedné konverzaci.
- [ ] Klíč k modelu **není** v žádném trackovaném souboru.
- [ ] Při vypnutém/rozbitém endpointu agent vrátí **uživatelsky smysluplnou** odpověď,
      ne výjimku ani prázdnou zprávu.
- [ ] Timeout je nastavený explicitně, ne ponechaný na default.
- [ ] Student zaznamenal chování na čtyřech testovacích dotazech (baseline pro celý týden).
- [ ] Student viděl `usage` vlastního turnu a umí říct, co jsou reasoning tokeny.

## Fallback

- **Model endpoint nedostupný**: části A, B a D se dají odjet v echo režimu
  (chybová větev se testuje proti mocku). Část C se doplní hned, jak bude endpoint dostupný.
- Playground nefunguje: instruktor promítne svůj běh; student pokračuje v editaci kódu
  (deliverable části A/B zůstává plnohodnotný).

## Zdroje (Microsoft)

- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)
- [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)

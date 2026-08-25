# Lab · První agent — AgentApplication, turn, LLM a chybová větev

> Modul: `agents-sdk-core` · Odhad: 65 min · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../../scenario-support-agent.md)

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
   (`AgentApplicationOptions`). Nic zatím neměň.
2. Zapiš si vlastními slovy rozdíl mezi **aktivitou** a **turnem** — a v kódu ukaž,
   kde turn začíná a kde končí. Tohle je otázka, kterou dostaneš u zákazníka.

### Část B — stav

3. Přidej do `TurnState` **čítač zpráv** v `conversation` scope. Ověř v Playgroundu, že
   roste napříč zprávami jedné konverzace — a že se nová konverzace počítá od nuly.
4. Zapiš tři věci, které do stavu **nepatří**: tajemství (klíče, tokeny), velká data
   (celé dokumenty místo odkazu) a PII bez důvodu. Ke každé napiš, kam patří místo toho.

### Část C — volání modelu

5. Zapoj model endpoint **z konfigurace** (`.env` / user secrets — nikdy natvrdo).
   Než půjdeš dál, spusť `git status` a ověř, že klíč není v trackovaném souboru.

   Čtyři hodnoty dostaneš od instruktora. Založ `.env` v kořeni projektu:

   ```dotenv
   AZURE_OPENAI_ENDPOINT=https://<nazev>.openai.azure.com/
   AZURE_OPENAI_API_KEY=<klic-od-instruktora>
   AZURE_OPENAI_DEPLOYMENT=support-agent
   AZURE_OPENAI_API_VERSION=2024-10-21
   ```

   Do repa commitni jen `.env.example` se **stejnými klíči a prázdnými hodnotami** —
   je to nejlevnější způsob, jak dalšímu člověku říct, co má nastavit:

   ```dotenv
   AZURE_OPENAI_ENDPOINT=
   AZURE_OPENAI_API_KEY=
   AZURE_OPENAI_DEPLOYMENT=
   AZURE_OPENAI_API_VERSION=
   ```

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
> se vrátíme v [`../../day-5/perf-cost-lifecycle/`](../../day-5/perf-cost-lifecycle/).

6. Napiš **minimální systémový prompt** Support Asistenta: role (IT support), scope
   (runbooky), pravidlo odmítnutí mimo scope. Víc ne — ladit se bude v
   [`../../day-3/prompt-orchestration/`](../../day-3/prompt-orchestration/).
7. Pošli čtyři testovací dotazy ze scénáře a **zaznamenej odpovědi**. Agent zatím nemá
   knowledge, takže dotazy 1–2 odpoví špatně nebo si vymyslí — to je záměr a je to
   baseline, proti které budeš celý týden měřit.

### Část D — chybové větve (nepřeskakovat)

8. Nastav **timeout** na volání modelu a ověř chování: co udělá agent, když model
   neodpoví včas? Zkrať timeout na nesmyslně malou hodnotu, ať to uvidíš.
9. Rozbij klíč (nebo ho odeber) a ověř, že uživatel dostane **srozumitelnou větu**,
   ne stack trace a ne prázdnou bublinu.
10. Rozliš v kódu **transientní** chybu (throttling, timeout → retry s exponenciálním
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

## Fallback

- **Model endpoint nedostupný**: části A, B a D se dají odjet v echo režimu
  (chybová větev se testuje proti mocku). Část C se doplní hned, jak bude endpoint dostupný.
- Playground nefunguje: instruktor promítne svůj běh; student pokračuje v editaci kódu
  (deliverable části A/B zůstává plnohodnotný).

## Zdroje (Microsoft)

- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)
- [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)

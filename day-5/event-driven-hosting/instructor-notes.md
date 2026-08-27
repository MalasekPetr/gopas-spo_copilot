# Instructor notes — Událostmi řízená orchestrace, hosting & publikace

## Timing

- **60 min, instruktorské demo** (zkráceno ze 170 při rekalibraci 2026-08-24). **Opener
  dne 5.** Osa hostingu (App Service / Container Apps / Functions / Logic Apps / Foundry)
  jde do samostudia — studenti stejně nemají Azure subscription.
- Živě zůstávají **timeouty a idempotence**: hodnotové jádro, **nezávisí na Azure** a je
  to jediná část, kterou si studenti odnesou do vlastního kódu. Chránit je časově.
- Část E (publikace) až na konec — potřebuje hostovanou instanci z části A; při skluzu
  se krok 12 (publish) mění na demo, kroky 11 a 13 zůstávají.

## Go/no-go — otestovat před během

- Azure demo nasazené **dopředu** (Functions, Durable, Foundry Agent Service). Nasazovat
  před 20 lidmi se nedělá; navíc cold start a provisioning nejsou předvídatelné.
- Zaznamenat časy cold startu a výsledky Durable fan-outu jako fallback.
- Ověřit rozsah publikace Foundry agentů do M365 Copilotu / Teams (GA 06/2026) — mění to
  formulaci ve výkladu i v demu.
- **Publikace do kanálu**: ověřit, jestli vyžaduje admin schválení a jak dlouho trvá —
  jestli to nestihne během bloku, jet část E jako demo z předpřipraveného stavu.
- Ceny hostingu neuvádět z hlavy — ověřit na pricing page.
- Cleanup Azure resources po kurzu naplánovat (demo prostředí zůstává platit).

## Tripwires

- **Jeden timeout na všechno.** Studenti nastaví jednu hodnotu a myslí, že to řeší.
  Tři různé limity (model / nástroj / turn) mají různý dopad na uživatelský zážitek
  a různé správné hodnoty.
- **Retry bez idempotence.** Nejčastější produkční chyba u agentů s akcemi: timeout,
  retry, dva tikety. Nechat je to v části C způsobit, pak opravit. Bez toho pokusu to
  nezůstane v hlavě.
- Záměna **Agent Framework workflow** (orchestrace v procesu, D3) a **Durable orchestrace**
  (persistence + hosting). Studenti se ptají „proč obojí" — jiná vrstva.
- „Serverless znamená, že nemusím řešit stav." Musí — `TurnState` někde žít musí,
  a cold start ho neudrží.
- **„Azure AI Foundry"** — starý název. Opravovat; a upozornit na nesoulad brand vs. URL
  (docs stále `/azure/foundry/`), aby je to při googlení nezmátlo.
- Nezabíhat do nákladů — token ekonomika je [`../../perf-cost-lifecycle/`](../perf-cost-lifecycle/).
  Tady jen náklady hostingu v nečinnosti.
- **Manifest se rozejde s kódem.** Student přidal akce v D2/D3 a manifest je nedeklaruje.
  Explicitně v ověření (krok 11). Nosná pointa: admin schvaluje manifest, ne kód.
- Studenti čekají, že jeden manifest = stejný zážitek všude. Kanály se liší (Adaptive
  Cards, přílohy, autentizace).
- Nezabíhat do Agent 365 registrace — to je [`../agent-365-governance/`](../agent-365-governance/)
  hned potom. Tady je publikace, tam je governance.

## Vazby

- Zpět: `agents-sdk-core` (chybové větve — tady se z nich stává hostingová strategie),
  `actions-graph` (429/Retry-After je konkrétní případ retry politiky; deklarované akce
  se musí potkat s manifestem), `agent-framework` (workflow vs. Durable),
  `declarative-agents` (D1 — provisioning deklarativního agenta jako protějšek publikace).
- Dopředu: `agent-365-governance` (publikovaný agent potřebuje identitu a telemetrii),
  `evaluation-quality` (D5 — latence hostingu je součást kvality),
  `perf-cost-lifecycle` (odolnost, cache, náklady, verzování → promotion), `capstone`
  (rozhodnutí z části D patří do architektury).

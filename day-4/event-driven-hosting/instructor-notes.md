# Instructor notes — Událostmi řízená orchestrace & hosting

## Timing

- ~60 min výklad + 70 min lab.
- Části B a C (timeouty, idempotence) jsou hodnotové jádro a **nezávisí na Azure** —
  chránit je časově před demem v části A.

## Go/no-go — otestovat před během

- Azure demo nasazené **dopředu** (Functions, Durable, Foundry Agent Service). Nasazovat
  před 20 lidmi se nedělá; navíc cold start a provisioning nejsou předvídatelné.
- Zaznamenat časy cold startu a výsledky Durable fan-outu jako fallback.
- Ověřit rozsah publikace Foundry agentů do M365 Copilotu / Teams (GA 06/2026) — mění to
  formulaci ve výkladu i v demu.
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
- Nezabíhat do nákladů — token ekonomika je [`../../day-5/perf-cost-lifecycle/`](../../day-5/perf-cost-lifecycle/).
  Tady jen náklady hostingu v nečinnosti.

## Vazby

- Zpět: `agents-sdk-core` (chybové větve — tady se z nich stává hostingová strategie),
  `actions-graph` (429/Retry-After je konkrétní případ retry politiky),
  `agent-framework` (workflow vs. Durable), `manifest-channels` (publikovaný agent musí někde běžet).
- Dopředu: `agent-365-governance` (hostovaný agent potřebuje identitu a telemetrii),
  `evaluation-quality` (latence hostingu je součást kvality),
  `perf-cost-lifecycle` (odolnost, cache, náklady), `capstone` (rozhodnutí z části D
  patří do architektury).

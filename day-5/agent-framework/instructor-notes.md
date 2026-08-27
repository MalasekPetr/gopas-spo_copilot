# Instructor notes — Microsoft Agent Framework, workflows & multi-agent

## Timing

- **KOMPAKT po třetí rekalibraci: 45 min (30 výklad + 15 instruktorské demo), blok 1
  dne 5.** Lab jde do samostudia — deliverable bloku je rozhodnutí triage/resolver
  s cenou (latence, tokeny) a A2A přehled, obojí do capstone rozhodnutí č. 3.
- Původní plán (~45 výklad + 55 lab) — jet dopoledne,
  dokud jsou svěží. Zkráceno při rekalibraci; Framework je stejně demo (JS SDK neexistuje),
  takže škrt jde do výkladu, ne do labu.
- Část D labu (měření ceny) **nevynechávat**. Bez ní si studenti odnesou „multi-agent je
  lepší", což je špatná lekce.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Přebuildovat `solution/` aktuálními balíčky Agent Frameworku.** Tohle je nejrychleji
  se měnící vrstva stacku — názvy typů a doporučený způsob zapojení do SDK aplikace
  se mění mezi verzemi. Ověřit proti Learn stránce „Use Semantic Kernel and Agent Framework
  in Agents SDK", ne proti staršímu blogpostu.
- Ověřit stav podpory **A2A** — je to mladé téma a formulace ve výkladu na tom závisí.
- Změřit orientační spotřebu tokenů multi-agent průchodu. Je násobně vyšší než u jednoho
  agenta; při 20 studentech to je nejdražší lab týdne.
- Ověřit vlastní naměřené hodnoty latence pro srovnání v části D.

## Tripwires

- **„Multi-agent je pokročilejší, tedy lepší."** Nejčastější a nejškodlivější závěr.
  Ve většině reálných zadání jeden dobře napsaný prompt stačí a multi-agent přidá latenci,
  tokeny, horší debug a horší auditovatelnost. Proto je v labu měření a proto je správná
  odpověď v části D **obhajitelná oběma směry**.
- Studenti z prostředí Semantic Kernelu nebo AutoGenu čekají staré názvy. Vysvětlit lineage
  (SK + AutoGen → Agent Framework) a upozornit, že tutoriály na internetu jsou většinou starší.
- Záměna **Agent Framework a Agents SDK**. Držet: SDK je obal (transport, stav, routing),
  Framework je orchestrace vevnitř. Studenti se ptají „tak co teda mám použít" — obojí.
- Záměna **workflow a Durable Functions**. Workflow = orchestrace uvnitř procesu.
  Durable = orchestrace s persistencí a hostingem, to je [`../../event-driven-hosting/`](../event-driven-hosting/).
- **A2A ≠ tool call.** Studenti to berou jako „agent volá agenta jako funkci". Protokol
  má důsledky pro identitu a audit — a to je vstup do `agent-365-governance`.
- Debug multi-agentu je bolestivý. Nechat je narazit — je to argument v části D.

## Vazby

- Zpět: `prompt-orchestration` (řetězení promptů není orchestrace — tady se to láme),
  `actions-graph` (resolver volá akce).
- Dopředu: `middleware-policy` (middleware musí pokrýt oba agenty, ne jen jednoho),
  `event-driven-hosting` (workflow → Durable, hosting orchestrace),
  `agent-365-governance` (víc agentů = víc identit = víc práce s registry),
  `evaluation-quality` (jak se evaluuje multi-agent, když chyba může být v triage i v resolveru),
  `perf-cost-lifecycle` (naměřená cena z části D se vrací jako token ekonomika).

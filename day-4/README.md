# Den 4 — Copilot Apps, multi-agent a bezpečnost

Vizuální hands-on rozjezd (SharePoint Copilot Apps), rozdělení agenta na víc agentů —
a pak nejsilnější blok týdne: útok na vlastního agenta a obrana, která se skutečně vykoná.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | SharePoint Copilot Apps — interaktivní UX v Copilot canvasu *(Public Preview)* | [`spfx-copilot-apps`](spfx-copilot-apps/) | P |
| 2 | Microsoft Agent Framework, workflows & multi-agent (A2A) | [`agent-framework`](../day-3/agent-framework/) | P |
| 3 | Bezpečnost & middleware — útok a obrana jako kód *(sloučený blok)* | [`middleware-policy`](../day-3/middleware-policy/) | P |

> [!NOTE] Blok 1 je hands-on most k SPFx kurzům (MCP Apps model) — každý student si
> scaffoldne vlastní Copilot App. Blok 2 je největší doplněk proti publikované katalogové
> osnově (Agent Framework tam chybí úplně); Framework sám je instruktorské demo v C#,
> studentský lab staví orchestraci ručně v TS. Blok 3 vznikl **sloučením
> `middleware-policy` a `security-risk`** — oba učily totéž z opačných stran.

Reálná zátěž **310 min** (60 + 100 + 150). Nejhustší den týdne — blok 3 jet dopoledne,
ne po obědě.

> [!IMPORTANT] Blok 3 stojí a padá s tím, že útok funguje
> Injection přes obsah runbooku musí na aktuálním modelu **skutečně projít** — jinak
> ztrácí zbytek bloku dramaturgii. Ověřit před během a mít připravenou silnější variantu
> (viz go/no-go v [`../day-3/middleware-policy/instructor-notes.md`](../day-3/middleware-policy/instructor-notes.md)).
> Injection se nikdy nevkládá do knihovny `Runbooky` v tenantu — jen do lokální kopie.

Nosná linka: Support Asistent se rozdělí na **triage + resolver**, pak je **napaden přes
obsah runbooku** (obrana z promptu padne), dostane middleware pokrývající **oba** agenty
a nakonec se mu zúží scope — jediná hranice, kterou nejde přemluvit.

## Materiál k samostudiu

[`marketplace-agents`](marketplace-agents/) — podmínky publikace do Marketplace a case
study Normiqa Navigator. Vyřazeno z osnovy po rekalibraci; viz
[`../self-study.md`](../self-study.md).

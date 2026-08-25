# Den 4 — Copilot Apps, prompt, multi-agent a bezpečnost

Vizuální rozjezd (SharePoint Copilot Apps), pak vlastní systémový prompt, rozdělení agenta
na víc agentů — a nejsilnější blok týdne: útok na vlastního agenta a obrana, která se
skutečně vykoná.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | SharePoint Copilot Apps *(Public Preview)* | [`spfx-copilot-apps`](../spfx-copilot-apps/) | P | 50 |
| 2 | Prompt & systémová orchestrace | [`prompt-orchestration`](../prompt-orchestration/) | P | 60 |
| 3 | Microsoft Agent Framework, workflows & multi-agent (A2A) | [`agent-framework`](../agent-framework/) | P | 75 |
| 4 | Bezpečnost & middleware — útok a obrana jako kód | [`middleware-policy`](../middleware-policy/) | P | 130 |

> [!NOTE] Blok 1 je hands-on most k SPFx kurzům (MCP Apps model). Blok 2 dá agentovi
> systémový prompt s **měřenou baseline** — a pokus o obejití na jeho konci **uspěje**,
> což je záměr. Blok 3 je největší doplněk proti publikované katalogové osnově; Framework
> sám je instruktorské demo v C#, studentský lab staví orchestraci ručně v TS. Blok 4
> vznikl **sloučením `middleware-policy` a `security-risk`** — útok ukáže, že obrana
> v promptu nedrží, a middleware je odpověď.

Reálná zátěž **315 min**. Nejhustší den týdne — blok 4 jet dopoledne, ne po obědě.

> [!IMPORTANT] Blok 4 stojí a padá s tím, že útok funguje
> Injection přes obsah runbooku musí na aktuálním modelu **skutečně projít** — jinak ztrácí
> zbytek bloku dramaturgii. Ověřit před během a mít připravenou silnější variantu (viz
> go/no-go v [`../middleware-policy/instructor-notes.md`](../middleware-policy/instructor-notes.md)).
> Injection se nikdy nevkládá do knihovny `Runbooky` v tenantu — jen do lokální kopie.

Nosná linka: Support Asistent dostane systémový prompt, rozdělí se na **triage + resolver**,
pak je **napaden přes obsah runbooku** (obrana z promptu padne), dostane middleware
pokrývající **oba** agenty a nakonec se mu zúží scope.

## Materiál k samostudiu

[`event-driven-hosting`](../event-driven-hosting/) — osa hostingu, timeouty
a idempotence; „hosting v kostce" je složený do bloku Agent 365 na D5. Viz
[`../self-study.md`](../self-study.md).

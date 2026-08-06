# Den 3 — Prompt, multi-agent a politiky

Jak se skládá prompt a systémová orchestrace vlastního modelu, orchestrace nad Agents SDK
(Microsoft Agent Framework) a guardraily jako kód v middleware pipeline.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Prompt & systémová orchestrace | [`prompt-orchestration`](prompt-orchestration/) | P |
| 2 | Microsoft Agent Framework, workflows & multi-agent (A2A) | [`agent-framework`](agent-framework/) | P |
| 3 | Middleware & enforcement politik | [`middleware-policy`](middleware-policy/) | P |
| 4 | SharePoint Copilot Apps — interaktivní UX v Copilot canvasu *(Public Preview)* | [`spfx-copilot-apps`](spfx-copilot-apps/) | P |

> [!NOTE] Blok 1 je protějšek deklarativních instructions ze dne 2 — tady je model,
> system prompt i tool-call loop poprvé plně v rukou studenta. Blok 2 je největší doplněk
> proti publikované katalogové osnově (Agent Framework tam chybí úplně). Blok 3 slučuje
> Responsible AI guardraily s middleware pipeline záměrně: v pro-code kurzu je guardrail
> **kód v pipeline**, ne slide o zodpovědné AI.

> [!WARNING] Den 3 je po navýšeních na ~7,6 h — přetéká, čeká na rozhodnutí autora
> 110 + 135 + 150 + 60 min = 455 min. Middleware lab dostal +15 min a blok 4 je nově
> **hands-on** (60 min, most k SPFx kurzům — každý student si scaffoldne vlastní Copilot
> App). Den se do reálné dotace (~6,25–6,5 h) nevejde; co ustoupí, rozhodne autor —
> viz CLAUDE.md, otevřená otázka hustoty.

Agent z nosné linky dnes dostane systémový prompt s měřenou baseline, rozdělí se na dva
(triage + resolver) a dostane redakční middleware — a student si scaffoldne první vlastní
Copilot App.

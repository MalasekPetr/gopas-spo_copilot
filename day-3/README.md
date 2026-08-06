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

Reálná zátěž ~6,9 h (110 + 135 + 135 + 35 min) — nad kalibračním stropem; blok 4 je
vědomě kompaktní vizuální závěr dne (showcase bez labu, most k SPFx kurzům) a při skluzu
se zkracuje první. Agent z nosné linky dnes dostane systémový prompt s měřenou baseline,
rozdělí se na dva (triage + resolver) a dostane redakční middleware — a student uvidí,
kam jeho výstup může dorůst v Copilot canvasu.

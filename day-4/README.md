# Den 4 — Copilot Apps, hosting, Marketplace a governance

Vizuální hands-on rozjezd (SharePoint Copilot Apps), pak narativ **agent opouští
notebook**: hosting → publikace do org katalogu → Marketplace (case study Normiqa
Navigator) → enterprise governance (Agent 365).

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | SharePoint Copilot Apps — interaktivní UX v Copilot canvasu *(Public Preview)* | [`spfx-copilot-apps`](spfx-copilot-apps/) | P |
| 2 | Událostmi řízená orchestrace, hosting & publikace | [`event-driven-hosting`](event-driven-hosting/) | P |
| 3 | Agenti v Marketplace — podmínky publikace | [`marketplace-agents`](marketplace-agents/) | P |
| 4 | Agent 365, Entra Agent ID & instrumentace pro-code agenta | [`agent-365-governance`](agent-365-governance/) | P |

> [!NOTE] Blok 1 je hands-on most k SPFx kurzům (MCP Apps model) — každý student si
> scaffoldne vlastní Copilot App v Copilot Workbench. Blok 2 končí publikací do kanálů —
> publikace dává smysl až tady, agent nejdřív potřebuje veřejný endpoint z hostingu.
> Blok 4 je **pro-code diferenciátor celého kurzu**: Copilot Studio agenti se do Agent 365
> registry registrují automaticky, pro-code agenti se musí **explicitně instrumentovat**
> (Agent 365 SDK/CLI). To je práce, kterou tato audience dělá — a vyvrací to tezi
> „low-code je governed, pro-code je divočina".

Reálná zátěž ~6,8 h (60 + 170 + 50 + 130 min) — nad kalibračním stropem; marketplace blok
se při skluzu zkracuje první. Bloky 2–4 stojí na instruktorských demech (Azure
subscription, Partner Center, resp. Agent 365 licence) — viz
[`../environment.md`](../environment.md), matice požadavků.

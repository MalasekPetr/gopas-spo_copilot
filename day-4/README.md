# Den 4 — Hosting, publikace, Marketplace a governance

Narativ dne: **agent opouští notebook**. Hosting → publikace do org katalogu →
Marketplace (case study Normiqa Navigator) → enterprise governance (Agent 365) →
third-party alternativa (Orchestry).

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Událostmi řízená orchestrace, hosting & publikace | [`event-driven-hosting`](event-driven-hosting/) | P |
| 2 | Agenti v Marketplace — podmínky publikace | [`marketplace-agents`](marketplace-agents/) | P |
| 3 | Agent 365, Entra Agent ID & instrumentace pro-code agenta | [`agent-365-governance`](agent-365-governance/) | P |
| 4 | Orchestry — third-party alternativa governance | [`orchestry-governance`](orchestry-governance/) | P |

> [!NOTE] Blok 1 končí publikací do kanálů — publikace dává smysl až tady, agent nejdřív
> potřebuje veřejný endpoint z hostingu. Blok 3 je **pro-code diferenciátor celého kurzu**:
> Copilot Studio agenti se do Agent 365 registry registrují automaticky, pro-code agenti
> se musí **explicitně instrumentovat** (Agent 365 SDK/CLI). To je práce, kterou tato
> audience dělá — a vyvrací to tezi „low-code je governed, pro-code je divočina".
> Bloky 2 a 4 jsou kompaktní srovnávací formáty (50 + 35 min).

Reálná zátěž ~6,4 h (170 + 50 + 130 + 35 min). Bloky 1–3 stojí na instruktorských demech
(Azure subscription, Partner Center, resp. Agent 365 licence) — viz
[`../environment.md`](../environment.md), matice požadavků.

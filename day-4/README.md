# Den 4 — Hosting, governance a kvalita

Kde agent běží, jak se dostane pod enterprise governance, a jak se měří, že je dobrý.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Událostmi řízená orchestrace & hosting | [`event-driven-hosting`](event-driven-hosting/) | P |
| 2 | Agent 365, Entra Agent ID & instrumentace pro-code agenta | [`agent-365-governance`](agent-365-governance/) | P |
| 3 | Evaluace & kvalita | [`evaluation-quality`](evaluation-quality/) | P |

> [!NOTE] Blok 2 je **pro-code diferenciátor celého kurzu**: Copilot Studio agenti se do
> Agent 365 registry registrují automaticky, pro-code agenti se musí **explicitně
> instrumentovat** (Agent 365 SDK/CLI). To je práce, kterou tato audience dělá — a vyvrací
> to tezi „low-code je governed, pro-code je divočina".
>
> Blok 3 navazuje bezprostředně: bez telemetrie z bloku 2 se evaluace dělá naslepo.

Reálná zátěž ~6,5 h. Bloky 1 a 2 jsou pod baseline `spdemo.online` + PAYG **instruktorské
demo** (potřebují Azure subscription, resp. Agent 365 licenci) — viz
[`../environment.md`](../environment.md), matice požadavků.

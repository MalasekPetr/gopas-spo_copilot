# Den 5 — Hosting, governance, kvalita a capstone

Narativ **agent opouští notebook**: hosting → publikace → governance. Pak jak se měří,
že je agent dobrý, a nakonec end-to-end architektura postavená z artefaktů celého týdne.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Hosting & publikace *(zkráceno na demo)* | [`event-driven-hosting`](../day-4/event-driven-hosting/) | P |
| 2 | Agent 365, Entra Agent ID & instrumentace pro-code agenta | [`agent-365-governance`](../day-4/agent-365-governance/) | P |
| 3 | Evaluace & kvalita | [`evaluation-quality`](evaluation-quality/) | P |
| 4 | Capstone architektura & roadmapa *(elastický 60–120 min)* | [`capstone`](capstone/) | P |

> [!NOTE] Blok 1 je instruktorské demo — studenti nemají Azure subscription. Osa hostingu
> (App Service / Container Apps / Functions / Logic Apps / Foundry Agent Service) jde do
> samostudia; živě zůstávají **timeouty a idempotence**, které na Azure nezávisí a jsou
> hodnotové jádro. Blok 2 je pro-code diferenciátor celého kurzu: Copilot Studio agenti
> se do Agent 365 registrují automaticky, **pro-code agenti se musí explicitně
> instrumentovat**; součástí je 10min srovnání s third-party governance (Orchestry).
> Blok 3 staví na telemetrii z bloku 2 — bez ní se evaluace dělá naslepo.

Reálná zátěž **285 min** (60 + 85 + 80 + 60). Den je nejlehčí záměrně.

> [!WARNING] Studenti odcházejí dřív
> Zkušenost z jiných běhů: 1–2 h před koncem začnou odjezdy. **Capstone je hodnotový závěr
> a musí proběhnout** — při skluzu se prezentace mění na pair-share, ale jádro (end-to-end
> architektura + evaluační matice + rollback plán) zůstává vždy. Část E labu
> `evaluation-quality` (souhrnná tabulka týdne) taky nevynechávat — je to moment, kdy
> studenti poprvé vidí celý týden jako jednu křivku.

Blok 4 uzavírá i kariérní nit — další kroky jsou **AI-103** a **AI-200**, ne retirované
AI-102/AZ-204, které jmenuje katalogová osnova (viz [`../GLOSSARY.md`](../GLOSSARY.md)).

## Materiál k samostudiu

- [`perf-cost-lifecycle`](perf-cost-lifecycle/) — prompt caching, token budget, model
  retirements, promotion dev → test. Jádro (token budget) je složené do capstonu.
- [`orchestry-governance`](orchestry-governance/) — third-party governance jako alternativa
  k Agent 365; 10min shrnutí je součástí bloku 2.
- [`security-risk`](security-risk/) — sloučeno do bloku „Bezpečnost & middleware" (D4);
  složka zůstává jako mapa a podklad útoků.

Přehled a důvody: [`../self-study.md`](../self-study.md).

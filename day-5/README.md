# Den 5 — Governance, kvalita a capstone

Enterprise governance pro-code agenta, jak se měří že je dobrý, odpověď na zájem o vlastní
retrieval — a end-to-end architektura postavená z artefaktů celého týdne.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Agent 365, Entra Agent ID & instrumentace *(vč. hostingu v kostce)* | [`agent-365-governance`](../day-4/agent-365-governance/) | P | 60 |
| 2 | Evaluace & kvalita | [`evaluation-quality`](evaluation-quality/) | P | 60 |
| 3 | Vlastní retrieval — instruktorské demo | [`opt-custom-retrieval`](../day-2/opt-custom-retrieval/) | P | 30 |
| 4 | Capstone architektura & roadmapa | [`capstone`](capstone/) | P | 60 |

> [!NOTE] Blok 1 je pro-code diferenciátor celého kurzu: Copilot Studio agenti se do
> Agent 365 registrují automaticky, **pro-code agenti se musí explicitně instrumentovat**.
> Pohltil i „hosting v kostce" (kde běží endpoint vs. orchestrace okolo něj) a 10min
> srovnání s third-party governance (Orchestry). Blok 2 staví na telemetrii z bloku 1 —
> bez ní se evaluace dělá naslepo. Blok 3 je odpověď na zájem skupiny o vlastní
> vektorizaci: demo místo plného modulu, plný text zůstává ke čtení.

> [!WARNING] Nejkratší den — 9:00 až 13:00 **bez pauzy na oběd**
> Reálně ~220 min čistého času; plán má **210**, rezerva je deset minut. Bez oběda klesá
> pozornost rychleji než obvykle.
>
> **Capstone je hodnotový závěr a musí proběhnout.** Při skluzu se zkracuje blok 2, ne
> capstone. Drž ho na 60 minutách v **pair-share** formátu, ne jako sérii prezentací —
> jádro (end-to-end architektura + evaluační matice + rollback plán) zůstává vždy.
> Část E labu `evaluation-quality` (souhrnná tabulka týdne) nevynechávat: je to moment,
> kdy studenti poprvé vidí celý týden jako jednu křivku, a je vstupem do capstonu.

Blok 4 uzavírá i kariérní nit — další kroky jsou **AI-103** a **AI-200**, ne retirované
AI-102/AZ-204, které jmenuje katalogová osnova (viz [`../GLOSSARY.md`](../GLOSSARY.md)).

## Materiál k samostudiu

- [`perf-cost-lifecycle`](perf-cost-lifecycle/) — token ekonomika, cache, promotion.
  Jádro (token budget) je složené do capstonu.
- [`orchestry-governance`](orchestry-governance/) — third-party governance; 10min shrnutí
  je součástí bloku 1.
- [`security-risk`](security-risk/) — sloučeno do bloku „Bezpečnost & middleware" (D4).

Přehled a důvody: [`../self-study.md`](../self-study.md).

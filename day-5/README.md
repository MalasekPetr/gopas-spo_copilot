# Den 5 — Bezpečnost, náklady a capstone

Útoky na agenty a obrana proti nim, ekonomika provozu a lifecycle, a nakonec end-to-end
architektura postavená z artefaktů celého týdne.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Bezpečnost & řízení rizik (exfiltrace, prompt injection) | [`security-risk`](security-risk/) | P |
| 2 | Výkon, náklady & lifecycle *(elastický blok)* | [`perf-cost-lifecycle`](perf-cost-lifecycle/) | P |
| 3 | Capstone architektura & roadmapa *(elastický 60–120 min)* | [`capstone`](capstone/) | P |

> [!NOTE] Záměrně volnější závěr (~5–6 h) — studenti občas odcházejí o 1–2 h dřív. Bloky 2 i 3
> jsou elastické: blok 2 jde zkrátit na výklad bez labu, capstone prezentace se mění na
> pair-share. Jádro capstonu (end-to-end architektura + evaluační matice + rollback plán)
> zůstává vždy.

Blok 1 útočí na **vlastního agenta studenta** z nosné linky — prompt injection přes obsah
v knowledge zdroji. To je nejsilnější „aha" moment kurzu: obrana není v promptu, ale
v middleware a v minimalizaci scope.

Blok 3 uzavírá i kariérní nit — další kroky jsou **AI-103** a **AI-200**, ne retirované
AI-102/AZ-204, které jmenuje katalogová osnova (viz [`../GLOSSARY.md`](../GLOSSARY.md)).

# Den 5 — Kvalita, bezpečnost, náklady a capstone

Jak se měří, že agent je dobrý, útoky na agenty a obrana proti nim, ekonomika provozu
a lifecycle, a nakonec end-to-end architektura postavená z artefaktů celého týdne.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Evaluace & kvalita | [`evaluation-quality`](evaluation-quality/) | P |
| 2 | Bezpečnost & řízení rizik (exfiltrace, prompt injection) | [`security-risk`](security-risk/) | P |
| 3 | Výkon, náklady & lifecycle *(elastický blok)* | [`perf-cost-lifecycle`](perf-cost-lifecycle/) | P |
| 4 | Capstone architektura & roadmapa *(elastický 60–120 min)* | [`capstone`](capstone/) | P |

> [!NOTE] Blok 1 navazuje na governance telemetrii ze dne 4 — bez ní se evaluace dělá
> naslepo; golden set z něj je zároveň vstup pro capstone. Studenti občas odcházejí
> o 1–2 h dřív; bloky 3 i 4 jsou elastické: blok 3 jde zkrátit na výklad bez labu,
> capstone prezentace se mění na pair-share. Jádro capstonu (end-to-end architektura +
> evaluační matice + rollback plán) zůstává vždy.

Reálná zátěž ~6 h (130 + 110 min + dva elastické bloky). Blok 2 útočí na **vlastního
agenta studenta** z nosné linky — prompt injection přes obsah v knowledge zdroji. To je
nejsilnější „aha" moment kurzu: obrana není v promptu, ale v middleware a v minimalizaci
scope.

Blok 4 uzavírá i kariérní nit — další kroky jsou **AI-103** a **AI-200**, ne retirované
AI-102/AZ-204, které jmenuje katalogová osnova (viz [`../GLOSSARY.md`](../GLOSSARY.md)).

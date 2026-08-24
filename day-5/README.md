# Den 5 — Governance alternativa, kvalita, bezpečnost a capstone

Third-party pohled na governance (Orchestry), jak se měří, že agent je dobrý, útoky na
agenty a obrana proti nim, ekonomika provozu a lifecycle, a nakonec end-to-end
architektura postavená z artefaktů celého týdne.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Orchestry — third-party alternativa governance | [`orchestry-governance`](orchestry-governance/) | P |
| 2 | Evaluace & kvalita | [`evaluation-quality`](evaluation-quality/) | P |
| 3 | Bezpečnost & řízení rizik (exfiltrace, prompt injection) | [`security-risk`](security-risk/) | P |
| 4 | Výkon, náklady & lifecycle *(elastický blok)* | [`perf-cost-lifecycle`](perf-cost-lifecycle/) | P |
| 5 | Capstone architektura & roadmapa *(elastický 60–120 min)* | [`capstone`](capstone/) | P |

> [!NOTE] Blok 1 navazuje na Agent 365 ze závěru dne 4 — third-party srovnání, dokud je
> čerstvé. Blok 2 staví na governance telemetrii — bez ní se evaluace dělá naslepo; golden
> set z něj je zároveň vstup pro capstone. Studenti občas odcházejí o 1–2 h dřív; bloky
> 4 i 5 jsou elastické: blok 4 jde zkrátit na výklad bez labu, capstone prezentace se mění
> na pair-share. Jádro capstonu (end-to-end architektura + evaluační matice + rollback
> plán) zůstává vždy.

Reálná zátěž ~6,8 h s ventily (jádro 35 + 130 + 130 min + dva elastické bloky, dohromady
min. ~110 min: blok 4 jako výklad bez labu, capstone na 60). Bez ventilů až 8,9 h — den
stojí a padá s jejich použitím. Blok 3 útočí na
**vlastního agenta studenta** z nosné linky — prompt injection přes obsah v knowledge
zdroji. To je nejsilnější „aha" moment kurzu: obrana není v promptu, ale v middleware
a v minimalizaci scope.

Blok 5 uzavírá i kariérní nit — další kroky jsou **AI-103** a **AI-200**, ne retirované
AI-102/AZ-204, které jmenuje katalogová osnova (viz [`../GLOSSARY.md`](../GLOSSARY.md)).

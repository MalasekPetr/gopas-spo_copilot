# Den 2 — Copilot v SharePointu, deklarativní strop a hygiena

**Celý den bez Azure** — jede na tenantu `spdemo.online` a PAYG. Od Skills a SharePoint
agentů přes deklarativního agenta až po otázku, kterou praxe klade před groundingem:
je tenant na agenta uklizený?

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Skills — rozšíření Copilot in SharePoint | [`skills`](skills/) | P | 70 |
| 2 | SharePoint agents *(instruktorské demo)* | [`sharepoint-agents`](sharepoint-agents/) | P | 30 |
| 3 | Deklarativní agenti & Agents Toolkit | [`declarative-agents`](declarative-agents/) | P | 100 |
| 4 | Datová hygiena + SharePoint Advanced Management | [`data-hygiene`](data-hygiene/) | P | 60 |
| 5 | Agenti v Marketplace — podmínky publikace (case study Normiqa Navigator) | [`marketplace-agents`](../day-4/marketplace-agents/) | P | 50 |

> [!NOTE] Bloky 1 a 2 jsou převzaté z GOC224 a zařazené podle zájmu skupiny
> (rozhodnutí lektora 2026-08-25). Skills ukazují, kam až dosáhne Copilot in SharePoint
> bez agenta; SharePoint agent je nejbližší vstup pro publikum, které spravuje obsah —
> včetně jeho tvrdého stropu (jeden zdroj a nic jiného). Blok 3 se sem přesunul z dne 1
> a končí **přesně pojmenovaným stropem** deklarativní cesty. Blok 4 je rozšířený
> o hloubku **SAM** — tři pilíře, RAC vs. RCD a licenční past.

**Odučeno 2026-08-25, ~310 min** — vešel se navíc blok Normiqa Navigator (case study
z [`../day-4/marketplace-agents/`](../day-4/marketplace-agents/)). Kapacita dne se tím
změřila podruhé: D1 byl s 245 min výjimka kvůli onboardingu, pracovní etalon je ~310.

> [!IMPORTANT] Strop zůstává přes noc bez odpovědi
> Deklarativní agent dnes narazí na strop (dotaz 3 nezaloží tiket, dotaz 4 odmítne jen
> promptem), ale custom engine přijde až zítra. Uzavři den větou, která z toho udělá
> argument místo díry: *„Strop jste viděli. Odpověď na něj začneme psát zítra ráno —
> dneškem jsme se ujistili, že tenant, do kterého ho pustíme, je uklizený."*

Nosná linka dnes získá **deklarativní Support Asistent v1** se změřeným stropem
a hygienický checklist, který říká, **proč mu smí zákazník věřit**.

## Materiál k samostudiu

[`opt-custom-retrieval`](opt-custom-retrieval/) — vlastní vektorizace. Na D5 z něj jede
**30min instruktorské demo** (zájem skupiny); plný text zůstává ke čtení. Viz
[`../self-study.md`](../self-study.md).

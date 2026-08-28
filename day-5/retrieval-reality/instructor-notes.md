# Instructor notes — Tekuté písky retrievalu

## Timing

**25 min**, blok 3. Výklad s ukázkami, **bez labu**. Rozpad: sekce 1–2 osm minut
(proč to nefungovalo), sekce 3 pět minut (cena), sekce 4 pět minut (vlastní vektorizace),
sekce 5–6 sedm minut (tři rozhraní a rozptyl).

Blok navazuje na otázku z úterý o vlastní vektorizaci a **předává rozptyl verdiktů
do bloku 4** (evaluace). Nepřehazovat pořadí.

## Go/no-go

- **Nic se nespouští živě.** Všechna čísla jsou naměřená 27. 8. a jsou v textu.
  Kdo chce reprodukci, má ji v [`../perf-cost-lifecycle/mereni-retrieval-vs-search.md`](../perf-cost-lifecycle/mereni-retrieval-vs-search.md).
- Chceš-li přesto ukázat naživo, potřebuješ **platný token a hlavičku `Accept-Language`** —
  bez ní uvidíš prázdno a demo vypadá rozbitě. Skript:
  [`../perf-cost-lifecycle/je-to-naindexovane.mjs`](../perf-cost-lifecycle/je-to-naindexovane.mjs).
- **Čísla mají datum.** Když je od měření víc než měsíc, řekni to nahlas — je to
  součást pointy o tekutých píscích, ne omluva.

## Tripwires

- **„Takže Retrieval API je špatné."** Není. Je nejlepší v poměru kvalita/cena
  (5× nejlepší z 8). Špatná byla naše volba formátu obsahu.
- **„Takže máme všechno převést na PDF."** Ne nutně — jsou tři cesty a connector je
  často lepší. A převod rozbije fulltextovou cestu, pokud se nepřidá `filetype:md`.
- **Studenti si zapamatují jen tu hlavičku.** Je to nejlepší historka bloku, ale ne jeho
  pointa. Pointa je, že **formát obsahu je architektonické rozhodnutí**. Vracet se k tomu.
- **Nepouštět se do obhajoby Microsoftu ani do stížností na něj.** Blok není o tom,
  že dokumentace je špatná; je o tom, jak se v pohyblivém prostředí pracuje — měřením
  a s datem u každého čísla.
- Někdo se zeptá, proč jsme to nezjistili dřív. Správná odpověď: **protože API vracelo
  `200`.** To je celá lekce o mlčících chybách v jedné větě.

## Otázka, kterou položit

*„Kdyby váš agent zítra přestal nacházet podklady — jak dlouho by vám trvalo zjistit proč?"*

Po tomhle bloku mají odpověď: podívat se na **dobu odpovědi**, ne na počet výsledků.

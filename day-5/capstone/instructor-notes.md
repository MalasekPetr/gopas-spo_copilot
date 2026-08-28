# Instructor notes — Capstone architektura & roadmapa

## Timing

**70 min** (55 + 15 na část D). Rozpad: A 20 / B 15 / C 10 / D 15 / E 5 / F+G 5.
Při skluzu se krátí C a G — **A, B a D nikdy nevypouštět**.

**Bez prezentací** (rozhodnuto 2026-08-28). Místo nich obchází instruktor stoly
a u každého blueprintu položí jednu otázku. Je to rychlejší, adresnější a nikdo
nesedí a neposlouchá osm cizích architektur.

## Go/no-go

- **Ověřit certifikační cesty** na stránce retirementů. AI-103 a AI-200 jsou stav k 2026-08.
  Student si to odnáší jako doporučení a šíří dál — chyba tady je nejviditelnější v kurzu.
- **Mít vlastní vzorový blueprint** jako referenci hloubky. Bez vzoru studenti píšou
  eseje nebo tři odrážky.
- Zkontrolovat, že mají naměřená data z D3–D4 (`usage-log.jsonl`) — bez nich je KPI matice
  vymyšlená a část D nemá co počítat.

## Tripwires

- **Blueprint bez odůvodnění je diagram.** Část B5 („co by to rozhodnutí změnilo") je test,
  jestli rozhodnutí udělali, nebo jen zapsali, co jim vyšlo v labu.
- **V diagramu dělá všechno model.** Ptát se u *konkrétní* šipky „proč tohle nemůže udělat
  volání API?" — obecná otázka nefunguje.
- **Chybí business KPI.** Technici napíšou pass rate a latenci. Sponzor rozhoduje podle
  nákladu na dotaz a podílu vyřešených bez člověka.
- „Budeme to sledovat" místo „měří se takhle, z téhle telemetrie". Část C8.
- **Studenti chtějí v capstonu stavět.** Není to stavba, je to obhajoba. Čas navíc jde
  do psaní a do otázek u stolu, ne do kódu.
- **Vlastní zadání z praxe aktivně nabízet** — studenti se stydí, a přitom je to hodnota,
  kterou si odnesou do práce.

## Část D — náklady a ROI

Kalkulačka je v repu: [`../perf-cost-lifecycle/roi-calculator.html`](../perf-cost-lifecycle/roi-calculator.html),
otevře se dvojklikem a jede offline. Nech nejdřív všechny zadat **svoje** parametry
a teprve pak ukaž tři naměřená čísla z kurzu (78,5 % reasoning · 12× rozptyl · 0,2 % cache).
V opačném pořadí si je jen opíšou.

## Otázka ke každému stolu

*„Co by tohle rozhodnutí změnilo?"* — nejlepší diagnostický nástroj celého kurzu.
Odhalí, jestli student rozhodnutí udělal, nebo popsal to, co mu vyšlo.

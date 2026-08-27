# Instructor notes — Capstone architektura & roadmapa

## Timing

- **Elastický blok 60–120 min.** Poslední blok kurzu; studenti občas odcházejí dřív.
- Rozpad při 120 min: A 25 / B 25 / C 20 / D 15 / E dle počtu lidí / F 10.
- Rozpad při 60 min: A 15 / B 20 / D 10 / pair-share 10 / F 5. Části C a F zkrátit,
  **A, B a D nikdy nevypouštět**.
- Část A má tři kroky (diagram, hranice oprávnění, **co nedělá model**). Při 60 min
  se třetí krok nedělá písemně — projde se ústně nad diagramem, ~2 min na osobu.

## Go/no-go — otestovat před během

- **Ověřit certifikační cesty** na stránce retirementů. AI-103 a AI-200 jsou stav k 2026-08;
  mění se po kvartálech. Tohle je fakt, který si student odnáší jako doporučení a šíří dál —
  chyba tady je nejviditelnější chyba celého kurzu.
- Připravit **jeden vzorový blueprint** (vlastní, ne studentský) jako referenci pro to,
  jak hluboko jít. Bez vzoru studenti píšou eseje nebo tři odrážky.
- Zkontrolovat, že studenti mají naměřené hodnoty z D4 a D5 — bez nich je KPI matice
  vymyšlená.

## Tripwires

- **Blueprint bez odůvodnění** = diagram. Nejčastější výsledek: studenti nakreslí architekturu
  a rozhodnutí nezmíní. Část B5 („co by to rozhodnutí změnilo") je test, jestli rozhodnutí
  skutečně udělali, nebo jen zapsali, co udělali v labu.
- **V diagramu dělá všechno model** (část A3). Typický první návrh: šipka do modelu u každého
  kroku. Ptát se u konkrétní šipky „proč tohle nemůže udělat volání API?" — obecná otázka
  nefunguje, konkrétní šipka ano.
- **Chybí business KPI.** Studenti jsou technici a napíšou pass rate a latenci. Sponzor
  rozhoduje podle nákladu na dotaz a podílu vyřešených bez člověka. Bez toho projekt
  nedostane peníze — to je věta, kterou si mají odnést.
- „Budeme to sledovat" místo „měří se takhle, z téhle telemetrie". Část C8.
- **Kalkulačka v části D je jediný artefakt kurzu mimo repo.** Je publikovaná jako
  soukromá stránka — **před blokem ji musíš nasdílet** (menu Sdílet na stránce),
  jinak ji studenti neotevřou. Odkaz: https://claude.ai/code/artifact/4f481142-dcf1-47e4-9590-844063a94314
- V části D nejdřív nech všechny zadat **svoje** parametry a teprve pak ukaž tři
  naměřená čísla z kurzu (78,5 % reasoning / 12× rozptyl / 0,2 % cache). V opačném
  pořadí si je jen opíšou a nepřekvapí je to.
- **Vlastní zadání z praxe je lepší než Support Asistent.** Aktivně to nabízet — studenti
  se často stydí. Blueprint pro reálný projekt je hodnota, kterou si odnesou do práce.
- Studenti chtějí v capstonu **stavět**. Není to stavba; je to obhajoba. Když je čas navíc,
  jde do prezentací a otázek, ne do kódu.
- U prezentací se držet formátu: jedna otázka od publika, jedna od instruktora.
  Bez struktury to sklouzne do monologů a nezbyde čas na část G.

## Otázka, kterou se ptát u každé prezentace

*„Co by tohle rozhodnutí změnilo?"* — odhalí, jestli student rozhodnutí udělal, nebo
jen popsal to, co mu vyšlo v labu. Je to nejlepší diagnostický nástroj celého kurzu.

## Vazby

- Zpět: **všechno**. Konkrétně: `agent-landscape` + `no-code-showcase` (cesta tvorby),
  `declarative-agents` (deklarativní vs. custom engine), `knowledge-grounding`
  a `opt-custom-retrieval` (retrieval), `agent-framework` (multi-agent ano/ne),
  `event-driven-hosting` (hosting, verzování, publikace),
  `agent-365-governance` (instrumentace, argumentace pro zákazníka),
  `evaluation-quality` (KPI matice, prahy), `security-risk` (model hrozby),
  `perf-cost-lifecycle` (nákladový model, rollback).
- Dopředu: AI-103, AI-200, multi-agent vzory, MCP a vlastní konektory, Foundry Agent Service,
  A2A.

# Instructor notes — Evaluace & kvalita

## Timing

- ~35 min výklad + 45 min lab. **Blok 3 dne 5** (po governance) — části B a D nevyžadují
  model, takže se dají odjet i při únavě. Kompresní ventil: část C labu jeden běh místo
  tří, rozptyl ukázat na instruktorských datech.
- **Část E (souhrnná tabulka týdne) nevynechávat.** Deset minut, a je to moment, kdy studenti
  poprvé vidí celý týden jako jednu křivku. Bez ní působí kurz jako série cvičení.

## Go/no-go — otestovat před během

- Ověřit **aktuální sadu built-in evaluatorů** ve Foundry a jejich názvy (mění se).
  A hlavně: jde evaluovat agenta hostovaného **mimo** Foundry? To rozhoduje, jestli je
  Foundry evaluations v labu použitelné, nebo jen demo.
- Ověřit stav **OpenTelemetry semantic conventions pro AI agenty** — vyvíjejí se; formulace
  ve výkladu na tom závisí.
- Spočítat spotřebu tokenů: golden set 12 případů × 3 běhy × 20 studentů. To je nejdražší
  jednotlivý lab kurzu. Zvážit zkrácení na 8 případů × 2 běhy podle rozpočtu.
- Připravit vlastní naměřená data (pass rate, rozptyl) jako fallback.

## Tripwires

- **Studenti zapíšou očekávaný text, ne očekávané chování.** Pak jim test padá na
  formulacích a považují evaluaci za nefunkční. Část A2 je na to explicitně.
- **Jeden běh jako důkaz.** LLM je nedeterministický; jeden průchod nedokazuje nic.
  Proto tři běhy a rozptyl v části C7 — to je moment, kdy jim to docvakne.
- **Golden set bez negativních případů.** Studenti testují jen to, co má fungovat.
  Případy „musí odmítnout" a „musí přiznat neznalost" jsou to, co reálně selhává.
- **Míchání deterministického a nedeterministického.** Middleware a validace parametrů
  musí projít vždy, 100 %, bez tolerance. Odpovědi modelu mají prahy. Studenti to dávají
  do jednoho testovacího běhu s jednou tolerancí — a tím ztratí obojí.
- U multi-agenta: „agent odpověděl špatně" není diagnóza. Chybil triage, nebo resolver?
  Bez toho se chyba neopraví (část D10).
- „Human-in-the-loop je zdržení" — ukázat návrh, kde člověk schvaluje jen dopadové akce,
  ne každou odpověď.

## Vazby

- Zpět: `prompt-orchestration` (baseline z části A toho labu je zárodek golden setu),
  `agent-framework` (měření ceny multi-agentu), `middleware-policy` (unit testy nad pipeline
  jsou základ deterministické části), `agent-365-governance` (telemetrie — bez ní se
  evaluace dělá naslepo; proto jede tento blok hned po něm).
- Dopředu: `security-risk` (golden set se rozšíří o útočné případy — přímá návaznost),
  `perf-cost-lifecycle` (naměřené tokeny a latence jsou vstup optimalizace; prahy jsou
  součást rozhodnutí o promotion), `capstone` (KPI a evaluační matice = tabulka z části E).
- Kvalitativní nit: `prompt-orchestration` → **tady** → `capstone`.

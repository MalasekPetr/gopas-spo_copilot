# Instructor notes — Výkon, náklady & lifecycle

## Timing

- **Elastický blok, 95–120 min.** Druhý kompresní ventil kurzu (po `opt-custom-retrieval`).
- Při zkrácení: výklad + části A–C labu (měřím, optimalizuji, dokazuji). Lifecycle části
  (D, E) u tabule jako společný návrh — výstupem je jednostránkový plán do capstonu.
- Nechat dost času na capstone po tomhle bloku; studenti odcházejí dřív a capstone je
  hodnotový závěr celého kurzu.

## Go/no-go — otestovat před během

- **Neuvádět žádnou cenu z hlavy.** Ceny modelů, sazby Copilot Credits a data deprecace
  se mění po měsících. Ověřit na aktuálních stránkách a doplnit do výkladu jako
  „stav k <měsíc>".
- Ověřit, jestli **model na kurzovním endpointu podporuje prompt caching** — část B5 na tom
  závisí.
- Ideálně zajistit **druhý model** na endpointu pro část E. Je to nejsilnější moment bloku
  (golden set zachytí, co výměna modelu rozbila). Když to nejde, připravit vlastní naměřená
  data z výměny.
- Ověřit, že studenti mají golden set a naměřené hodnoty z D4 — bez nich část C nemá smysl.

## Tripwires

- **Optimalizace bez měření.** Studenti zúží knowledge, ušetří 40 % tokenů a nevšimnou si,
  že agent přestal odpovídat na třetinu dotazů. Proto je část C povinná — a proto v tomto
  kurzu evaluace (D4) **předchází** optimalizaci.
- **Cache odpovědí bez ACL.** Nejnebezpečnější chyba bloku: stejný dotaz, jiný uživatel,
  jiná oprávněná odpověď. Studenti nacachují první odpověď a rozdají ji všem. Je to
  bezpečnostní incident vyrobený optimalizací — a přímá návaznost na `security-risk`.
- **Systémový prompt se platí v každém turnu.** Studenti to nevědí a píšou dlouhé prompty.
  Ukázat na naměřených číslech z části A.
- **Rostoucí historie** je nejčastější zdroj plýtvání v produkci — a nikdo si toho nevšimne,
  dokud nepřijde faktura.
- „Rollback vrátí všechno." Nevrátí: data, konverzace, založené tikety. Část D11.
- **Čtyři nezávislé verze** (manifest / kód / prompt / model) — studenti počítají s jednou.
  Výměna modelu je verze, kterou **nekontrolujete vy**, a to je celý argument pro golden set.

## Vazby

- Zpět: `evaluation-quality` (golden set je předpoklad — nejsilnější vazba v kurzu),
  `agent-framework` (naměřená cena multi-agentu), `prompt-orchestration` (kontext = tokeny;
  výměna modelu rozbíjí prompty), `event-driven-hosting` (náklady v nečinnosti, cold start),
  `manifest-channels` (verzování, rollback), `security-risk` (zúžený scope má nákladový dopad;
  cache bez ACL je bezpečnostní chyba), `opt-custom-retrieval` (reindex při změně embedding
  modelu jako lifecycle událost — pokud modul jel).
- Dopředu: `capstone` (nákladový model, lifecycle plán a KPI patří do blueprintu).

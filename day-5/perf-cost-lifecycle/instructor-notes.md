# Instructor notes — Výkon, náklady & lifecycle

> Modul se **neodučí jako blok** (samostudium od 2026-08-25), ale jeho materiály se
> v kurzu používají — viz [`README.md`](README.md), přehled se sloupcem „kdy".

## Kde se materiály použijí

| Materiál | Kdy |
| --- | --- |
| [`tekute-pisky-retrievalu.html`](tekute-pisky-retrievalu.html) | D5 blok 0 — výstup z projektu, studenti si ho odnášejí |
| [`roi-calculator.html`](roi-calculator.html) | D5 capstone, část D |
| [`cost-visual.html`](cost-visual.html) | samostudium |

Všechna tři HTML se otevřou dvojklikem z klonu a jedou offline (bez sítě se nenačtou
jen fonty). **Studentům se rozdávají z repa** — žádný externí odkaz, žádné sdílení.

## Go/no-go

- **Neuvádět žádnou cenu z hlavy.** Ceny modelů i sazby Credits se mění po měsících.
  Před během spustit `node cost-calculator.mjs --refresh-prices`, ve třídě pak `--offline`.
- **Vizuál má ceny natvrdo v sobě** — otevřít ho jednou dopředu a ověřit shodu s čerstvým
  snapshotem, jinak studenti uvidí dvě různá čísla pro totéž.
- Studenti musí mít `usage-log.jsonl` z D3–D4, jinak kalkulačka počítá s cizími čísly.

## Tripwires

- **Optimalizace bez měření.** Studenti zúží knowledge, ušetří 40 % tokenů a nevšimnou si,
  že agent přestal odpovídat na třetinu dotazů. Proto v tomhle kurzu evaluace **předchází**
  optimalizaci.
- **Levnější varianta může být levnější tím, že přestala odpovídat.** Změřeno: Copilot
  Search API vyšlo nejlevnější a nejrychlejší, protože v osmi měřeních z osmi nenašlo nic.
  Cena za turn je metrika, kterou lze vylepšit rozbitím funkce.
- **Cache odpovědí bez ACL** — stejný dotaz, jiný uživatel, jiná oprávněná odpověď.
  Bezpečnostní incident vyrobený optimalizací.
- **Systémový prompt se platí v každém turnu**, a rostoucí historie je nejčastější zdroj
  plýtvání v produkci. Nikdo si toho nevšimne, dokud nepřijde faktura.
- **Čtyři nezávislé verze** — manifest, kód, prompt, model. Výměna modelu je verze,
  kterou **nekontrolujete vy**, a to je celý argument pro golden set.
- „Rollback vrátí všechno." Nevrátí data, konverzace ani založené tikety.

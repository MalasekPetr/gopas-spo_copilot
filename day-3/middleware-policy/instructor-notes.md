# Instructor notes — Middleware & enforcement politik

## Timing

- ~60 min výklad + 90 min lab (navýšeno z 75 — rozhodnutí autora 2026-08-06; lab je
  nejnabušenější v kurzu).
- Část D labu je **pointa celého bloku** (a jedna z pointa celého kurzu). Když čas tlačí,
  obětovat část C, ne D — část C je v labu explicitně označená jako volitelná.

## Go/no-go — otestovat před během

- Ověřit, jestli Agents SDK mezitím nepřidalo vlastní middleware abstrakci — změnilo by to
  podobu labu z „postav si pipeline" na „použij tuhle".
- Ověřit aktuální kategorie a konfiguraci content filtrů na platformě (co je default,
  co se ladí). Neuvádět z hlavy.
- Vyzkoušet, že pokus o obejití z D2 na aktuálním modelu **skutečně uspěje** — jinak část D
  ztratí dramaturgii. Když model odolá sám, připravit silnější pokus (injection přes obsah
  runbooku, ne přes uživatelský dotaz).
- Přebuildovat `solution/`.

## Tripwires

- **Studenti opravují halucinace promptem.** I po D2. Tady to musí definitivně padnout:
  vynucení je zablokovaná odpověď bez citace, ne věta „nevymýšlej si".
- „Safety filtry to přece řeší." Neřeší **tvoje** politiky — scope, PII v tvém pojetí,
  business pravidla. Platforma řeší obecný škodlivý obsah. Toto rozlišení studenti nemají.
- Post-processing jako jediná obrana — model už proběhl, tokeny jsou zaplacené.
  Ekonomika obrany: nejlevnější je odmítnout před voláním modelu. Proto je v labu měření
  úspory v části B.
- **Middleware jen nad jedním agentem.** Po D3 jsou dva. Studenti to skoro vždy zapomenou —
  proto je to v ověření explicitně a proto je v části A logování.
- Redakce vs. filtrování vs. odmítnutí — studenti používají zaměnitelně. Tři různé věci
  s různou cenou a různým dopadem na uživatelský zážitek.
- Nezabíhat do auditu a compliance evidence — to je [`../../day-4/agent-365-governance/`](../../day-4/agent-365-governance/).
  Tady je enforcement, tam je dohledatelnost.

## Vazby

- Zpět: `prompt-orchestration` část D (obejití uspělo — tady se napravuje),
  `actions-graph` (validace vstupu do akce = druhá polovina téže obrany),
  `agent-framework` (pipeline musí pokrýt oba agenty).
- Dopředu: `agent-365-governance` (telemetrie z části A je vstup do instrumentace),
  `evaluation-quality` (unit test z části D10 je předstupeň golden setu),
  `security-risk` (D5 útočí na tuhle pipeline injection přes obsah knowledge zdroje —
  a část obran padne, což je záměr).
- Governance nit: `actions-graph` → **tady** → `agent-365-governance` → `security-risk`.

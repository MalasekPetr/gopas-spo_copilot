# Instructor notes — Bezpečnost & middleware (sloučený blok)

## Timing

- **150 min: 50 výklad + 100 lab.** Sloučeno ze `middleware-policy` (150) a `security-risk`
  (130) — rozhodnutí prvního běhu 2026-08-24 po rekalibraci timingu. Úspora 80 min vznikla
  tím, že obrana se staví **jednou**, ne dvakrát.
- **Dramaturgie: útok první.** Část A labu (injection přes obsah runbooku) musí uspět —
  z toho žije zbytek bloku. Bez fungujícího útoku je middleware jen cvičení.
- Když čas tlačí: zkrátit útoky na **jeden** (ne obranu) a obětovat část C (post-processing
  je v labu značená jako volitelná). Části s pipeline a scope jsou nedotknutelné.
- Blok je nejdelší v týdnu — jet dopoledne, ne po obědě.

## Go/no-go — otestovat před během

- **Ověřit middleware kontrakt v JS Agents SDK** (po sjednocení kurzu na TypeScript
  2026-08-24): JS větev SDK se v middleware API liší od C# — ověřit, jak se v aktuální
  verzi `@microsoft/agents-hosting` zapojuje pre/post zpracování turnu. Kdyby chybělo,
  fallback je wrapper kolem handlerů — připravit dopředu, ne u tabule.

- Ověřit, jestli Agents SDK mezitím nepřidalo vlastní middleware abstrakci — změnilo by to
  podobu labu z „postav si pipeline" na „použij tuhle".
- Ověřit aktuální kategorie a konfiguraci content filtrů na platformě (co je default,
  co se ladí). Neuvádět z hlavy.
- **KLÍČOVÉ: ověřit, že injection útok na aktuálním modelu skutečně funguje.** Modely se
  proti známým vzorům průběžně zpevňují a lab bez fungujícího útoku ztrácí smysl. Připravit
  dvě varianty (injection přes obsah runbooku a přes výsledek nástroje), aby bylo z čeho brát.
- Připravit **lokální kopii runbooku s injection payloadem**. Do knihovny `Runbooky`
  v tenantu se injection nevkládá — nikdy.
- Ověřit aktuální stav platformních obran (prompt shields, spotlighting) — co je default.
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
- Nezabíhat do auditu a compliance evidence — to je [`../../agent-365-governance/`](../../day-5/agent-365-governance/).
  Tady je enforcement, tam je dohledatelnost.

- **XPIA se plete s prompt injection.** Držet ostře: u injection je útočníkem uživatel,
  u XPIA **autor obsahu** a uživatel je oběť. Druhé je nebezpečnější a je to reálný model
  hrozby pro agenty nad firemním obsahem.
- **Scope jako poslední krok, ne první.** Studenti chtějí opravovat prompt. Pořadí bloku je
  záměrné: prompt padne → middleware drží → ale skutečná hranice je oprávnění.

## Vazby

- Zpět: `prompt-orchestration` část D (obejití uspělo — tady se napravuje),
  `actions-graph` (validace vstupu do akce = druhá polovina téže obrany; app-only
  protipříklad je předehra ke scope minimalizaci),
  `agent-framework` (pipeline musí pokrýt oba agenty).
- Dopředu: `agent-365-governance` (telemetrie z části A je vstup do instrumentace;
  auditní stopa je to, co nahrazuje watermarking),
  `evaluation-quality` (unit testy nad pipeline jsou předstupeň golden setu).
- Governance nit: `actions-graph` → **tady** → `agent-365-governance`.
- Původní samostatný modul: [`../../security-risk/`](../security-risk/)
  (stub s mapou, kam co skončilo; `lab-injection-and-scope.md` tam zůstává jako podklad
  útoků a scope cvičení).

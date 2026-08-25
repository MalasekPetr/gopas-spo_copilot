# Instructor notes — Agents SDK: jádro

## Timing

- ~50 min výklad + 65 min lab. **Blok 1 dne 3** a zároveň **první blok s Azure** —
  je to odpověď na strop `declarative-agents` z předchozího dne, tak tím otevřít.
  Lab je delší než výklad záměrně: je to první kód týdne a studenti potřebují prostor.
- **Otvírák „co za tebe platforma přestává dělat" má ~10 min** z těch 50. Nepřidává čas
  navíc — dělá pointu „SDK není orchestrátor" srozumitelnou dopředu, takže následující
  sekce jde rychleji. Když se přesto přetáhne, kompresní ventil je stejný jako v agendě.
- **Neotvírat větou „teď přijdou opravdoví agenti".** Podkopává to včerejšek a je to věcně
  špatně — je to vrstvená mapa, ne žebřík. Osa otvíráku je **výměna**: co získáš (kontrola
  nad akcemi, orchestrací, auditem) proti tomu, co si tím kupuješ (hosting, faktura,
  odpovědnost).
- Část D labu (chybové větve) **nezkracovat**. Je to nosný rozdíl mezi tímto kurzem
  a tutoriálem z internetu.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Model endpoint (instruktorský Foundry deployment) funkční z kurzovní sítě** (firewall,
  proxy). Otestovat večer D1 ze stroje v učebně, ne ze svého notebooku; klíče rozdat ráno
  před blokem. Hard cap na deploymentu ověřit spolu s tím.
- Přebuildovat `solution/` aktuální verzí SDK a ověřit signatury proti API referenci —
  namespace a názvy typů se mezi verzemi měnily.
- Ověřit, že Agents Playground startuje bez přihlášení do tenantu (mělo by; když ne,
  je to změna a je potřeba upravit lab).
- Připravit **rozbitý** endpoint / špatný klíč pro část D, aby se demo chybové větve
  nemuselo improvizovat.

## Tripwires

- Studenti s Bot Framework historií hledají **bot registraci a tunel**. Playground je
  nepotřebuje. Říct to explicitně dřív, než se do toho pustí sami.
- **Záměna Agents SDK a orchestrace.** Padne otázka „kde nastavím, aby agent použil nástroj".
  Odpověď: to není SDK, to je orchestrace — **den 4**. SDK jen doručí aktivitu do handleru.
- **„Můžu z custom engine agenta pořád platit Copilot Credits?"** Padne to skoro jistě
  a odpověď je *ano i ne*, ne prosté „ne". Credits nezmizí — grounding přes Retrieval API
  se z nich platí dál. Odstěhuje se **jen inference**. Dělicí čára není typ agenta, ale
  **která služba se volá**; kdo si to splete opačně, postaví rozpočet špatně.
- `TurnState` a rozsahy: studenti dají do user scope věci, které patří do conversation
  (a naopak). Nechat je narazit v labu, pak vysvětlit.
- Někdo uloží klíč do `appsettings.json`. Druhá příležitost té lekce (první byla v onboardingu)
  — tady už s `git status` u tabule.
- Nezabíhat do promptového ladění — to je [`../../day-3/prompt-orchestration/`](../../day-3/prompt-orchestration/).
  Systémový prompt tady záměrně minimální.

## Vazby

- Zpět: toolchain a scaffold z `onboarding`; rozhodnutí „custom engine" z `agent-landscape`;
  změřený strop deklarativního agenta ze včerejška (`declarative-agents`) je motivace
  celého bloku — otevřít jím.
- Dopředu: knowledge (`knowledge-grounding`), akce (`actions-graph`), prompt
  (`prompt-orchestration`) — všechno se zapojuje do tohoto projektu.
  Chybové větve z části D se vracejí v `event-driven-hosting` (timeout patterny)
  a `perf-cost-lifecycle` (odolnost).
- Baseline čtyř testovacích dotazů z labu se používá po každém přírůstku celý týden —
  studenti si ji mají uložit.

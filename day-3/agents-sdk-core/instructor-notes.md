# Instructor notes — Agents SDK: jádro

## Timing

- ~65 min výklad + 20 min env setup + 65 min lab = **150 min**. Pořadí: otvírák →
  Foundry v kostce → **env setup** ([`guide-dev-environment.md`](./guide-dev-environment.md))
  → lab. Setup před labem záměrně: fnm mění PATH a chce nový terminál — kdo ho dělá
  uprostřed labu, ztratí kontext dvakrát.
- **Blok 1 dne 3** a zároveň **první blok s Azure** —
  je to odpověď na strop `declarative-agents` z předchozího dne, tak tím otevřít.
  Lab je delší než výklad záměrně: je to první kód týdne a studenti potřebují prostor.
- **Foundry v kostce má ~15 min** hned po otvíráku (10 výklad + 5 sdílená obrazovka):
  portál → resource group `rg-spo-copilot-course` → Foundry resource → deployment
  `support-agent` → záložka kvóty → cenová stránka modelu. Neukazovat *jak se nasazuje* — jen *kde to je, kdo to platí
  a čím je to brzděné*. Scénář v [`explainer-foundry-basics.md`](./explainer-foundry-basics.md).
- **Portál otevřít předem ve správné identitě.** Subscription žije v adresáři
  `spdemo.online` — účet `malachis.eu` se tam nepřihlásí (AADSTS50020). Použít oddělený
  browser profil pro kurzovní tenant; přepínání identit před 20 lidmi je pět ztracených
  minut a ukázka toho, co učíme nedělat.
- **Otvírák „co za tebe platforma přestává dělat" má ~10 min** z těch 65. Nepřidává čas
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
- **Env setup**: ověřit na stroji v učebně, že `winget` a `npm install -g` nejsou
  blokované politikou; mít offline **Node 22 LTS MSI** jako fallback. Ověřit aktuální
  název npm balíčku `atk` CLI a VS Code rozšíření (obojí se v lineage přejmenovávalo).

## Demo: aktivita vs. turn

Scénář dema k části A je v [`demo-aktivita-vs-turn.md`](demo-aktivita-vs-turn.md).

## Tripwires

- **Scaffold otevře Problems se dvěma chybami** (ověřeno na reálném projektu 2026-08-25):
  `activity.text` je `string | undefined` (oprava `?? ""` — a rovnou teaching point
  „aktivita ≠ text") a ts(5108) v tsconfig (editor má TS 6, projekt 5.x — **neopravovat
  tsconfig**, přepnout Use Workspace Version). Varování je v labu; kdo ho přeskočí,
  „opraví" tsconfig a rozbije si build.
- **Chyba modelu svádí ke „Configure Authentication" v Playgroundu** (ověřeno naživo
  2026-08-26): `OnTurnError` z rozbitého volání modelu vypadá jako problém přihlášení
  a dialog Entra Client ID se nabízí sám. Nesouvisí — je to simulace OAuth uživatele,
  dnes k ničemu. Skutečná chyba je v terminálu agenta / `trace` v Log Panelu; typicky
  404 DeploymentNotFound (název deploymentu) nebo 401 (klíč). Po opravě env
  **úplný Stop (Shift+F5) a nový F5** — `.localConfigs.playground` generují preLaunch
  tasky Toolkitu. **Tlačítko Restart v debug liště nestačí** (restartuje proces, tasky
  nepustí — env oprava se nepropíše; ověřeno naživo 2026-08-26 podle mtime souboru).
- Defaultní hláška „The agent encountered an error or bug" = hotový slide „před"
  pro část D labu. Crash na dotazu 4 („Kolik bere Novák?") patří do baseline —
  je horší než odmítnutí i než halucinace.
- Studenti s Bot Framework historií hledají **bot registraci a tunel**. Playground je
  nepotřebuje. Říct to explicitně dřív, než se do toho pustí sami.
- **Záměna Agents SDK a orchestrace.** Padne otázka „kde nastavím, aby agent použil nástroj".
  Odpověď: to není SDK, to je orchestrace — **den 4**. SDK jen doručí aktivitu do handleru.
- **„Můžu z custom engine agenta pořád platit Copilot Credits?"** Padne to skoro jistě
  a odpověď je *ano i ne*, ne prosté „ne". Credits nezmizí — grounding přes Retrieval API
  se z nich platí dál. Odstěhuje se **jen inference**. Dělicí čára není typ agenta, ale
  **která služba se volá**; kdo si to splete opačně, postaví rozpočet špatně.
- **„Agent si nepamatuje, co jsem napsal před chvílí"** — nahlásí to jako bug. Není:
  handler posílá modelu jen system + aktuální zprávu, historie se neposílá (důkaz
  v usage: prompt ~135 tokenů konstantně, změřeno 2026-08-26). Rozlišení na tabuli:
  **TurnState = stav agenta (čítač roste) ≠ paměť modelu (žádná)**. Historie je
  rozhodnutí, které stojí tokeny — naváže `prompt-orchestration` (D4) a kalkulátor
  (parametr historie). Druhé číslo z téhož měření: **reasoning = 62–78 % completion**
  — tři čtvrtiny výstupu, co se platí a není vidět.
- `TurnState` a rozsahy: studenti dají do user scope věci, které patří do conversation
  (a naopak). Nechat je narazit v labu, pak vysvětlit.
- Někdo uloží klíč do `appsettings.json`. Druhá příležitost té lekce (první byla v onboardingu)
  — tady už s `git status` u tabule.
- Nezabíhat do promptového ladění — to je [`../../prompt-orchestration/`](../../day-4/prompt-orchestration/).
  Systémový prompt tady záměrně minimální.

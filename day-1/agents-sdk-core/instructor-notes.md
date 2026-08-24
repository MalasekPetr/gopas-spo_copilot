# Instructor notes — Agents SDK: jádro

## Timing

- ~60 min výklad + 75 min lab. **Opener dne 2** (prohozeno s `declarative-agents`,
  rozhodnutí prvního běhu 2026-08-24). Lab je delší než výklad záměrně — je to první kód
  týdne a studenti potřebují prostor; ráno na něj mají nejvíc energie.
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
  Odpověď: to není SDK, to je orchestrace — den 3. SDK jen doručí aktivitu do handleru.
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

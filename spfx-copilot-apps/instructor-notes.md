# Instructor notes — SharePoint Copilot Apps (showcase)

## Timing

- ~45 min (15 výklad + 30 lab). **Závěr dne 4** (třetí rekalibrace — už ne opener):
  oddechový vizuální blok po middleware a most na SPFx kurzy na rozloučenou. Původně po
  nejhustším dni; nastartuje energii před instruktorskými demy zbytku dne. Hands-on
  se studenty je rozhodnutí autora (2026-08-06) — klíčová vazba na SPFx kurzy.
- Deploy (část C) zůstává instruktorské demo — admin krok, ne studentský.

## Go/no-go — otestovat před během

- **Preview generator (`@next`) se instaluje v onboardingu dne 1**, ne až tady —
  instalace u 20 strojů uprostřed dne 3 je časová past. Přidat do onboarding checklistu
  a ověřit verzi den předem (preview se mění bez ohlášení).
- **Ověřit aktuální stav preview/GA** na release notes — nejrychleji se měnící blok kurzu.
  Zkontrolovat: verze SPFx, stav rolloutu, jestli platí „bez Copilot licence pro build".
- Demo App postavit a projet **den předem** (Copilot Workbench lokálně + deploy
  do tenantu, pokud rollout dorazil).
- Mít zálohu: video z MS dokumentace, kdyby deploy nefungoval; vlastní běžící projekt
  na promítání pro studenty, kterým preview toolchain selže.

## Tripwires

- **„Takže je to další druh agenta?"** Ne — UX vrstva nad konverzací. Agent = logika,
  App = obrazovka. Držet čisté.
- **„MCP Apps = musím hostovat MCP server?"** Ne — pointa je právě v tom, že hosting
  a routing řeší platforma, komponenta žije v tenantu.
- Publikum s SPFx zkušeností (GOC223/224 absolventi) tu ožije — nenechat blok přerůst
  v SPFx kurz; vazba na web party je jedna věta, ne kapitola.
- Duplicate tool names (známý preview bug) — když App v tenantu koliduje s jinou
  (u 20 studentů reálné!), je to ono; pojmenování App per student (`user.NN`) do zadání.
- Preview toolchain selže u části studentů — počítat s tím, párovat je; neztratit
  20 minut debugováním jednoho stroje.

## Vazby

- Zpět: `middleware-policy` (D3, včera — politiky platí i pro UX výstup), `actions-graph` +
  `knowledge-grounding` (MCP nit — Apps implementují MCP Apps model).
- Dopředu: `marketplace-agents` (dnes odpoledne — store distribuce Apps zatím
  nepodporovaná, srovnat s distribucí agentů), `capstone` (interaktivní UX jako
  roadmapa položka).
- Mimo kurz: GOPAS SPFx kurzy — tenhle blok je most; absolventům SPO_COPILOT dává
  důvod na ně navázat (a naopak).

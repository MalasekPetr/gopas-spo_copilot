# Instructor notes — SharePoint Copilot Apps (showcase)

## Timing

- ~35 min (25 demo-výklad + 10 diskuse). Závěr dne 3 — lehký, vizuální blok po náročném
  middleware labu; funguje jako odměna.
- Nemá vlastní lab — nepouštět studenty do scaffoldu, preview toolchain u 20 strojů
  je časová past. Odkázat na PnP samples jako samostudium.

## Go/no-go — otestovat před během

- **Ověřit aktuální stav preview/GA** na release notes — nejrychleji se měnící blok kurzu.
  Zkontrolovat: verze SPFx, stav rolloutu, jestli platí „bez Copilot licence pro build".
- Demo App postavit a projet **den předem** (Copilot Workbench lokálně + deploy
  do tenantu, pokud rollout dorazil).
- Mít zálohu: video z MS dokumentace, kdyby deploy nefungoval.

## Tripwires

- **„Takže je to další druh agenta?"** Ne — UX vrstva nad konverzací. Agent = logika,
  App = obrazovka. Držet čisté.
- **„MCP Apps = musím hostovat MCP server?"** Ne — pointa je právě v tom, že hosting
  a routing řeší platforma, komponenta žije v tenantu.
- Publikum s SPFx zkušeností (GOC223/224 absolventi) tu ožije — nenechat blok přerůst
  v SPFx kurz; vazba na web party je jedna věta, ne kapitola.
- Duplicate tool names (známý preview bug) — když demo v tenantu koliduje, je to ono;
  zmínit jen když nastane.

## Vazby

- Zpět: `middleware-policy` (politiky platí i pro UX výstup), `actions-graph` +
  `knowledge-grounding` (MCP nit — Apps implementují MCP Apps model).
- Dopředu: `marketplace-agents` (D4 — store distribuce Apps zatím nepodporovaná,
  srovnat s distribucí agentů), `capstone` (interaktivní UX jako roadmapa položka).
- Mimo kurz: GOPAS SPFx kurzy — tenhle blok je most; absolventům SPO_COPILOT dává
  důvod na ně navázat (a naopak).

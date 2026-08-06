# Instructor notes — Grounding: Copilot connectors, semantic index, MCP

## Timing

- ~65 min výklad + 70 min lab.
- Část D labu (rozhodovací reflexe) je krátká, ale nevynechávat — je to vstup do
  `opt-custom-retrieval` i do capstonu.

## Go/no-go — otestovat před během

- Knihovna `Runbooky` na `/sites/hr-demo` naplněná a **zaindexovaná**. Index není okamžitý —
  seed spustit minimálně den předem, jinak část A labu selže a vypadá to jako chyba studenta.
- Ověřit, že student (Business Basic, ne admin) knihovnu vidí a že search vrací výsledky
  pod jeho identitou.
- Ověřit aktuální seznam **default federated konektorů** a jestli už jdou stavět custom —
  kategorie je mladá a mění se.
- Neuvádět počet prebuilt konektorů z hlavy; ověřit na Learn stránce.

## Tripwires

- **„Graph konektory"** — starý název. Studenti ho znají a mluví jím; opravovat vlídně
  a vysvětlit, že backend API se tak **stále** jmenuje. Tohle není pedantství: název je
  v katalogové osnově a studenti podle něj googlí.
- Studenti chtějí hned stavět custom konektor. Není to lab tohoto kurzu (samostatná
  disciplína: schéma, Entra registrace, crawl, ACL). Pojmenovat, kde by se napojil, a jít dál.
- Záměna **knowledge a akce** — obojí může jít přes MCP. Držet rozdíl: knowledge = čtu,
  akce = dělám, a governance je jiná.
- Otázka „proč nedělat vlastní vektorové úložiště, když mám Azure AI Search" padne skoro
  vždy. Odpověď není „nedělej", ale **cenovka**: vlastní ACL model, refresh, ladění relevance,
  a odpovědnost za to, že agent neukáže, co nemá. To je celý `opt-custom-retrieval`.
- Nezabíhat do prompt ladění „aby nehalucinoval" — to je [`../prompt-orchestration/`](../prompt-orchestration/)
  a pořádně až [`../../day-3/middleware-policy/`](../../day-3/middleware-policy/).

## Vazby

- Zpět: agent z `agents-sdk-core` (volá model, má ošetřené chyby).
- Dopředu: `actions-graph` (MCP jako nástroj, hranice oprávnění), `opt-custom-retrieval`
  (kdy si retrieval dělat sám), `manifest-channels` (knowledge deklarativně v manifestu —
  srovnání s tím, co student udělal kódem), `security-risk` (obsah v knowledge zdroji
  jako vektor prompt injection — dotaz 4 se sem vrací).

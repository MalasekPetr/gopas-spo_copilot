# Instructor notes — Grounding: Copilot connectors, semantic index, MCP

## Timing

- ~45 min výklad + 55 min lab. **Opener dne 3.** Deklarativní knowledge (manifest) už
  studenti mají z `declarative-agents` (včera ráno) — tady se nevrací, jen srovnává;
  to výklad zkracuje.
- Část D labu (rozhodovací reflexe) je krátká, ale nevynechávat — je to vstup do
  `opt-custom-retrieval` i do capstonu.

## Go/no-go — otestovat před během

- **Re-verify: Copilot Retrieval API na PAYG studentským účtem.** Empiricky ověřeno
  2026-08-06, ale PAYG consumption je **preview** — podmínky, ceny i dostupnost se mohou
  změnit bez oznámení. Když nefunguje, jet fallback labu (Graph Search API).
- Knihovna `Runbooky` na `/sites/hr-demo` naplněná a **zaindexovaná**. Seed běží
  **v poledne dne 1** (declarative-agents ji potřebuje už odpoledne D1) — index není
  okamžitý; ráno D2 před tímto blokem ověřit (10 min, dotazy 1–2 na deklarativním
  agentovi ze včerejška), jinak selhání vypadá jako chyba studenta.
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
  a pořádně až [`../../middleware-policy/`](../middleware-policy/).

## Vazby

- Zpět: agent z `agents-sdk-core` (volá model, má ošetřené chyby).
- Zpět též: `declarative-agents` (knowledge deklarativně v manifestu — včera; teď to samé
  kódem, srovnání se nabízí samo).
- Dopředu: `actions-graph` (MCP jako nástroj, hranice oprávnění), `opt-custom-retrieval`
  (kdy si retrieval dělat sám), `security-risk` (obsah v knowledge zdroji
  jako vektor prompt injection — dotaz 4 se sem vrací).

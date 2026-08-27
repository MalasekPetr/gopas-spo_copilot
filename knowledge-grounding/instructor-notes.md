# Instructor notes — Grounding: Copilot connectors, semantic index, MCP

## Timing

- ~45 min výklad + 55 min lab. **Opener dne 3.** Deklarativní knowledge (manifest) už
  studenti mají z `declarative-agents` (včera ráno) — tady se nevrací, jen srovnává;
  to výklad zkracuje.
- Část D labu (rozhodovací reflexe) je krátká, ale nevynechávat — je to vstup do
  `opt-custom-retrieval` i do capstonu.

## Go/no-go

- **Mechanismus tabule (od 2026-08-26):** `RETRIEVAL: MOCK/ŽIVĚ`. Výchozí je MOCK —
  `node solution/mock-retrieval.mjs --self-test` na stroji v učebně (servíruje chunky
  z `solution/runbooky/`, lexikální skórování, bez ACL). ŽIVĚ vyžaduje: app registraci
  z `actions-graph` instructor-notes (device code, `Files.Read.All` + `Sites.Read.All`)
  **a** jeden úspěšný testovací POST — API je beta a na PAYG nemusí fungovat.
  Test jedním průchodem (z klonu repa, PowerShell; přihlásit studentským účtem):

  ```powershell
  $env:LAB_CLIENT_ID = "<client-id>"
  $token = node actions-graph/solution/device-auth.mjs "User.Read Files.Read.All Sites.Read.All"
  $body = @{ queryString = "access denied upload"; dataSource = "sharePoint"; maximumNumberOfResults = 3 } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "https://graph.microsoft.com/beta/copilot/retrieval" `
    -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
  ```

  (Ne curl.exe s inline JSONem — pwsh 7 předává `\"` doslova a API vrátí BadRequest
  „Unable to read JSON payload"; nalezeno naživo 2026-08-26. Kódu labu se to netýká,
  fetch posílá JSON korektně.)

  Vrátí `retrievalHits` s obsahem runbooku → tabule ŽIVĚ. Vrátí 402/403/licenční
  chybu → nech MOCK (GRAPH: ŽIVĚ tím není dotčené — na retrievalu nezávisí);
  lab rozdíl explicitně pojmenovává (semantic index + ACL trimming = hodnota
  živé cesty).
- **Retrieval API: rozhoduje APLIKACE, ktera se pta — ne ucet.**
  Přeměřeno 2026-08-27 večer, stejný tenant, stejný dotaz `access denied upload`,
  stejné tělo `{ queryString, dataSource: "sharePoint" }`:

  | Volající aplikace | Účet | Výsledek |
  |---|---|---|
  | naše registrace `4407c56b…` (device code, public client) | `petr.malasek@spdemo.online` | **200 + 0 hitů** |
  | naše registrace `4407c56b…` | `user.15@spdemo.online` | **200 + 0 hitů** |
  | **Graph Explorer** (registrace Microsoftu) | `petr.malasek@spdemo.online` | **200 + data** ✅ |

  Poslední řádek vrátil `access-denied-pri-uploadu.md` s celým extraktem
  a `relevanceScore 0.686`.

  > [!IMPORTANT] Oprava dřívějšího záznamu
  > Matice z 26. 8. připisovala prázdnou odpověď **lektorskému účtu** a označovala
  > ji za licenční anomálii. **Nebyla to vlastnost účtu.** `petr.malasek` jako plný
  > uživatel netrpí žádnou anomálií — přes Graph Explorer data dostane. Proměnná je
  > **volající aplikace**, a tu tehdejší měření nezměnilo, protože jelo jen přes
  > naši registraci.

  Změřením vyloučeno jako příčina: účet a jeho licence, `filterExpression`
  (s ním i bez), `dataSource`, verze API (`beta` i `v1.0`), jazyk i šířka dotazu,
  a **typ souboru** — vrácený hit je `.md` (`resourceType: listItem`), takže
  omezení na `.doc/.docx/.pptx/.pdf/.aspx/.one` se týká jen *semantic* retrievalu,
  ne lexikálního.

  **Co přesně v naší registraci chybí, není dodiagnostikované.** Naše tokeny nesou
  `Files.Read.All` i `Sites.Read.All` (obojí dokumentace vyžaduje), `aud` je Graph,
  `ver: 1.0`, `appidacr: 0` (public client bez credentialu).

  **Didaktické pointy:** (1) tři peněženky naživo; (2) *„200 s prázdnem je horší
  diagnóza než 403"* — a teď na mnohem lepším příkladu: tentýž uživatel, tentýž
  dotaz, tentýž tenant, a odpověď závisí na tom, **která aplikace se ptá**. Přesně
  ten druh chyby, který se v produkci hledá hodiny.
- **Delegated oprávnění Files/Sites.Read.All vyžadují Grant admin consent na
  registraci** — bez něj každý ne-admin narazí na „Need admin approval"
  (změřeno). Jednorázová akce admina, pokrývá celý tenant. — otestovat před během

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

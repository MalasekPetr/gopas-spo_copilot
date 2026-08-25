# Den 3 — První agent v kódu, znalosti a akce

**První den s Azure.** Odpověď na strop deklarativního agenta ze závěru D2: vlastní kód,
vlastní model, vlastní chybové větve — a pak knowledge a akce s korektními hranicemi
oprávnění.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Agents SDK — jádro: AgentApplication, aktivity, turny *(vč. Foundry v kostce a env setupu)* | [`agents-sdk-core`](../agents-sdk-core/) | P | 150 |
| 2 | Grounding: Copilot connectors, semantic index, MCP | [`knowledge-grounding`](../knowledge-grounding/) | P | 85 |
| 3 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](../actions-graph/) | P | 90 |

> [!NOTE] Blok 1 končí prvním běžícím custom engine agentem lokálně (Agents Playground —
> bez tenantu, bez tunelu, bez registrace bota). Blok 2 učí nosné rozlišení **synced vs.
> federated (MCP)** a hlavně *kdy retrieval nedělat sám*; navazuje na hygienu ze závěru D2.
> Blok 3 je pointa custom engine cesty — akce s validací parametrů, na kterou deklarativní
> agent nedosáhl.

Reálná zátěž **325 min** — **15 min nad etalonem ~310**. Pořadí bloku 1:
otvírák → Foundry v kostce → **env setup (fnm + Node 22, Toolkit, `atk`,
[`guide-dev-environment.md`](../agents-sdk-core/guide-dev-environment.md))** → lab.
Ventily v pořadí: Foundry obrazovka 5→2 min · část D `actions-graph` jako demo (−10) ·
`usage` krok společně na plátně (−5). Chybové větve labu bloku 1 nezkracovat.

> [!WARNING] Ranní prerekvizity
> **Ohlásit přestavbu repa** — složky ztratily prefix `day-N/`, studenti musí `git pull`
> a staré cesty v poznámkách už nevedou nikam (viz [`../agenda.md`](../agenda.md)).
>
> **Klíče k model endpointu rozdat před blokem 1** — tři hodnoty (klíč, endpoint,
> deployment name `support-agent`) se zadávají do průvodce Toolkitu, ne ručně do `.env`
> (viz [`../agents-sdk-core/lab-first-agent.md`](../agents-sdk-core/lab-first-agent.md)).
> Endpoint **otestovat ze stroje v učebně**, ne z lektorského notebooku; z notebooku
> ověříš klíč, ne firewall a proxy.
>
> **Portál otevřít předem v browser identitě `spdemo.online`** (AADSTS50020) — blok 1
> obsahuje 5 min sdílené obrazovky Foundry.
>
> Kurzovní model je reasoning model: v labu nastavovat `max_completion_tokens` **400–800**,
> jinak přijde prázdná odpověď s HTTP 200 a vypadá to jako chyba v kódu studenta.

> [!TIP] Kompresní ventil dne
> Část D labu `actions-graph` (app-only protipříklad) jede jako 10min demo — ale
> **nevynechávat**, je to předehra ke scope minimalizaci v D4.

Nosná linka dnes získá custom engine scaffold s LLM turnem, knowledge nad knihovnou
`Runbooky` a dvě akce (Graph + mock ticket API).

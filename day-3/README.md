# Den 3 — První agent v kódu, znalosti a akce

**První den s Azure.** Odpověď na strop deklarativního agenta ze závěru D2: vlastní kód,
vlastní model, vlastní chybové větve — a pak knowledge a akce s korektními hranicemi
oprávnění.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Agents SDK — jádro: AgentApplication, aktivity, turny | [`agents-sdk-core`](../day-1/agents-sdk-core/) | P | 115 |
| 2 | Grounding: Copilot connectors, semantic index, MCP | [`knowledge-grounding`](../day-2/knowledge-grounding/) | P | 85 |
| 3 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](../day-2/actions-graph/) | P | 90 |

> [!NOTE] Blok 1 končí prvním běžícím custom engine agentem lokálně (Agents Playground —
> bez tenantu, bez tunelu, bez registrace bota). Blok 2 učí nosné rozlišení **synced vs.
> federated (MCP)** a hlavně *kdy retrieval nedělat sám*; navazuje na hygienu ze závěru D2.
> Blok 3 je pointa custom engine cesty — akce s validací parametrů, na kterou deklarativní
> agent nedosáhl.

Reálná zátěž **290 min**.

> [!WARNING] Ranní prerekvizity
> **Klíče k model endpointu rozdat před blokem 1** — čtyři hodnoty do `.env`
> (viz [`../environment.md`](../environment.md)). Endpoint **otestovat ze stroje v učebně**,
> ne z lektorského notebooku; z notebooku ověříš klíč, ne firewall a proxy.
>
> Kurzovní model je reasoning model: v labu nastavovat `max_completion_tokens` **400–800**,
> jinak přijde prázdná odpověď s HTTP 200 a vypadá to jako chyba v kódu studenta.

> [!TIP] Kompresní ventil dne
> Část D labu `actions-graph` (app-only protipříklad) jede jako 10min demo — ale
> **nevynechávat**, je to předehra ke scope minimalizaci v D4.

Nosná linka dnes získá custom engine scaffold s LLM turnem, knowledge nad knihovnou
`Runbooky` a dvě akce (Graph + mock ticket API).

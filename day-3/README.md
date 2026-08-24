# Den 3 — Znalosti, akce a prompt

Kde agent bere data (a kdy si retrieval nemá dělat sám), jak dělá akce nad Microsoft
Graphem s korektními hranicemi oprávnění, a jak se skládá systémový prompt vlastního modelu.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Grounding: Copilot connectors, semantic index, MCP | [`knowledge-grounding`](../day-2/knowledge-grounding/) | P |
| 2 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](../day-2/actions-graph/) | P |
| 3 | Prompt & systémová orchestrace | [`prompt-orchestration`](prompt-orchestration/) | P |

> [!NOTE] Blok 1 učí nosné rozlišení **synced vs. federated (MCP)** konektorů a hlavně
> *kdy retrieval nedělat sám*: semantic index dělá relevanci i vynucení permissions za tebe.
> Navazuje na hygienu ze závěru D2. Blok 2 je pointa custom engine cesty — akce s validací,
> na kterou deklarativní agent nedosáhl; část D (app-only protipříklad) jede jako demo,
> ale **nevynechávat**, je to nejsilnější moment labu. Blok 3 je protějšek deklarativních
> instructions z D2: model, system prompt i tool-call loop poprvé plně v rukou studenta.

Reálná zátěž **290 min** (100 + 105 + 85). Baseline čtyř testovacích dotazů z bloku 3 se
používá po každém dalším přírůstku — studenti si ji musí uložit.

> [!TIP] Kompresní ventil dne
> Při skluzu zkrátit část C labu `prompt-orchestration`, pak výklad na 60 min. Část A
> (baseline) **netolerovat vynechat** — bez ní nefunguje ani `evaluation-quality` (D5).

Nosná linka dnes získá knowledge nad knihovnou `Runbooky`, dvě akce (Graph + mock ticket
API) a systémový prompt s měřenou baseline. Pokus o obejití promptu na konci bloku 3
**uspěje** — a to je záměr; napraví se to až middlewarem v D4.

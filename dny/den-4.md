# Den 4 — Akce, prompt, bezpečnost a Copilot Apps

Dopoledne dostane agent **akce s validací** (pointa custom engine cesty) a **prompt
s měřenou baseline**; odpoledne se obojí rozbije útokem a opraví middlewarem.
Závěr dne je vizuální most k SPFx.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](../actions-graph/) | P | 80 |
| 2 | Prompt & systémová orchestrace | [`prompt-orchestration`](../prompt-orchestration/) | P | 55 |
| 3 | Bezpečnost & middleware — útok a obrana jako kód | [`middleware-policy`](../middleware-policy/) | P | 130 |
| 4 | SharePoint Copilot Apps *(Public Preview)* | [`spfx-copilot-apps`](../spfx-copilot-apps/) | P | 45 |

Reálná zátěž **310 min** — přesně na etalonu, žádná rezerva.

> [!WARNING] Ranní prerekvizity
> - **Mocky bloku 1**: `mock-ticket-api` (4000) a `mock-graph` (4001) — studenti
>   spouštějí z klonu repa; self-testy ověřit na učebním stroji.
> - **Tabule: GRAPH: MOCK/ŽIVĚ** — ŽIVĚ jede přes včerejší `.lab-token` (tokeny
>   po ~1 h vypršely → studenti si ráno vyrobí nové; client ID nechat na tabuli).
> - Blok 1 začíná rovnou mechanikou akcí — **identity výklad je odučen ze včerejška**,
>   neopakovat.

> [!TIP] Ventily dne (v pořadí)
> Část D `actions-graph` jako demo (−10) · MOCK místo ŽIVĚ (−5) · část C labu
> `prompt-orchestration` (−10) · lab `spfx-copilot-apps` jako demo (−15).
> **Middleware se nezkracuje** — je to bezpečnostní jádro týdne; jet po poledni.

Nosná linka dnes: `CreateTicket` s validací (eskalace dotazu 3), systémový prompt
s baseline — a důkaz, že prompt jako obrana nestačí, middleware ano. Multi-agent
(triage/resolver, A2A) se přesunul na D5 v kompaktní formě.

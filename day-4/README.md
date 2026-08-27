# Den 4 — Akce, prompt, bezpečnost a Copilot Apps

Dopoledne dostane agent **akce s validací** (pointa custom engine cesty) a **prompt
s měřenou baseline**; odpoledne se obojí rozbije útokem a opraví middlewarem.
Závěr dne je vizuální most k SPFx — **volitelně**, když zbude čas.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](./actions-graph/) | P | 80 |
| 2 | Prompt & systémová orchestrace | [`prompt-orchestration`](./prompt-orchestration/) | P | 55 |
| 3 | Bezpečnost & middleware — útok a obrana jako kód | [`middleware-policy`](./middleware-policy/) | P | 130 |
| 4 | SharePoint Copilot Apps *(Public Preview)* — **volitelný** | [`spfx-copilot-apps`](./spfx-copilot-apps/) | V | 45 |

### Volitelné / samostudium

Nejedou v bloku, ale patří ke dni — student je má po ruce ve stejné složce.

| # | Modul | Slug | Typ | Rozsah |
|---|---|---|---|---|
| — | Bezpečnost a rizika — samostatný text | [`security-risk`](security-risk/) | **V** | sloučeno do bloku 3 |

Reálná zátěž **265 min** bez bloku 4 (etalon ~310) — blok 4 je volitelný a jede jen
při náskoku.

> [!NOTE] Změřeno v prvním běhu (2026-08-27)
> Bloky 1–3 zabraly celý den a blok 4 **neproběhl**. Nebyl to skluz, ale realita:
> `actions-graph` s živým Graphem a `middleware-policy` s žebříkem útoků nejdou
> odbýt. Proto je blok 4 nově **volitelný** — plánuj den na 265 min a SPFx nabídni
> jako samostudium s hotovým řešením v modulu.

> [!WARNING] Ranní prerekvizity
> - **Mocky bloku 1**: `mock-ticket-api` (4000) a `mock-graph` (4001) — studenti
>   spouštějí z klonu repa; self-testy ověřit na učebním stroji.
> - **Tabule: GRAPH: MOCK/ŽIVĚ** — ŽIVĚ jede přes včerejší `.lab-token` (tokeny
>   po ~1 h vypršely → studenti si ráno vyrobí nové; client ID nechat na tabuli).
> - Blok 1 začíná rovnou mechanikou akcí — **identity výklad je odučen ze včerejška**,
>   neopakovat.

> [!TIP] Ventily dne (v pořadí)
> Blok 4 `spfx-copilot-apps` vypustit celý (−45, je volitelný) · část D `actions-graph`
> jako demo (−10) · MOCK místo ŽIVĚ (−5) · část C labu `prompt-orchestration` (−10).
> **Middleware se nezkracuje** — je to bezpečnostní jádro týdne; jet po poledni.

Nosná linka dnes: `CreateTicket` s validací (eskalace dotazu 3), systémový prompt
s baseline — a důkaz, že prompt jako obrana nestačí, middleware ano. Multi-agent
(triage/resolver, A2A) se přesunul na D5 v kompaktní formě.

# Instructor notes — Deklarativní agenti & Agents Toolkit

## Timing

- ~40 min výklad + 60 min lab. **Opener dne 2** — přesunut z D1, kde se nevešel
  (přetečení prvního běhu 2026-08-24). Studenti jsou čerství, lab je rychlý a vidí výsledek
  v M365 Copilotu; to je nejlepší energie na začátek dne. Změřený strop je cliffhanger
  na `agents-sdk-core`, který jede hned potom.
- Část D labu (strop) je hodnotové jádro celého bloku. Nezkracovat na úkor částí A–C.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Re-verify: provisioning deklarativního agenta na PAYG bez Copilot licence.**
  Empiricky funguje (potvrzeno 2026-07-17 na jiném běhu), ale **Microsoft to takto
  nedokumentuje** — může se změnit bez oznámení. Otestovat studentským účtem, ne svým.
  Když nefunguje, jet fallback z labu (A–B lokálně, C–D jako demo).
- **Knihovna `Runbooky` musí být v tenantu PŘED tímto blokem** — po přesunu bloku na
  odpoledne D1 se seeduje **nejpozději v polední pauze dne 1** (ručně dle scénáře, skript
  ještě není adaptovaný). Index není okamžitý: když dotazy 1–2 v části C nevrací obsah,
  zapsat do tabulky stropu „index latency" a ověření zopakovat ráno D2 (10 min) — je to
  zároveň test prerekvizity `knowledge-grounding`.
- Ověřit **aktuální verzi manifest schématu** a dostupné capabilities — sekce
  Capabilities ve výkladu se enumeruje proti schématu, ne z paměti. Mění se po měsících.
- Ověřit názvy šablon v Toolkitu (mění se) a scaffoldnout deklarativního agenta den předem.

## Tripwires

- **Studenti berou deklarativního agenta jako „slabší verzi".** Není — je to jiný nástroj.
  Část D má ukázat oboje: co zvládne za 15 minut (a custom engine za dva dny), a co
  nezvládne vůbec. Když blok sklouzne jen k „vidíte, custom engine je lepší", minul cíl.
- **Instructions ≠ system prompt.** Studenti si je spletou s vlastním system promptem
  (přijde v `prompt-orchestration`, D3). Tady model i orchestrace patří Copilotu —
  instructions jsou vstup do cizí pipeline, ne kontrola nad ní.
- Záměna s Copilot Studio agentem z dopoledního showcase — vrátit se k ose: jiná příčka,
  jiné ALM, jiná peněženka.
- Nezabíhat do hloubky konektorů — synced vs. federated přijde hned potom
  v [`../knowledge-grounding/`](../../day-3/knowledge-grounding/).
- Akce (API plugin) jen demo — hands-on akce s validací jsou v [`../actions-graph/`](../../day-4/actions-graph/)
  a jsou pointou custom engine cesty.

## Vazby

- Zpět: `no-code-showcase` (dopoledne — předchozí příčky osy), `agent-landscape` (osa).
- Dopředu: `agents-sdk-core` (ráno D2 — custom engine odpověď na strop),
  `knowledge-grounding` (D2 — kde knowledge bere data),
  `actions-graph` (akce s validací = co tu chybělo), `event-driven-hosting` +
  publikace (D4 — custom engine protějšek provisioningu), `capstone` (rozhodnutí
  deklarativní vs. custom engine patří do architektury).

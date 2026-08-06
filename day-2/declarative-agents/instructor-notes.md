# Instructor notes — Deklarativní agenti & Agents Toolkit

## Timing

- ~50 min výklad + 65 min lab. Opener dne 2 — studenti jsou čerství, lab je rychlý
  a vidí výsledek v M365 Copilotu; to je nejlepší energie na začátek dne.
- Část D labu (strop) je hodnotové jádro celého bloku. Nezkracovat na úkor částí A–C.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Re-verify: provisioning deklarativního agenta na PAYG bez Copilot licence.**
  Empiricky funguje (potvrzeno 2026-07-17 na jiném běhu), ale **Microsoft to takto
  nedokumentuje** — může se změnit bez oznámení. Otestovat studentským účtem, ne svým.
  Když nefunguje, jet fallback z labu (A–B lokálně, C–D jako demo).
- **Knihovna `Runbooky` musí být v tenantu PŘED tímto blokem** — provisioning skript
  pustit ráno, ne až v knowledge-grounding bloku, který následuje.
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
- Záměna s Copilot Studio agentem ze včerejšího showcase — vrátit se k ose: jiná příčka,
  jiné ALM, jiná peněženka.
- Nezabíhat do hloubky konektorů — synced vs. federated přijde hned potom
  v [`../knowledge-grounding/`](../knowledge-grounding/).
- Akce (API plugin) jen demo — hands-on akce s validací jsou v [`../actions-graph/`](../actions-graph/)
  a jsou pointou custom engine cesty.

## Vazby

- Zpět: `no-code-showcase` (D1 — předchozí příčky osy), `agent-landscape` (osa),
  `agents-sdk-core` (custom engine protějšek z D1).
- Dopředu: `knowledge-grounding` (kde knowledge bere data — hned potom),
  `actions-graph` (akce s validací = co tu chybělo), `event-driven-hosting` +
  publikace (D4 — custom engine protějšek provisioningu), `capstone` (rozhodnutí
  deklarativní vs. custom engine patří do architektury).

# Instructor notes — Manifest, deklarace schopností & kanály

## Timing

- ~60 min výklad + 75 min lab. Poslední blok nejhustšího dne — studenti jsou unavení,
  část B (deklarativní agent) je odlehčení, protože je rychlá a vidí výsledek.
- Část C (srovnání) je hodnotové jádro. Nezkracovat na úkor části B.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Re-verify: provisioning deklarativního agenta na PAYG bez Copilot licence.**
  Empiricky funguje (potvrzeno 2026-07-17 na jiném běhu), ale **Microsoft to takto
  nedokumentuje** — může se změnit bez oznámení. Otestovat studentským účtem, ne svým.
  Když nefunguje, jet fallback z labu (část B lokálně, běh jako demo).
- Ověřit **aktuální verzi manifest schématu** deklarativního agenta a dostupné schopnosti.
  Mění se po měsících.
- Ověřit názvy šablon v Toolkitu (mění se) a scaffoldnout deklarativního agenta den předem.
- Ověřit, jestli publikace do kanálu vyžaduje admin schválení a jak dlouho trvá —
  jestli to nestihne během bloku, jet jako demo z předpřipraveného stavu.

## Tripwires

- **Studenti berou deklarativního agenta jako „slabší verzi".** Není — je to jiný nástroj.
  Část C má ukázat oboje: co zvládne za 15 minut (a custom engine za dva dny), a co nezvládne
  vůbec. Když sklouzne jen k „vidíte, custom engine je lepší", blok minul cíl.
- **Manifest se rozejde s kódem.** Student přidá akci v kódu a nezadeklaruje ji.
  Explicitně v ověření. Nosná pointa: admin schvaluje manifest, ne kód.
- „Verze je jen číslo" — projít, co se stane nasazeným uživatelům a jak se dělá rollback.
  Naváže `perf-cost-lifecycle`.
- Studenti čekají, že jeden manifest = stejný zážitek všude. Kanály se liší (Adaptive Cards,
  přílohy, autentizace).
- Nezabíhat do Agent 365 registrace — to je [`../../day-4/agent-365-governance/`](../../day-4/agent-365-governance/).
  Tady je publikace, tam je governance.

## Vazby

- Zpět: `agent-landscape` (rozhodovací osa se tady poprvé ověřuje prakticky),
  `middleware-policy` (co deklarativní agent nemá), `actions-graph` (akce v manifestu),
  `knowledge-grounding` (knowledge deklarativně vs. kódem).
- Dopředu: `event-driven-hosting` (kde custom engine agent běží),
  `agent-365-governance` (co se s publikovaným agentem děje dál),
  `perf-cost-lifecycle` (promotion mezi prostředími, verzování, rollback),
  `capstone` (rozhodnutí deklarativní vs. custom engine patří do architektury).

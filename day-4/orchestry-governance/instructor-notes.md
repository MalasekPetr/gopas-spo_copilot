# Instructor notes — Orchestry (third-party governance)

## Timing

- ~35 min (25 výklad + 10 společná srovnávací tabulka). Závěr dne 4, hned po
  `agent-365-governance` — srovnání je čerstvé.
- Nenafukovat — blok je srovnávací rámec, ne kurz Orchestry.

## Go/no-go — otestovat před během

- **Ověřit aktuální rozsah agent governance u Orchestry** (vendor docs / release notes) —
  jediný blok kurzu, kde go/no-go zdroj není Microsoft. Srovnávací tabulku aktualizovat
  proti aktuálnímu stavu obou produktů.
- Pokud je k dispozici trial/demo tenant s Orchestry, projet den předem; jinak jet
  ze screenshotů nebo jen s tabulkou.
- Ověřit licenční model vendora (mění se) — neuvádět ceny z paměti.

## Tripwires

- **Vendor bias oběma směry.** Ani „third-party je zbytečnost, Microsoft to dožene",
  ani „Agent 365 je drahý, kupte Orchestry". Deliverable je rozhodovací rámec, ne verdikt.
- Studenti si spletou procesní governance (third-party vrstva) s identitou agentů
  (Entra Agent ID — first-party doména). Explicitně oddělit.
- Neopakovat Agent 365 výklad — byl minulý blok; tady jen srovnání.
- Kategorie „third-party governance nad M365" historicky končívá tím, že Microsoft
  funkcionalitu vstřebá — zmínit jako riziko, nepredikovat.

## Vazby

- Zpět: `agent-365-governance` (bezprostředně předchozí blok — baseline srovnání),
  `no-code-showcase` (D1 — auto-registrace Studio agentů; kam sahá first-party pohodlí).
- Dopředu: `capstone` (first-party vs. third-party rozhodnutí patří do architektury),
  `perf-cost-lifecycle` (D5 — licenční náklady governance vrstvy v nákladovém modelu).

# Instructor notes — Microsoft Agent Framework, workflows & multi-agent

## Timing

**35 min**, blok 1 — výklad + instruktorské C# demo. Lab je v samostudiu.
Deliverable bloku je **rozhodnutí triage/resolver ANO/NE s cenou** (latence, tokeny)
a jmenný přehled A2A vzorů. Obojí jde do capstonu jako rozhodnutí č. 3.

Framework je stejně demo (JS SDK neexistuje), takže škrt jde do výkladu, ne do praxe.

## Go/no-go

- **Přebuildovat `solution/` aktuálními balíčky.** Tohle je nejrychleji se měnící vrstva
  stacku; názvy typů se mění mezi verzemi. Ověřit proti Learn stránce „Use Semantic Kernel
  and Agent Framework in Agents SDK", ne proti blogpostu.
- Ověřit stav podpory **A2A** — mladé téma, formulace ve výkladu na tom závisí.
- Mít vlastní naměřené latence a tokeny pro srovnání jednoho vs. dvou agentů.

## Tripwires

- **„Multi-agent je pokročilejší, tedy lepší."** Nejčastější a nejškodlivější závěr.
  Ve většině zadání jeden dobře napsaný prompt stačí a multi-agent přidá latenci, tokeny,
  horší debug a horší auditovatelnost. Správná odpověď je obhajitelná **oběma směry** —
  ale musí být podložená čísly.
- Záměna **Agent Framework a Agents SDK.** Držet: SDK je obal (transport, stav, routing),
  Framework je orchestrace uvnitř. Na „tak co mám použít" odpověď zní: obojí.
- Záměna **workflow a Durable Functions.** Workflow = orchestrace uvnitř procesu,
  Durable = orchestrace s persistencí a hostingem.
- **A2A není tool call.** Protokol má důsledky pro identitu a audit — a to je přímý vstup
  do bloku 2.
- Studenti ze světa Semantic Kernelu čekají staré názvy. Vysvětlit lineage
  (SK + AutoGen → Agent Framework); tutoriály na internetu jsou většinou starší.

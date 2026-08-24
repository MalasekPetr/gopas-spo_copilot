# Instructor notes — Prompt & systémová orchestrace

## Timing

- ~50 min výklad + 60 min lab. **Opener dne 3** — protějšek deklarativních instructions
  z D1; kratší blok než zbytek dne, rozjede den bez tlaku.
- Část A (baseline) se studentům zdá jako zdržení. Netolerovat její vynechání: bez baseline
  je zbytek labu dojmologie a nefunguje ani návaznost na `evaluation-quality`.

## Go/no-go — otestovat před během

- **Ověřit lab proti aktuálnímu modelu na endpointu.** Chování promptu je vázané na model
  a jeho verzi; při výměně modelu se ověřovací kritéria mohou rozsypat. Projít celý lab
  den předem, ne jen část.
- Změřit orientační spotřebu tokenů jednoho průchodu labem a vynásobit počtem studentů ×
  počtem kol ladění. Tohle je nejdražší lab dne.
- Připravit zaznamenané odpovědi z vlastního běhu jako fallback.

## Tripwires

- **Studenti chtějí řešit bezpečnost promptem.** „Napíšu mu, ať to neprozrazuje." Část D labu
  to rozbije. Nosná věta kurzu: *prompt je doporučení pro model, ne vynucení.* Když si ji
  odnesou odsud, D5 jim sedne.
- Míchání **instrukcí a knowledge** — studenti nalepí obsah runbooků do systémového promptu.
  Ukázat, proč je to špatně: cena, aktuálnost, ACL, a že to není auditovatelné.
- Tool výsledky vlepené do systémové zprávy — funguje to a je to špatně. Vysvětlit rozdíl
  v tom, jak model s rolemi zachází.
- Few-shot jako univerzální lék: každý příklad je kontext a kontext jsou peníze
  (naváže `perf-cost-lifecycle`).
- Nezabíhat do multi-agent — řetězení promptů **není** orchestrace. To je
  [`../../day-3/agent-framework/`](../../day-3/agent-framework/).

## Vazby

- Zpět: knowledge (`knowledge-grounding`) a akce (`actions-graph`) — prompt je teď propojuje.
- Dopředu: `agent-framework` (kdy jeden prompt nestačí a je potřeba víc agentů),
  `middleware-policy` (zpevnění obrany z části D), `evaluation-quality` (baseline z části A
  se rozvine v golden set), `perf-cost-lifecycle` (kontext = tokeny = peníze;
  výměna modelu rozbíjí prompty).
- Kvalitativní nit: tady začíná — heuristika → golden set (D4) → KPI matice (capstone).

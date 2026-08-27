# Instructor notes — Microsoft Agent Framework, workflows & multi-agent

## Timing

**35 min**, blok 1 — **informativní, bez labu a bez dema** (rozhodnuto 2026-08-27).
Rozdělení zhruba 20 min Agent Framework a A2A, 15 min Foundry Agent Service.

Deliverable bloku jsou **dvě rozhodnutí do capstonu**: multi-agent ANO/NE s cenou,
a jestli agent patří do M365 (Agents SDK) nebo i mimo něj (Foundry Agent Service).

Proč bez dema: Framework je jen C#/Python a publikum píše v TypeScriptu. Ukazovat
kód, který nikdo nepoužije, je ztráta času — rozhodovací fakt stačí říct.

## Go/no-go

- **Ověřit názvosloví Foundry** — služba se přejmenovává rychle (Azure AI Studio →
  Azure AI Foundry → Microsoft Foundry). Blok je popisný, takže špatný název je jediná
  chyba, kterou v něm můžeš udělat.
- Ověřit rozsah publikace Foundry agentů do M365 Copilotu a Teams — je to nosná pointa
  rozdílu proti Agents SDK.
- Ověřit stav podpory **A2A** — mladé téma, formulace ve výkladu na tom závisí.
- Mít vlastní naměřené latence a tokeny pro srovnání jednoho vs. dvou agentů — bez dema
  je to jediné číslo, které v bloku zazní.

## Tripwires

- **Foundry Agent Service není „Agents SDK v cloudu".** Je to jiný provozovatel a jiná
  peněženka. Rozdíl není v tom, co agent umí, ale kdo ho provozuje.
- **Dva control plany.** Foundry Control Plane a Agent 365 se pletou; padne to i tady,
  ne jen v bloku 2.
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

# Instructor notes — No-code a low-code cesty (showcase)

## Timing

- ~50 min: 15 min agent builder demo, 15 min Copilot Studio demo, 20 min tabulka + diskuse.
- Nenafukovat. Blok je showcase, ne kurz Copilot Studia — hloubka by sežrala
  `agents-sdk-core`, který ten den nese první běžící kód.

## Go/no-go — otestovat před během

- **Licence**: agent builder vyžaduje M365 Copilot licenci; Copilot Studio vlastní
  licenci/trial. Ověřit, co v demo tenantu reálně je — jinak jet z nahrávky (fallback labu).
- Obě dema **naskriptovat a projet den předem** — UI obou nástrojů se mění po měsících.
- Studio agent na zadání ze scénáře postavit dopředu a mít ho v tenantu jako zálohu,
  kdyby živé klikání selhalo.
- Ověřit aktuální billing model Studia (messages / Copilot Credits) — čísla neříkat
  z hlavy, mění se.

## Tripwires

- **Sklouznutí do Studio-bashingu.** Publikum je pro-code a bude se pošklebovat. Pointa
  bloku je opačná: u části zadání je no-code/low-code správná odpověď a konzultant,
  který to neumí říct, prodává předražená řešení.
- **Sklouznutí do hloubky Studia** (topics, variables, DLP…). Ukázat, nekonfigurovat.
- Studenti si spletou Copilot Studio agenta s deklarativním agentem z Toolkitu — deklarativní
  cesta přijde až v [`../../day-2/declarative-agents/`](../../day-2/declarative-agents/),
  tady jen zaseknout kotvu „to je další příčka".
- Zmínit auto-registraci Studio agentů do Agent 365 **jen jako kotvu** — governance patří
  do [`../../day-4/agent-365-governance/`](../../day-4/agent-365-governance/).

## Vazby

- Zpět: `agent-landscape` (osa, kterou tenhle blok materializuje).
- Dopředu: `declarative-agents` (D2 — další příčka osy), `agents-sdk-core` (hned potom —
  proč vůbec psát kód), `agent-365-governance` (D4 — auto-registrace vs. instrumentace).

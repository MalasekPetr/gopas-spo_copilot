# Lab · Capstone blueprint a prezentace

> Modul: `capstone` · Odhad: **elastický 60–120 min** · Režim: **hands-on** (design dokument)
> Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Sestavit jednostránkový (max. dvoustránkový) blueprint Support Asistenta — nebo vlastního
zadání z praxe studenta — a obhájit ho před skupinou.

## Předpoklady

- Artefakty z celého týdne: agent, manifest, middleware, telemetrie, golden set s naměřenými
  hodnotami, rozhodnutí o hostingu, model hrozby, nákladová a lifecycle tabulka.
- **Vlastní zadání z praxe** je vítanou alternativou Support Asistenta — často je hodnotnější.

## Kroky

### Část A — architektura (20 min)

1. <!-- TODO: nakreslit vrstvy: kanaly, AgentApplication, middleware, orchestrace,
     knowledge, akce, hosting, identita, telemetrie -->
2. <!-- TODO: vyznacit hranice opravneni a kde tečou data -->

### Část B — rozhodnutí (25 min)

3. <!-- TODO: vyplnit checklist rozhodnuti, kazde JEDNOU vetou odůvodneni:
     cesta tvorby / vlastni retrieval / multi-agent / hosting / instrumentace /
     obranne vrstvy / nakladovy strop / prahy pro promotion -->
4. <!-- TODO: u KAZDEHO rozhodnuti napsat, co by ho zmenilo (jaka zmena zadani nebo prostredi) -->

### Část C — KPI a evaluační matice (20 min)

5. <!-- TODO: technicke metriky s prahy (z golden setu D4) -->
6. <!-- TODO: business KPI: vyresene bez cloveka, cas do odpovedi, naklad na dotaz -->
7. <!-- TODO: jak se KPI meri v provozu (telemetrie z D4) — ne "budeme to sledovat" -->

### Část D — rizika a rollback (15 min)

8. <!-- TODO: tri hlavni rizika s mitigaci; model hrozby z D5 -->
9. <!-- TODO: rollback plan a co je nevratne -->

### Část E — prezentace (dle času)

10. <!-- TODO: 5 min na osobu pred skupinou; jedna otazka od publika,
      jedna od instruktora (typicky "co by tohle rozhodnuti zmenilo") -->

### Část F — další kroky (10 min)

11. <!-- TODO: certifikacni cesta: AI-103 a AI-200 (NE retirovane AI-102/AZ-204) -->
12. <!-- TODO: kazdy student si zapise jednu vec, kterou udela do 14 dnu -->

## Ověření

- [ ] Architektura na jedné stránce, s vyznačenými hranicemi oprávnění.
- [ ] Checklist rozhodnutí vyplněný — každé s odůvodněním **a s tím, co by ho změnilo**.
- [ ] KPI matice obsahuje technické metriky **s prahy** i business KPI.
- [ ] U každého KPI je řečeno, **jak se měří** (ne „budeme sledovat").
- [ ] Tři rizika s mitigací a rollback plán rozlišující vratné/nevratné.
- [ ] Prezentováno (nebo pair-share při zkráceném režimu).
- [ ] Zapsaná jedna konkrétní věc do 14 dnů.

## Fallback

**Elastický blok 60–120 min.** Při zkrácení:

- Prezentace (část E) → **pair-share** ve dvojicích.
- Blueprint → jednostránkový místo dvoustránkového.
- **Jádro, které zůstává vždy**: části A (architektura), B (rozhodnutí s odůvodněním)
  a D (rollback plán). Bez těch tří capstone nemá hodnotu.
- Části C a F lze dokončit jako samostudium — zadání zůstává v repu.

## Zdroje (Microsoft)

- [Exam and assessment lab retirement](https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams)
- [Choose the right tool to build a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-tool-comparison)
- [Evaluation of generative AI applications](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-approach-gen-ai)

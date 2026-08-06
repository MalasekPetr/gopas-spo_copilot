# Lab · Snížit náklady bez ztráty kvality + promotion

> Modul: `perf-cost-lifecycle` · Odhad: **elastický 45–70 min** · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Snížit náklady Support Asistenta **a dokázat golden setem, že kvalita neklesla**. Pak
navrhnout promotion dev → test s rollback plánem.

## Předpoklady

- Agent z [`../security-risk/`](../security-risk/lab-injection-and-scope.md).
- **Golden set a naměřené hodnoty** z [`../../day-5/evaluation-quality/`](../../day-5/evaluation-quality/lab-golden-set.md)
  — bez nich nelze rozlišit optimalizaci od degradace.

## Kroky

### Část A — kde jsou peníze

1. <!-- TODO: rozlozit naklady jednoho turnu: systemovy prompt, historie, knowledge chunky,
     tool definice, tool vysledky, vystup. Zmerit realne tokeny, ne odhad. -->
2. <!-- TODO: pustit delsi konverzaci (8+ tahu) a zmerit, jak roste historie -->

### Část B — optimalizace

3. <!-- TODO: limit historie (posledních N tahů nebo sumarizace) -->
4. <!-- TODO: zuzit knowledge: méně kandidatu / kratsi chunky -->
5. <!-- TODO: zapnout prompt caching, pokud model podporuje -->
6. <!-- TODO: cache odpovedi — a POZOR: overit, ze cache nemíchá odpovedi mezi uzivateli
     s odlisnymi opravnenimi (nejcastejsi bezpecnostni chyba pri optimalizaci) -->

### Část C — důkaz, že to není degradace

7. <!-- TODO: pustit golden set z D4 znovu a porovnat pass rate a groundedness -->
8. <!-- TODO: zapsat tabulku: usetreno X % tokenu, kvalita +/- Y. Rozhodnuti: ponechat/vratit -->

### Část D — promotion a rollback

9. <!-- TODO: vypsat, co se meni mezi dev/test/prod: endpoint modelu, knowledge zdroje,
     opravneni, telemetrie, prahy. Konfigurace, ne branch. -->
10. <!-- TODO: navrhnout gate: golden set musi projit prahy pred promotion -->
11. <!-- TODO: rollback plan: co se da vratit (kod, manifest, prompt, model) a co NE
      (data, konverzace, zalozene tikety) -->

### Část E — výměna modelu

12. <!-- TODO: (pokud je k dispozici druhy model) prepnout model a pustit golden set.
      Zaznamenat, co se rozbilo. Zaver: golden set je predpoklad bezpecne vymeny. -->

## Ověření

- [ ] Naměřený rozklad nákladů jednoho turnu (ne odhad).
- [ ] Zavedený limit historie a zúžené knowledge, s naměřenou úsporou v %.
- [ ] Cache odpovědí **nemíchá** data mezi uživateli s odlišnými oprávněními — ověřeno.
- [ ] Golden set proběhl po optimalizaci; zapsané rozhodnutí ponechat/vrátit.
- [ ] Vypsané rozdíly dev/test/prod jako **konfigurace**.
- [ ] Rollback plán rozlišuje vratné a nevratné věci.

## Fallback

**Elastický blok.** Při zkrácení: části A, B3–B4 a C jsou jádro (měřím, optimalizuji,
dokazuji). Části D a E se probírají u tabule jako společný návrh — deliverable je pak
jednostránkový lifecycle plán, který jde přímo do capstonu.

Bez druhého modelu: část E jako diskuse nad instruktorskými daty.

## Zdroje (Microsoft)

- [Prompt caching — Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/prompt-caching)
- [Plan and manage costs for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/costs-plan-manage)
- [Model deprecations and retirements](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-retirements)

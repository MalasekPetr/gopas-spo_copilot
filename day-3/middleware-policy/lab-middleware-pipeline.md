# Lab · Middleware pipeline — guardrail, který se vykoná

> Modul: `middleware-policy` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Nahradit „obranu v promptu" **obranou v kódu** — a dokázat to pokusem o obejití, který
včera v [`../../day-2/prompt-orchestration/`](../../day-2/prompt-orchestration/lab-prompt-anatomy.md)
uspěl.

## Předpoklady

- Agent z [`../agent-framework/`](../agent-framework/lab-multi-agent-triage.md) (triage + resolver).
- Zapsaný výsledek části D z labu `prompt-orchestration` (jak obejití uspělo).

## Kroky

### Část A — pipeline

1. <!-- TODO: postavit middleware kolem turnu; overit, ze se vykona pro OBA agenty -->
2. <!-- TODO: pridat logovani vstupu/vystupu pipeline (bez PII!) — zaklad telemetrie pro D4 -->

### Část B — pre-processing

3. <!-- TODO: detekce a redakce PII ve vstupu pred odeslanim modelu -->
4. <!-- TODO: klasifikace mimo-scope dotazu a odmitnuti PRED volanim modelu
     (nejlevnejsi obrana — zmerit, kolik tokenu to usetri) -->

### Část C — post-processing

5. <!-- TODO: vynuceni citace: odpoved bez podkladu v runbooku se ZABLOKUJE, ne prepise -->
6. <!-- TODO: vystupni redakce pred odeslanim uzivateli -->
7. <!-- TODO: vynuceni formatu odpovedi -->

### Část D — pokus o obejití (klíčová část)

8. <!-- TODO: zopakovat pokus z D2 ("ignoruj predchozi instrukce...") a overit, ze
     middleware drzi, i kdyz prompt neudrzel -->
9. <!-- TODO: pustit ctyri testovaci dotazy; dotaz 4 musi byt odmitnut KODEM -->
10. <!-- TODO: napsat unit test nad pipeline BEZ volani modelu — vstup dovnitr, ocekavany
      verdikt venku. Vstup do evaluation-quality. -->

## Ověření

- [ ] Middleware se vykonává pro oba agenty (triage i resolver) — ověřeno logem.
- [ ] PII ve vstupu je redigované **před** odesláním modelu.
- [ ] Mimo-scope dotaz je odmítnut bez volání modelu; naměřená úspora tokenů.
- [ ] Odpověď bez podkladu v runbooku je **zablokovaná**, ne přepsaná.
- [ ] Pokus o obejití z D2 **neuspěje**.
- [ ] Existuje alespoň jeden unit test nad pipeline, který neběží proti modelu.
- [ ] Student umí říct, které obrany jsou vynucení a které jen naděje.

## Fallback

- Nestíhá se: části A, B a D jsou jádro (levná obrana + důkaz, že middleware drží).
  Část C (post-processing) se dodělá proti `solution/`.
- Model endpoint nedostupný: části A, B a D10 (unit test) jsou na modelu **nezávislé** —
  to je samo o sobě teaching point a lab zůstává plnohodnotný.

## Zdroje (Microsoft)

- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)
- [Content filtering — Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/content-filter)

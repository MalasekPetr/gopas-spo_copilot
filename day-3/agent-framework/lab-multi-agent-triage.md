# Lab · Triage + resolver — a co to stálo

> Modul: `agent-framework` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Rozdělit Support Asistenta na dva agenty s handoffem — a **změřit, co to přineslo a co stálo**.
Deliverable není „funguje to", ale rozhodnutí, jestli si to v produkci zaslouží.

## Předpoklady

- Agent z [`../../day-2/prompt-orchestration/`](../../day-2/prompt-orchestration/lab-prompt-anatomy.md)
  s knowledge, akcemi a systémovým promptem.
- Zapsaná baseline čtyř testovacích dotazů (latence + kvalita) z předchozích labů.

## Kroky

### Část A — baseline před rozdělením

1. <!-- TODO: zmerit latenci a pocet volani modelu na ctyrech testovacich dotazech
     u soucasneho JEDNOHO agenta. Zapsat. -->

### Část B — zapojit Agent Framework

2. <!-- TODO: pridat Agent Framework do projektu a overit, ze agent stale funguje jako drive -->
3. <!-- TODO: pojmenovat, co se zmenilo v architekture a co ne (SDK obal zustava) -->

### Část C — triage + resolver

4. <!-- TODO: triage agent: klasifikuje dotaz (znalostni / akcni / mimo scope) -->
5. <!-- TODO: resolver agent: odpovida z runbooku nebo eskaluje pres CreateTicket -->
6. <!-- TODO: handoff mezi nimi; limit iteraci; co kdyz triage klasifikuje spatne -->
7. <!-- TODO: pustit ctyri testovaci dotazy a porovnat s baseline z casti A -->

### Část D — cena rozdělení

8. <!-- TODO: zmerit latenci a pocet volani modelu znovu. Kolikrat vic? -->
9. <!-- TODO: rozbit jeden agent (napr. resolver hodi vyjimku) a overit, co uvidi uzivatel -->
10. <!-- TODO: rozhodnuti: zaslouzi si Support Asistent multi-agent? ANO/NE + duvod.
      Spravna odpoved neni predem dana — obhajitelne je oboji. -->

## Ověření

- [ ] Agent Framework zapojený, agent nadále odpovídá správně na čtyři testovací dotazy.
- [ ] Triage správně klasifikuje minimálně 3 ze 4 dotazů.
- [ ] Handoff funguje, loop se zastaví na limitu iterací.
- [ ] **Naměřený rozdíl** latence a počtu volání modelu proti baseline.
- [ ] Selhání jednoho agenta nevede k pádu ani k prázdné odpovědi uživateli.
- [ ] Zapsané rozhodnutí ANO/NE s jedním hlavním důvodem.

## Fallback

- Nestíhá se: části A, B a krok 8 (měření) stačí jako deliverable — student vidí zapojení
  Frameworku a cenu orchestrace. Část C se dodělá jako samostudium proti `solution/`.
- Nestabilní model endpoint: multi-agent je na něm nejcitlivější. Snížit počet dotazů
  ze čtyř na dva a měření provést jednou, ne opakovaně.

## Zdroje (Microsoft)

- [Use Semantic Kernel and Agent Framework in Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/using-semantic-kernel-agent-framework)
- [Microsoft 365 multi-agent workflow with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/microsoft-365-multi-agent-workflow-with-microsoft-agent-framework/4514164)

# Lab · První agent — AgentApplication, turn, LLM a chybová větev

> Modul: `agents-sdk-core` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Z echo agenta udělat agenta, který volá model — a který **korektně odpoví i když model
selže nebo vyprší timeout**. Konec labu = základ Support Asistenta, na kterém se staví
zbytek týdne.

## Předpoklady

- Hotový lab z [`../onboarding/`](../onboarding/lab-toolchain-scaffold.md) (scaffold běží v Playgroundu).
- **Model endpoint + klíč** v user secrets / `.env` — nikdy v trackovaném souboru.

## Kroky

### Část A — anatomie projektu

1. <!-- TODO: najit AgentApplication, registraci handleru, konfiguraci pres AgentApplicationOptions -->
2. <!-- TODO: pojmenovat, co je aktivita a co turn; ukazat, kde se turn zacina a konci -->

### Část B — stav

3. <!-- TODO: pridat citac zprav do TurnState (conversation scope) a overit ho v Playgroundu -->
4. <!-- TODO: rozmyslet, co do stavu NEpatri (tajemstvi, velka data, PII) -->

### Část C — volání modelu

5. <!-- TODO: zapojit model endpoint z konfigurace (ne natvrdo) -->
6. <!-- TODO: systemovy prompt Support Asistenta — minimalni verze, doladi se v prompt-orchestration -->
7. <!-- TODO: poslat ctyri testovaci dotazy ze scenare; zaznamenat, jak agent odpovida BEZ knowledge -->

### Část D — chybové větve (nepřeskakovat)

8. <!-- TODO: nastavit timeout na volani modelu a overit chovani -->
9. <!-- TODO: odebrat/rozbit klic a overit, ze agent odpovi uzivateli smysluplne, ne stack tracem -->
10. <!-- TODO: rozlisit transientni (throttling/timeout -> retry s backoff) vs permanentni
      (401/403/404 -> neretryovat, srozumitelna odpoved uzivateli) chybu -->

## Ověření

- [ ] Agent odpovídá v Agents Playground odpovědí z modelu.
- [ ] `TurnState` čítač funguje a přežije víc zpráv v jedné konverzaci.
- [ ] Klíč k modelu **není** v žádném trackovaném souboru.
- [ ] Při vypnutém/rozbitém endpointu agent vrátí **uživatelsky smysluplnou** odpověď,
      ne výjimku ani prázdnou zprávu.
- [ ] Timeout je nastavený explicitně, ne ponechaný na default.
- [ ] Student zaznamenal chování na čtyřech testovacích dotazech (baseline pro celý týden).

## Fallback

- **Model endpoint nerozhodnutý**: části A, B a D se dají odjet v echo režimu
  (chybová větev se testuje proti mocku). Část C se doplní na začátku dne 2.
- Playground nefunguje: instruktor promítne svůj běh; student pokračuje v editaci kódu
  (deliverable části A/B zůstává plnohodnotný).

## Zdroje (Microsoft)

- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)
- [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)

# Lab · Timeouty, idempotence a volba hostingu

> Modul: `event-driven-hosting` · Odhad: 70 min · Režim: **instruktorské demo + lokální část studentů**
> Jazyk: C# · Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Udělat Support Asistenta odolným — explicitní timeouty na všech třech úrovních a idempotentní
akce — a **rozhodnout, kam by se nasadil**, s odůvodněním.

## Předpoklady

- Agent z [`../../day-3/manifest-channels/`](../../day-3/manifest-channels/lab-manifest-and-publish.md).
- Studenti: nic navíc (lokální části). Instruktor: Azure subscription pro demo.

## Kroky

### Část A — demo hostingu (instruktor)

1. <!-- TODO: nasadit agenta na Azure Functions, ukazat cold start a jeho dopad na prvni odpoved -->
2. <!-- TODO: ukazat Durable orchestraci na dlouhe uloze (fan-out pres vic runbooku) -->
3. <!-- TODO: ukazat Foundry Agent Service jako hostovanou alternativu a publikaci do M365 Copilotu -->

### Část B — tři timeouty (studenti, lokálně)

4. <!-- TODO: nastavit timeout na volani modelu -->
5. <!-- TODO: nastavit timeout na volani nastroje (CreateTicket) — jina hodnota, jiny dopad -->
6. <!-- TODO: nastavit timeout na cely turn a overit, co uvidi uzivatel pri jeho vyprseni -->

### Část C — idempotence (studenti, lokálně)

7. <!-- TODO: zavolat CreateTicket dvakrat se stejnym vstupem — vzniknou dva tikety? -->
8. <!-- TODO: pridat idempotency key a overit, ze druhe volani nevytvori duplikat -->
9. <!-- TODO: overit chovani pri retry po timeoutu (nejcastejsi zdroj duplikatu v praxi) -->

### Část D — rozhodnutí o hostingu

10. <!-- TODO: vybrat hosting pro Support Asistenta a odůvodnit: provoz, naklady v necinnosti,
      dlouhe operace, kdo to spravuje, jak se to nasazuje. Vstup do capstonu. -->

## Ověření

- [ ] Všechny tři timeouty nastavené explicitně, s různými hodnotami a odůvodněním.
- [ ] Při vypršení timeoutu dostane uživatel smysluplnou odpověď, ne prázdno ani výjimku.
- [ ] `CreateTicket` je idempotentní — dvojí volání se stejným klíčem nevytvoří duplikát.
- [ ] Ověřeno chování retry po timeoutu (nevznikne duplikát).
- [ ] Zapsané rozhodnutí o hostingu s odůvodněním (min. tři kritéria).

## Fallback

- **Bez Azure subscription**: část A jako snímky obrazovky + zaznamenané časy cold startu
  z instruktorského běhu. Části B, C a D jsou na Azure **nezávislé** a nesou hlavní hodnotu —
  timeouty a idempotence se testují lokálně.
- Při skluzu: část A zkrátit na Functions + Foundry (Durable jen pojmenovat).

## Zdroje (Microsoft)

- [Durable Functions — overview](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview)
- [Azure Functions — overview](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)
- [Foundry Agent Service](https://azure.microsoft.com/en-us/products/ai-foundry/agent-service)

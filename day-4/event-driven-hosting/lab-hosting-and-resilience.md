# Lab · Timeouty, idempotence, hosting a publikace

> Modul: `event-driven-hosting` · Odhad: 95 min · Režim: **instruktorské demo + lokální část studentů**
> Jazyk: C# · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Udělat Support Asistenta odolným — explicitní timeouty na všech třech úrovních a idempotentní
akce — **rozhodnout, kam by se nasadil**, a hostovanou instanci **publikovat do kanálu**
s manifestem a verzí.

## Předpoklady

- Agent z [`../../day-3/middleware-policy/`](../../day-3/middleware-policy/lab-middleware-pipeline.md).
- Studenti: nic navíc (lokální části). Instruktor: Azure subscription pro demo
  a předpřipravený publikovaný stav pro část E.

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

### Část E — manifest, publikace a verzování

11. <!-- TODO: projit manifest projektu: identita, popis, schopnosti, ikony, opravneni;
      overit, ze manifest odpovida tomu, co agent SKUTECNE dela (akce z D2) -->
12. <!-- TODO: publikovat hostovaneho agenta do kanalu (Teams / M365 Copilot dle
      dostupnosti a admin schvaleni) -->
13. <!-- TODO: zvysit verzi a projit, co to znamena pro nasazene uzivatele a jak by se
      delal rollback -->

## Ověření

- [ ] Všechny tři timeouty nastavené explicitně, s různými hodnotami a odůvodněním.
- [ ] Při vypršení timeoutu dostane uživatel smysluplnou odpověď, ne prázdno ani výjimku.
- [ ] `CreateTicket` je idempotentní — dvojí volání se stejným klíčem nevytvoří duplikát.
- [ ] Ověřeno chování retry po timeoutu (nevznikne duplikát).
- [ ] Zapsané rozhodnutí o hostingu s odůvodněním (min. tři kritéria).
- [ ] Manifest je konzistentní s tím, co agent dělá (deklarované akce).
- [ ] Agent publikovaný do kanálu (nebo projitý z instruktorského dema); student popíše
  dopad zvýšení verze na nasazené uživatele a postup rollbacku.

## Fallback

- **Bez Azure subscription**: část A jako snímky obrazovky + zaznamenané časy cold startu
  z instruktorského běhu. Části B, C a D jsou na Azure **nezávislé** a nesou hlavní hodnotu —
  timeouty a idempotence se testují lokálně.
- **Publikace blokovaná admin schválením**: část E krok 12 jako instruktorské demo
  z předpřipraveného stavu; kroky 11 a 13 (manifest, verzování a rollback) jsou na
  schválení nezávislé.
- Při skluzu: část A zkrátit na Functions + Foundry (Durable jen pojmenovat); část E
  se nesmí vypustit celá — minimálně krok 11 (konzistence manifestu s kódem).

## Zdroje (Microsoft)

- [Durable Functions — overview](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview)
- [Azure Functions — overview](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)
- [Foundry Agent Service](https://azure.microsoft.com/en-us/products/ai-foundry/agent-service)

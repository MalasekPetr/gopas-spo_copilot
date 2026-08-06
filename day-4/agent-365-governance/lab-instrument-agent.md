# Lab · Instrumentace pro-code agenta do Agent 365

> Modul: `agent-365-governance` · Odhad: 70 min · Režim: **instruktorské demo + implementační část studentů**
> Jazyk: C# · Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Udělat ze Support Asistenta agenta, kterého **IT vidí**: s identitou, telemetrií a auditní
stopou. A vědět, co by chybělo, kdyby se instrumentace vynechala.

## Předpoklady

- Agent z [`../event-driven-hosting/`](../event-driven-hosting/lab-hosting-and-resilience.md).
- Logování z middleware pipeline (D3, část A) — je to vstup telemetrie.
- Studenti: nic navíc. Instruktor: Agent 365 licence + tenant pro demo.

## Kroky

### Část A — demo registry (instruktor)

1. <!-- TODO: ukazat Agent 365 registry: agenti z Copilot Studia (automaticky) vs pro-code -->
2. <!-- TODO: ukazat Entra Agent ID jednoho agenta: vlastnik, lifecycle, access review -->
3. <!-- TODO: ukazat observability: co IT o agentovi vidi a co ne -->

### Část B — telemetrie z middleware (studenti)

4. <!-- TODO: rozsirit logovani z D3 pipeline na strukturovanou telemetrii:
     kdo se ptal, jaky nastroj se volal, jaky byl verdikt middleware, jak dlouho to trvalo -->
5. <!-- TODO: KLICOVE — co do telemetrie NEpatri: obsah dotazu s PII, obsah odpovedi,
     tajemstvi. Rozliseni telemetrie vs audit. -->

### Část C — instrumentace (studenti)

6. <!-- TODO: zapojit Agent 365 SDK a zaregistrovat agenta (proti mocku, pokud neni licence) -->
7. <!-- TODO: poslat telemetrii z casti B a overit, ze dorazila (mock / demo tenant) -->
8. <!-- TODO: projit CLI: co se da zjistit o agentovi z prikazove radky -->

### Část D — protipříklad a argument

9. <!-- TODO: pojmenovat, co IT o agentovi NEVI, kdyz instrumentaci vynechas.
     Porovnat s Copilot Studio agentem, ktery se registruje sam. -->
10. <!-- TODO: napsat trivetnou argumentaci pro zakaznika: proc pro-code agent NENI
      "mimo governance", kdyz je instrumentovany. Vstup do capstonu. -->

## Ověření

- [ ] Strukturovaná telemetrie obsahuje volání nástroje, verdikt middleware a dobu zpracování.
- [ ] Telemetrie **neobsahuje** PII ani obsah odpovědí — student to umí odůvodnit.
- [ ] Agent je zaregistrovaný (demo tenant nebo mock) a telemetrie dorazila.
- [ ] Student umí z CLI zjistit základní údaje o agentovi.
- [ ] Vyplněný protipříklad z části D — konkrétně, co IT bez instrumentace neví.
- [ ] Napsaná třívětná argumentace pro zákazníka.

## Fallback

- **Bez Agent 365 licence** (pravděpodobný stav): části A a C7/C8 jsou demo ze snímků
  obrazovky instruktorského běhu. Části B, C6 (proti mocku), D jsou na licenci **nezávislé**
  a nesou hlavní hodnotu labu — telemetrie a argumentace.
- Agent 365 SDK API se změnilo: část C6 se odjede proti mocku podle `solution/`,
  s poznámkou o aktuální podobě API. Blok je z celého kurzu nejcitlivější na verze.

## Zdroje (Microsoft)

- [Microsoft Agent 365 SDK and CLI](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/)
- [Microsoft Agent 365 SDK — overview](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/agent-365-sdk)
- [What is Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)

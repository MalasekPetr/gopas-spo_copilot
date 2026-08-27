# Lab · Instrumentace pro-code agenta do Agent 365

> Modul: `agent-365-governance` · Odhad: 70 min · Režim: **instruktorské demo + implementační část studentů**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Udělat ze Support Asistenta agenta, kterého **IT vidí**: s identitou, telemetrií a auditní
stopou. A vědět, co by chybělo, kdyby se instrumentace vynechala.

## Předpoklady

- Agent z [`../event-driven-hosting/`](../event-driven-hosting/lab-hosting-and-resilience.md).
- Logování z middleware pipeline (D3, část A) — je to vstup telemetrie.
- Studenti: nic navíc. Instruktor: Agent 365 licence + tenant pro demo.

## Kroky

### Část A — demo registry (instruktor)

1. Otevři **Agent 365 registry** a projdi seznam agentů: ukaž agenta z Copilot Studia,
   který se zaregistroval **sám** (nikdo o to nežádal), a vedle něj pro-code agenta, který
   je v registry jen proto, že ho někdo instrumentoval. Nech studenty vyslovit, co by
   v registry chybělo, kdyby ten druhý krok nikdo neudělal.
2. Otevři **Entra Agent ID** jednoho agenta: vlastník, kdy vznikl, přiřazená oprávnění,
   lifecycle stav, access review. Vedle toho ukaž obyčejnou app registraci ve stejném
   tenantu a nech skupinu pojmenovat rozdíl — je to governance jednotka vs. řádek v seznamu
   aplikací.
3. Ukaž **observability**: jakou aktivitu agenta IT vidí (volání, chybovost, trend v čase)
   a explicitně ukaž, že **obsah konverzací tam není**. To je přímá odpověď na námitku
   „Agent 365 čte našim lidem chaty".

### Část B — telemetrie z middleware (studenti)

4. Rozšiř logování z D3 pipeline na **strukturovanou telemetrii**: jedna typovaná událost
   na turn s poli — identifikátor uživatele (ID, ne jméno v textu), ID konverzace a turnu,
   který agent zpracovával (triage / resolver), volaný nástroj a jeho výsledek, verdikt
   middleware, doba zpracování, klasifikace chyby. Vypisuj ji jako **JSON**, ne jako větu
   do konzole — telemetrii čte stroj.
5. Projdi svou událost pole po poli a **vyhoď z ní všechno, co je obsah**: text dotazu,
   text odpovědi, výňatky z runbooků, jméno z testovacího dotazu 4, tokeny a klíče.
   Nahraď je odkazy a klasifikacemi (ID dokumentu místo úryvku, `refused: out-of-scope`
   místo citace dotazu). Napiš k tomu dvě věty: co z toho je **telemetrie** (tvoje, krátká
   retence) a co patří do **auditu** (compliance, jiné úložiště, delší retence).

### Část C — instrumentace (studenti)

6. Zapoj **Agent 365 SDK** a zaregistruj agenta: jméno, popis, vlastník, prostředí, verze,
   deklarované schopnosti. Bez licence to odjeď proti mocku podle `solution/` — mock přijímá
   stejný tvar volání, takže kód zůstane ten, který by šel do ostrého tenantu. **Balíček
   a tvar API ověř proti aktuální dokumentaci**; tenhle povrch se mění nejrychleji
   z celého kurzu.
7. Pošli události z části B a ověř, že **dorazily**: v mocku zkontroluj přijatý payload,
   na demo tenantu ukáže instruktor tentýž záznam v observability. Ověř zvlášť, že dorazila
   i událost **odmítnutí** (dotaz 4) — governance zajímají hlavně odmítnutí a chyby, ne
   úspěšné odpovědi.
8. Projdi **Agent 365 CLI**: co se dá o agentovi zjistit z příkazové řádky (výpis agentů,
   detail, vlastník, stav) a co z toho by dávalo smysl zapojit do CI/CD — typicky registraci
   nové verze jako krok pipeline. Konkrétní příkazy ověř podle nápovědy CLI, ne z paměti —
   povrch Agent 365 CLI je mladý a mění se mezi verzemi.

### Část D — protipříklad a argument

9. Napiš **protipříklad**: vyjmenuj konkrétně, co IT o Support Asistentovi **neví**, když
   instrumentaci vynecháš — že vůbec existuje, kdo ho vlastní, co smí, kolik toho dělá,
   kdy selhává, kdy něco odmítl, koho se zeptat při incidentu. Postav to vedle Copilot
   Studio agenta z části A a pojmenuj, že rozdíl není ve schopnosti platformy, ale
   v **práci, kterou někdo musel udělat**.
10. Napiš **třívětnou argumentaci pro zákazníka**: (1) instrumentovaný pro-code agent je
    v témže registry, se stejnou identitou a se stejnou viditelností jako low-code;
    (2) navíc má, co low-code nemá — vlastní middleware, vlastní testy, source control
    a vlastní telemetrii; (3) neinstrumentovaný pro-code agent si tu kritiku ale zaslouží,
    a proto instrumentace patří do definice hotového. Vezmi ty tři věty beze změny
    do capstonu.

## Ověření

- [ ] Strukturovaná telemetrie obsahuje volání nástroje, verdikt middleware a dobu zpracování.
- [ ] Telemetrie **neobsahuje** PII ani obsah odpovědí — student to umí odůvodnit.
- [ ] Agent je zaregistrovaný (demo tenant nebo mock) a telemetrie dorazila.
- [ ] Student umí z CLI zjistit základní údaje o agentovi.
- [ ] Vyplněný protipříklad z části D — konkrétně, co IT bez instrumentace neví.
- [ ] Napsaná třívětná argumentace pro zákazníka.

## Fallback

- **Bez Agent 365 licence** (záloha — lektorská licence je zajištěna): části A a C7/C8 jsou demo ze snímků
  obrazovky instruktorského běhu. Části B, C6 (proti mocku), D jsou na licenci **nezávislé**
  a nesou hlavní hodnotu labu — telemetrie a argumentace.
- Agent 365 SDK API se změnilo: část C6 se odjede proti mocku podle `solution/`,
  s poznámkou o aktuální podobě API. Blok je z celého kurzu nejcitlivější na verze.

## Zdroje (Microsoft)

- [Microsoft Agent 365 SDK and CLI](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/)
- [Microsoft Agent 365 SDK — overview](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/agent-365-sdk)
- [What is Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)

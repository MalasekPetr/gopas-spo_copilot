# Lab · Capstone blueprint a prezentace

> Modul: `capstone` · Odhad: **elastický 75–135 min** · Režim: **hands-on** (design dokument)
> Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Sestavit jednostránkový (max. dvoustránkový) blueprint Support Asistenta — nebo vlastního
zadání z praxe studenta — a obhájit ho před skupinou.

## Předpoklady

- Artefakty z celého týdne: agent, manifest, middleware, telemetrie, golden set s naměřenými
  hodnotami, rozhodnutí o hostingu, model hrozby, nákladová a lifecycle tabulka.
- **Vlastní zadání z praxe** je vítanou alternativou Support Asistenta — často je hodnotnější.
- **Kalkulačka nákladů a návratnosti** — otevřená ve druhém okně, používá se v části D.
  Otevři si ji **z klonu repa**: [`../../perf-cost-lifecycle/roi-calculator.html`](../perf-cost-lifecycle/roi-calculator.html)
  (dvojklik, funguje offline). Publikovaná verze: [odkaz](https://claude.ai/code/artifact/4f481142-dcf1-47e4-9590-844063a94314).

## Kroky

### Část A — architektura (25 min)

1. Nakresli architekturu **na jednu stránku**, po vrstvách: kanály (Teams / M365 Copilot) →
   `AgentApplication` → middleware pipeline → orchestrace (triage + resolver) → knowledge
   (`Runbooky`) a akce (`CreateTicket`, Graph) → model endpoint; vedle toho hosting,
   identita (Entra Agent ID) a telemetrie (Agent 365). Referenční diagram z README použij
   jako kostru, ale **nakresli svou variantu** — místa, kde se liší, jsou tvoje rozhodnutí.
2. Vyznač do diagramu **hranice oprávnění a tok dat**: kde končí delegated identita
   uživatele, kudy odcházejí data mimo tenant (volání modelu!), co se loguje a kam, a kde
   stojí obranné vrstvy. Označ **každý přechod hranice** — u zákazníka je to první otázka
   security týmu a rozhoduje o tom, jestli projekt vůbec začne.
3. **Vyznač v diagramu, které kroky model nepotřebují.** Projdi cestu dotazu krok po kroku
   a u každého odpověz: dělá to model, nebo kód? Kde je to kód, napiš čím (API, parser,
   výpočet, whitelist). Postup i kritéria:
   [`../../actions-graph/explainer-deterministic-first.md`](../actions-graph/explainer-deterministic-first.md).
   Blueprint, ve kterém model dělá všechno, je nejdražší a nejhůř obhajitelná varianta —
   a je to nejčastější podoba prvního návrhu.

### Část B — rozhodnutí (25 min)

4. Vyplň **checklist osmi rozhodnutí** z README: cesta tvorby, vlastní retrieval,
   multi-agent, hosting, instrumentace do Agent 365, obranné vrstvy, nákladový strop, prahy
   pro promotion. Ke každému **jedna věta odůvodnění** — ne odstavec. Kde jsi rozhodnutí
   v labech reálně nedělal, rozhodni teď a přiznej, že je to volba na zelené louce.
5. Ke **každému** rozhodnutí připiš, **co by ho změnilo**: jaká změna zadání, objemu,
   rozpočtu, regulace nebo dostupnosti produktu. Například: „hosting bych přehodnotil
   na Foundry Agent Service, kdyby agentů bylo pět a nikdo je nechtěl provozovat."
   Tohle je otázka, kterou dostaneš při prezentaci.

### Část C — KPI a evaluační matice (20 min)

6. Vyplň **technické metriky s prahy** z golden setu (`evaluation-quality`): pass rate,
   groundedness, správnost volby nástroje, latence p95, tokeny na dotaz. Používej
   **naměřené hodnoty**, ne odhady — máš je z předchozího bloku. Ke každému prahu napiš,
   co se stane, když ho verze nesplní.
7. Doplň **business KPI**: podíl dotazů vyřešených bez člověka, čas do odpovědi proti
   dnešnímu stavu supportu, náklad na vyřešený dotaz, objem eskalací. Ke každému uveď
   cílovou hodnotu **a výchozí stav** — KPI bez baseline se nedá vyhodnotit.
8. Ke každému KPI napiš, **jak a odkud se měří**: které pole telemetrie z D4, který
   evaluační běh, která statistika helpdesku, jak často a kdo se na to dívá. Věta „budeme
   to sledovat" se v capstonu nepočítá.

### Část D — náklady a návratnost (15 min)

Blueprint bez čísla za provoz je zbožné přání. Tady mu ho dáš — a co je důležitější,
dáš mu **měření pod tím**, ne odhad.

9. Otevři [**kalkulačku nákladů a návratnosti**](https://claude.ai/code/artifact/4f481142-dcf1-47e4-9590-844063a94314) a přepiš do ní parametry
   svého zadání: počet uživatelů, dotazů na uživatele a den, model. Výchozí hodnoty
   tokenů jsou naměřené na Support Asistentovi v tomto kurzu — máš-li vlastní čísla
   z golden setu, použij je.

   **Checkpoint:** vidíš cenu za turn, měsíc a rok. Zapiš ji do blueprintu jako
   **provozní náklad s datem měření a verzí ceníku**, ne jako „cca".

10. Dopočítej návratnost: podíl dotazů vyřešených bez člověka, minuty na tiket,
    interní hodinová sazba, jednorázový vývoj v člověkodnech.

    **Checkpoint:** kalkulačka ukazuje čistý přínos za měsíc a návratnost vývoje.
    Přečti si řádek s úvazkem — **kolik FTE ta úspora reálně je**. Když vyjde 0,2,
    neprodávej to jako ušetřeného člověka, ale jako kratší frontu.

11. Napiš do blueprintu **jednu větu obhajoby modelu** ve tvaru: *„model X při
    `reasoning_effort` Y, protože bez něj selhává třída případů Z."*

    **Checkpoint:** ta věta jmenuje konkrétní třídu případů z tvého golden setu.
    „Použili jsme reasoning model, protože je to agent" se nepočítá.

### Část E — rizika a rollback (15 min)

12. Vyber **tři hlavní rizika** a ke každému napiš dopad, mitigaci a **jak poznáš, že
   nastalo**. Vycházej z modelu hrozby z D3 (`middleware-policy`): XPIA přes obsah
   runbooku, exfiltrace přes příliš široký scope nebo app-only oprávnění, odpověď bez
   podkladu s citací, duplicitní akce po retry, náklady mimo strop.
13. Napiš **rollback plán**: co se vrací (verze manifestu, build endpointu, systémový prompt,
   konfigurace prahů), v jakém pořadí a jak dlouho to trvá. Zvlášť vypiš, co je
   **nevratné** — založené tikety, odeslané zprávy uživatelům, zápisy do cizích systémů,
   obsah, který se dostal ven. U nevratných věcí platí prevence, ne rollback.

### Část F — prezentace (dle času)

14. Odprezentuj blueprint před skupinou — **5 minut na osobu**, v pořadí: architektura,
    tři nejdůležitější rozhodnutí, KPI s prahy, největší riziko a rollback. Pak **jedna
    otázka od publika a jedna od instruktora** (typicky „co by tohle rozhodnutí změnilo?").
    Při zkráceném režimu totéž ve dvojicích (pair-share) — formát otázek zůstává.

### Část G — další kroky (10 min)

15. Zapiš si certifikační cestu: **AI-103** (Azure AI Apps and Agents Developer Associate)
    a **AI-200** (Azure AI Cloud Developer Associate) — **ne** retirované AI-102 a AZ-204.
    Projděte s instruktorem aktuální **Certification Poster (PDF)**, navazující větve
    (AI-500, GH-600, AB-900) a ověřte jejich stav k dnešnímu datu; odkaz na poster si
    odnes s sebou.
16. Napiš si **jednu konkrétní věc, kterou uděláš do 14 dnů**, s datem: „pustím golden set
    nad naším agentem", „sepíšu hranice oprávnění našeho bota", „přihlásím se na AI-103".
    Jednu věc, ne seznam — seznam se nedělá.

## Ověření

- [ ] Architektura na jedné stránce, s vyznačenými hranicemi oprávnění.
- [ ] V diagramu je vidět, **které kroky model nepotřebují** a čím jsou nahrazené.
- [ ] Checklist rozhodnutí vyplněný — každé s odůvodněním **a s tím, co by ho změnilo**.
- [ ] KPI matice obsahuje technické metriky **s prahy** i business KPI.
- [ ] U každého KPI je řečeno, **jak se měří** (ne „budeme sledovat").
- [ ] Blueprint obsahuje **provozní náklad za měsíc** s datem měření a verzí ceníku.
- [ ] Návratnost je přepočtená na **úvazky**, ne jen na koruny.
- [ ] Volba modelu a `reasoning_effort` je obhájená **třídou případů**, ne obecnou větou.
- [ ] Tři rizika s mitigací a rollback plán rozlišující vratné/nevratné.
- [ ] Prezentováno (nebo pair-share při zkráceném režimu).
- [ ] Zapsaná jedna konkrétní věc do 14 dnů.

## Fallback

**Elastický blok 60–120 min.** Při zkrácení:

- Prezentace (část F) → **pair-share** ve dvojicích.
- Blueprint → jednostránkový místo dvoustránkového.
- **Jádro, které zůstává vždy**: části A (architektura), B (rozhodnutí s odůvodněním)
  a D (rollback plán). Bez těch tří capstone nemá hodnotu.
- Části C a F lze dokončit jako samostudium — zadání zůstává v repu.

## Zdroje (Microsoft)

- [Exam and assessment lab retirement](https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams)
- [Choose the right tool to build a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-tool-comparison)
- [Evaluation of generative AI applications](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-approach-gen-ai)

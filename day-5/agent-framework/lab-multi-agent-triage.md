# Lab · Triage + resolver — a co to stálo

> Modul: `agent-framework` · Odhad: 75 min · Režim: **SAMOSTUDIUM** — v běhu se nejede
> Jazyk: TypeScript (orchestrace ručně nad Agents SDK; Agent Framework = instruktorské
> demo v C# — JS SDK neexistuje) · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Rozdělit Support Asistenta na dva agenty s handoffem — a **změřit, co to přineslo a co stálo**.
Deliverable není „funguje to", ale rozhodnutí, jestli si to v produkci zaslouží.

## Předpoklady

- Agent z [`../../prompt-orchestration/`](../../day-4/prompt-orchestration/lab-prompt-anatomy.md)
  s knowledge, akcemi a systémovým promptem.
- Zapsaná baseline čtyř testovacích dotazů (latence + kvalita) z předchozích labů.

## Kroky

### Část A — baseline před rozdělením

1. Pusť **na současném jednom agentovi** všechny čtyři testovací dotazy ze scénáře.
   U každého zapiš do tabulky: **celkovou latenci turnu**, **počet volání modelu** a
   **počet volání nástrojů**. Každý dotaz pusť dvakrát a zapiš druhý běh — první bývá
   zkreslený studeným startem. Bez téhle tabulky nemá část D co porovnávat.

### Část B — Agent Framework demo (instruktor, C#) a návrh TS orchestrace

2. Sleduj instruktorské demo: **tatáž úloha (triage + resolver) postavená v Agent
   Frameworku v C#**. Zapisuj si jedinou věc — **co Framework řeší za tebe**. Minimálně:
   definice agenta a jeho nástrojů, předání řízení (handoff), sdílený stav mezi kroky,
   retry a zastavovací podmínka, telemetrie průchodu. Seznam budeš potřebovat v kroku 11.
3. **Navrhni si orchestraci na papíře, než napíšeš první řádek TypeScriptu.** Rozhodni:
   - rozhraní obou agentů — co dostanou na vstupu a co vrací (`classify`, `resolve`);
   - **kontrakt handoffu**: typovaný výsledek klasifikace, **ne volný text** — např.
     `{ kind: "knowledge" | "action" | "out-of-scope"; confidence: number; reason: string }`;
   - **limit kol** a co se stane, když se vyčerpá;
   - kudy prochází `AbortSignal` (musí projít oběma agenty i voláním nástroje).

   `AgentApplication` z Agents SDK **zůstává obal** — orchestrace žije uvnitř handleru
   turnu, nenahrazuje ho.

### Část C — triage + resolver

4. Implementuj **triage agenta**: na vstupu dotaz uživatele, na výstupu typovaný verdikt
   (`knowledge` / `action` / `out-of-scope`). Drž ho **levný a krátký** — vlastní systémový
   prompt jen o klasifikaci, žádné nástroje, žádné runbooky. Vynuť strukturovaný výstup
   a **ošetři případ, kdy model vrátí něco jiného** než očekávané hodnoty: fallback verdikt,
   ne výjimka.
5. Implementuj **resolver agenta**: podle verdiktu buď odpoví z runbooků **s citací**, nebo
   eskaluje přes `CreateTicket` z [`../../actions-graph/`](../../day-4/actions-graph/).
   Ponech mu systémový prompt z `prompt-orchestration` — resolver je v podstatě tvůj
   dosavadní agent zbavený klasifikace.
6. Zapoj **handoff**: verdikt triage vstupuje do resolveru **jako typovaná hodnota, ne jako
   text v promptu**. Nastav **limit kol** (2–3 stačí) a ošetři tři situace:
   - triage klasifikuje **mimo scope** → resolver se vůbec nevolá (levné odmítnutí);
   - triage klasifikuje **špatně** (akční dotaz jako znalostní) → resolver musí umět říct
     „na tohle nemám podklad" a vrátit řízení, ne halucinovat;
   - **limit kol se vyčerpá** → uživatel dostane srozumitelnou odpověď, ne timeout.
7. Pusť **stejné čtyři testovací dotazy** jako v části A. U každého zapiš: verdikt triage,
   zvolenou cestu (runbook / eskalace / odmítnutí) a jestli je odpověď **lepší, stejná,
   nebo horší** než v baseline.

### Část D — cena rozdělení

8. Změř znovu latenci, počet volání modelu a počet volání nástrojů. Spočítej **násobek**
   proti baseline z kroku 1 — zvlášť u dotazu, který skončí odmítnutím (dotaz 4), a zvlášť
   u toho, který projde celou cestou (dotaz 3). Rozdíl mezi nimi pojmenuj: levná triage
   může mimo-scope dotaz **zlevnit**, zatímco akční cestu **prodraží**.
9. **Rozbij jeden agent**: nech resolver vyhodit výjimku (nebo mu odpoj model endpoint) a
   ověř, co uvidí uživatel. Prázdná odpověď, stack trace ani ticho **nejsou přijatelný
   výsledek**. Doplň fallback větev a zopakuj.
10. Zapiš **rozhodnutí: zaslouží si Support Asistent multi-agent? ANO/NE** a jeden hlavní
    důvod opřený o **naměřená čísla z kroku 8**, ne o dojem. Správná odpověď není předem
    daná — obhajitelné je obojí. Formuluj to jako větu, kterou řekneš zákazníkovi.
11. **Reflexe proti demu z části B**: projdi seznam z kroku 2 a u každé položky označ,
    kolik tvého TS kódu by Agent Framework nahradil. Pak napiš druhou stranu účtu — co ta
    úspora stojí: přechod na **C#/Python stack**, závislost navíc na nejrychleji se měnící
    vrstvě stacku a tým, který musí umět obojí. Je to konkrétní případ rozhodovací osy z D1:
    **volba jazyka zúžila dostupný stack.**

## Ověření

- [ ] TS orchestrace (triage → resolver) zapojená, agent nadále odpovídá správně na čtyři
  testovací dotazy.
- [ ] Triage správně klasifikuje minimálně 3 ze 4 dotazů.
- [ ] Handoff funguje, loop se zastaví na limitu kol.
- [ ] **Naměřený rozdíl** latence a počtu volání modelu proti baseline.
- [ ] Selhání jednoho agenta nevede k pádu ani k prázdné odpovědi uživateli.
- [ ] Zapsané rozhodnutí ANO/NE s jedním hlavním důvodem.

## Fallback

- Nestíhá se: části A, B a krok 8 (měření) stačí jako deliverable — student vidí Framework
  demo a cenu orchestrace. Část C se dodělá jako samostudium proti `solution/`.
- Nestabilní model endpoint: multi-agent je na něm nejcitlivější. Snížit počet dotazů
  ze čtyř na dva a měření provést jednou, ne opakovaně.

## Zdroje (Microsoft)

- [Use Semantic Kernel and Agent Framework in Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/using-semantic-kernel-agent-framework)
- [Microsoft 365 multi-agent workflow with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/microsoft-365-multi-agent-workflow-with-microsoft-agent-framework/4514164)

# SPO_COPILOT — obsah pre web (gopas.sk)

> [!NOTE] Pre editora
> Každý nadpis „##" nižšie zodpovedá jednému poľu na stránke kurzu; text pod ním vlož do daného
> poľa. Bloky „Pre editora" samotné nie sú obsah stránky — nekopírovať na web.
>
> **Aktualizované po prvom behu (týždeň 2026-08-24).** Osnova nižšie zodpovedá tomu, čo sa
> skutočne odučilo, nie pôvodnému plánu.

## Delta — čo sa mení proti aktuálne živej stránke a prečo

> [!NOTE] Pre editora
> Táto sekcia **nie je** obsah stránky. Je to odôvodnenie zmien pre schvaľovacie kolečko.

### Vecné chyby, ktoré treba opraviť

| Aktuálne na webe | Novo | Dôvod |
| --- | --- | --- |
| Úroveň **„Mierne pokročilý"** | **Pokročilý** | Účastníci piaty deň píšu middleware pipeline, validujú zápisy do SharePointu cez Graph a obhajujú nákladový model. Mierne pokročilý účastník kurz neutiahne a odíde sklamaný. |
| Predpoklady začínajú **C#** | **TypeScript primárne**, C# len ako výhoda | Celý týždeň sa píše v TypeScripte. C# sa objaví len v zmienke o Agent Frameworku. Poradie na stránke odrádza správne publikum a láka nesprávne. |
| „Další kroky: **AI-102, AZ-204**" | **AI-103, AI-200** | Obe skúšky sú retirované: AI-102 k 2026-06-30, AZ-204 k 2026-07-31. |

### Obsahové zmeny

| Aktuálne na webe | Novo | Dôvod |
| --- | --- | --- |
| „**Graph** konektory & obohatenie metadátami" | „**Copilot connectors** — synced a federated (MCP)" | Microsoft produkt premenoval a rozdelil na dva typy s odlišnou architektúrou. |
| „Kanály a adaptéry **Azure Bot Service**" | „Kanály, aktivity a turny v Agents SDK" | Rola Bot Service sa zúžila na registráciu kanála. |
| „**Vektorizácia & RAG design**" ako povinný blok (2,5 h) | sprievodný materiál + **meraný blok o retrievali** na D5 | Retrieval nad tenantom robí semantic index. Kurz namiesto teórie vektorizácie ukazuje **namerané porovnanie troch vyhľadávacích API** a rozhodnutie, kedy si retrieval stavať sám. |
| „Sanitizácia výstupov a **watermarking**" | „**Prompt injection / XPIA**, prevencia exfiltrácie" | Watermarking textových odpovedí nemá robustný obranný prínos; injection cez obsah je reálny model hrozby. |
| „**Responsible AI & governance**" ako samostatný blok (2,5 h) | rozpustené do **Bezpečnosť & middleware** + **Agent 365** | V pro-code kurze je guardrail kód v pipeline, nie samostatná prednáška. |
| „Bezpečnosť" a „Middleware" ako dva bloky | **jeden blok „útok a obrana ako kód"** | Oba učili to isté z opačných strán. Spojené to má dramaturgiu útok → prečo prompt nedrží → middleware → scope. |
| „Udalosťami riadená orchestrácia", „Nasadenie & riadenie životného cyklu" ako bloky | **sprievodný materiál** | Vyžadovalo by Azure subscription pre každého účastníka. Podstata („kde beží endpoint vs. orchestrácia") je zložená do bloku o Agent 365. |
| — (chýba) | **Skills — rozšírenie Copilot in SharePoint** | Najnižšia priečka rozširovania Copilota: `SKILL.md`, žiadny runtime, riadi sa právami na súboroch. Publikum kurzu spravuje SharePoint obsah. |
| — (chýba) | **SharePoint agenti** ako plnohodnotná cesta | Agent vzniknutý jedným klikom nad knižnicou je pre toto publikum najbližší vstup — vrátane jeho stropu. |
| — (chýba) | **no-code/low-code showcase a deklaratívne maximum** pred pro-code | Vývojár najprv naživo posúdi Agent Builder a Copilot Studio a vyčerpá deklaratívnu cestu — až tam, kde končí, siaha k SDK. |
| — (chýba) | **dátová hygiena SharePoint Online a Exchange Online** | Agent oprávnenia neprelamuje, ale zviditeľňuje. Prax kladie túto otázku pred grounding. |
| — (chýba) | **identita aplikácií** — app registrácie, permissions, single/multi-tenant, tokeny | V prvom behu si to skupina vyžiadala ako samostatný výklad. Bez toho nemožno obhájiť hranicu oprávnení agenta. |
| — (chýba) | **Microsoft Agent Framework**, A2A a **Foundry Agent Service** | Vrstva orchestrácie nad Agents SDK a PaaS vetva mapy ciest. |
| — (chýba) | **SharePoint Copilot Apps** (SPFx, Public Preview) — *voliteľný blok* | Najkratší most medzi SPFx zručnosťami a svetom agentov. |
| — (chýba) | **distribúcia cez Microsoft Marketplace** vr. case study | Podmienky publikácie, Partner Center, proces validácie — na skutočnom publikovanom listingu, nie na slide. |
| — (chýba) | **Agent 365, Entra Agent ID, inštrumentácia pro-code agenta** | GA 2026-05-01. Low-code agenti sa registrujú automaticky, pro-code sa musia inštrumentovať. |
| — (chýba) | **nameraný nákladový model a ROI** | Účastník odchádza s vlastnými číslami z týždňa, nie s odhadom. |

Štruktúra sa mení z 15 modulov po 2,5 h na **denné bloky rôznej dĺžky** (3–6 denne) plus
sprievodný materiál na samoštúdium. Rozsah zostáva 5 dní.

## URL

`microsoft-365-agents-sdk-copilot-extensions-a-agent-365_spo_copilot`

> [!NOTE] Pre editora
> Nový slug. Nastaviť **301 redirect** zo súčasného
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Titulok kurzu

Microsoft 365 Agents SDK, Copilot Extensions a Agent 365

## Krátky popis (meta description / teaser)

Pro-code kurz stavby, zabezpečenia a prevádzky agentov v blízkom okolí Microsoft 365. Celý
týždeň sa buduje jeden agent — od rozhodnutia, ktorou cestou vôbec ísť, cez grounding nad
firemným obsahom a akcie nad Microsoft Graphom až po middleware, inštrumentáciu do
Agent 365, evaluáciu a nákladový model podložený vlastným meraním.

## Popis kurzu

Päťdňový pro-code kurz pre vývojárov a architektov, ktorí stavajú agentov v blízkom okolí
Microsoft 365. **Celý týždeň sa buduje jeden agent** — Support Asistent nad firemnými
runbookmi — a každý deň mu pribudne jedna vrstva.

Kurz začína tam, kde začína reálny projekt: **rozhodnutím, ktorou cestou ísť**. Účastníci
naživo posúdia Skills, SharePoint agentov, Copilot agent builder a Copilot Studio, postavia
deklaratívneho agenta v Microsoft 365 Agents Toolkite a **narazia na jeho strop** — až tam
siahnu k Agents SDK. To rozhodnutie potom celý týždeň obhajujú.

Nasleduje jadro Agents SDK a lokálny beh v Agents Playgrounde, identita aplikácií a hranice
oprávnení, grounding nad firemným obsahom cez Microsoft Graph, akcie so zápisom do
SharePointu a s validáciou parametrov, systémový prompt ako kontrakt, a **útok na vlastného
agenta** — po ktorom je zrejmé, prečo obrana v prompte nestačí a ako vyzerá obrana v kóde.
Posledný deň doplní multi-agent orchestráciu a Foundry Agent Service, inštrumentáciu do
Agent 365 s Entra Agent ID, evaluáciu golden setom a obhajobu nákladov.

**Všetko sa meria.** Agent od stredy loguje spotrebu tokenov; v piatok z toho účastník
spočíta cenu za dotaz, mesačnú prevádzku a návratnosť svojho riešenia. Odchádza s vlastnými
číslami, nie s odhadom — a s tým, čo sa s nimi dá povedať zákazníkovi.

Kurz stavia na rozhodovacej kompetencii: kedy deklaratívny agent, kedy custom engine, kedy
Copilot Studio a kedy Microsoft Foundry — a ako tú voľbu obhájiť pred zákazníkom aj pred
interným security tímom. Kód sa píše v **TypeScripte** (Node.js, Microsoft 365 Agents SDK).

## Pre koho je kurz určený

- Solution architekti a AI engineers
- Vývojári Microsoft 365 rozširujúci Copilota
- Technologickí konzultanti navrhujúci podnikové AI integrácie
- Platformoví inžinieri zaisťujúci bezpečné zavedenie AI

## Predpoklady

- **Základy JavaScriptu (JS_PROG1) a TypeScriptu (JS_TS1)** — primárny jazyk kurzu
- REST a JSON
- Základy Azure a Microsoft 365
- Skúsenosť s Microsoft Graph — výhodou
- Skúsenosť s prompt engineeringom — výhodou
- Základy C# (úroveň GOC2125) — výhodou, len pre zmienky o Agent Frameworku

## Formát a dĺžka

- 5 dní, inštruktorom vedený kurz s praktickými labmi
- úroveň: **pokročilý**
- kód v **TypeScripte** (Node.js)

> [!NOTE] Pre editora
> Cena zámerne vynechaná — doplní ju obchodné oddelenie GOPAS priamo v CMS/cenníku.

## Osnova kurzu

### Deň 1 — Mapa stacku a no-code/low-code cesty

- **Onboarding, prostredie & toolchain** — VS Code, Microsoft 365 Agents Toolkit, Node.js,
  Agents Playground; tri modely účtovania (Copilot licencia, Copilot Credits, inferencia).
- **Mapa ciest tvorby agentov & rozhodovacia os** — architektúra Copilota; deklaratívny vs.
  custom engine agent; Agent Builder, SharePoint agenti, deklaratívny agent z Toolkitu,
  Copilot Studio, Agents SDK a Foundry Agent Service — kedy čo a ako voľbu obhájiť.
- **No-code a low-code cesty — showcase** — Agent Builder a Copilot Studio naživo na tom
  istom zadaní; pri každej ceste: kto hostuje, kto platí model, kto governuje a čo nejde.

### Deň 2 — Copilot v SharePointe a deklaratívny strop

- **Skills — rozšírenie Copilot in SharePoint** — anatómia `SKILL.md`, tvorba v chate, review
  a beh; governance bez admin vypínača (riadi sa právami na súboroch).
- **SharePoint agenti** — agent nad knižnicou jedným klikom, jeho strop a zdieľanie do Teams.
- **Deklaratívni agenti & Agents Toolkit** — scaffold a provisioning, instructions ako
  orchestrácia bez kódu, schopnosti manifestu, ALM a repo-as-code; **presne pomenovaný strop
  deklaratívnej cesty** ako motivácia pre custom engine.
- **Dátová hygiena v SharePoint Online a Exchange Online** — oversharing a permission sprawl,
  SharePoint Advanced Management, Restricted Content Discovery, sensitivity labels;
  hygienický checklist pred nasadením agenta.
- **Agenti v Microsoft Marketplace** — org katalóg vs. Marketplace, Partner Center, validačný
  proces a najčastejšie dôvody zamietnutia; case study reálneho publikovaného agenta.

### Deň 3 — Prvý agent v kóde a znalosti

- **Agents SDK — jadro** — `AgentApplication`, aktivity a turny, `TurnState`, kanály; prvý
  bežiaci agent lokálne vrátane ošetrenia chybových vetiev; Microsoft Foundry v kocke.
- **Identita aplikácií** — app registrácie, delegated vs. application permissions,
  single/multi-tenant, Enterprise applications, tokeny a scopes; hranica, ktorú žiadny
  prompt neprehovorí.
- **Grounding nad firemným obsahom** — Copilot connectors (synced vs. federated), semantic
  index a vynútenie oprávnení, MCP; zapojenie knowledge do agenta **naživo nad firemnou
  knižnicou** — a kedy retrieval nerobiť sám.

### Deň 4 — Akcie, prompt a bezpečnosť

- **Action handlers & integrácia s Microsoft Graphom** — smerovanie akcií, **validácia
  parametrov pred zápisom**, zápis do SharePointu, žiadateľ z identity volajúceho;
  delegated vs. app-only a čo ktorá hranica znamená pre audit.
- **Prompt & systémová orchestrácia** — systémový prompt ako kontrakt, few-shot na formát,
  tool-call slučka a kolá vnútri turnu, meraná baseline pre zvyšok týždňa.
- **Bezpečnosť & middleware — útok a obrana ako kód** — prompt injection a XPIA cez obsah,
  rebrík útokov na vlastného agenta; middleware pipeline, pre/post processing, redakcia PII,
  whitelist odkazov a overenie citácií; minimalizácia scope ako jediná neprehovoriteľná
  hranica.
- **SharePoint Copilot Apps** *(Public Preview, voliteľný blok)* — interaktívne UX priamo
  v Copilot canvase; SPFx, MCP Apps model, hosting automaticky v tenante.

### Deň 5 — Orchestrácia, governance, kvalita a capstone

- **Rekapitulácia rozhodovacej mapy** — po štyroch dňoch praxe znova, tentoraz ako
  rozhodovací nástroj: čo ktorá cesta stojí a čo konkrétne by voľbu zmenilo.
- **Microsoft Agent Framework, A2A a Foundry Agent Service** — orchestrácia nad Agents SDK,
  vzory a ich cena, kedy viac agentov **nerobiť**; PaaS vetva mapy a dva control plany.
- **Agent 365, Entra Agent ID & inštrumentácia pro-code agenta** — control plane pre agentov,
  identita a lifecycle, registry a observability, compliance a dohľadateľnosť; porovnanie
  s third-party governance a rámec „kedy first-party a kedy third-party".
- **Retrieval v praxi — čo sa dá odmerať** — tri rôzne vyhľadávacie rozhrania Microsoftu 365
  a ako sa líšia na tom istom obsahu; prečo formát obsahu rozhoduje o kvalite groundingu; ako
  spoznať mlčiacu chybu a prečo je drahšia než hlasná.
- **Evaluácia & kvalita** — golden set a regresné testy, deterministické politiky vs.
  hodnotenie odpovedí, rozptyl medzi behmi a prahy pre vydanie, human-in-the-loop.
- **Capstone architektúra & roadmapa** — blueprint end-to-end riešenia, KPI a evaluačná
  matica, **nákladový model a ROI z vlastných nameraných dát**, model hrozby a rollback plán;
  ďalšie kroky: certifikácie **AI-103** a **AI-200**.

### Sprievodný materiál na samoštúdium

Účastníci dostávajú kompletné moduly, ktoré rozširujú vyučovanú látku a sú písané tak,
aby sa dali prejsť samostatne:

- **Vlastný retrieval** — chunking, embeddings, hybridný ranking, security trimming
  a kompromis latencia vs. relevancia.
- **Hosting a publikácia** — endpoint agenta vs. orchestrácia okolo neho, timeout a retry
  patterny, idempotencia, publikácia do kanálov.
- **Výkon, náklady & lifecycle** — token ekonomika, cache vrstvy, verzovanie, rollback,
  governance výmen modelov.
- **Multi-agent lab** — ručná orchestrácia triage + resolver nad Agents SDK a meranie toho,
  čo rozdelenie stálo.
- **Porovnanie ciest tvorby agentov** — rozdielová matica po jednotlivých schopnostiach.
- **Third-party governance** — porovnávací rámec k Agent 365.
- **Základy promptovania a agentná anatómia** — anatómia promptu, vrstvy inštrukcií.

## Výstup kurzu

Účastník odchádza s **funkčným agentom** postaveným na Microsoft 365 Agents SDK — grounding
nad firemným obsahom, akcie so zápisom cez Graph, middleware vynucujúci politiky — a
s **blueprintom jeho nasadenia**: architektúra, rozhodnutia vrátane odôvodnenia, hygienický
checklist tenanta, model hrozby a obranné vrstvy, KPI a evaluačná matica, **nákladový model
a ROI vypočítané z vlastných nameraných dát** a rollback plán.

## Pred publikáciou — kontrolný zoznam pre editora

- [ ] Nastaviť **301 redirect** zo súčasného `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`
      na nové URL uvedené vyššie.
- [ ] Zmeniť úroveň z „Mierne pokročilý" na **„Pokročilý"**.
- [ ] Preradiť **TypeScript pred C#** v predpokladoch.
- [ ] **Odstrániť zmienky o AI-102 a AZ-204** — obe skúšky sú retirované.
- [ ] Doplniť cenu kurzu (obchodné oddelenie GOPAS).
- [ ] Overiť aktuálnosť názvov produktov (Microsoft Foundry, Copilot connectors, Agent 365)
      — Microsoft ich mení v rádoch mesiacov.
- [ ] Overiť k dátumu publikácie stav **SharePoint Copilot Apps** (Public Preview) a status
      skúšky AI-500 (beta).
- [ ] Skontrolovať, že žiadny blok „Pre editora" ani delta tabuľka nezostal skopírovaný
      do publikovaného textu.

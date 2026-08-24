# SPO_COPILOT — obsah pre web (gopas.sk)

> [!NOTE] Pre editora
> Každý nadpis „##" nižšie zodpovedá jednému poľu na stránke kurzu; text pod ním vlož do daného
> poľa. Bloky „Pre editora" samotné nie sú obsah stránky — nekopírovať na web.

## Delta — čo sa mení proti aktuálne živej stránke a prečo

> [!NOTE] Pre editora
> Táto sekcia **nie je** obsah stránky. Je to odôvodnenie zmien pre schvaľovacie kolo.

| Aktuálne na webe | Novo | Dôvod |
|---|---|---|
| „Ďalšie kroky: **AI-102, AZ-204**" | **AI-103, AI-200** | Obe skúšky sú retirované: AI-102 k 2026-06-30, AZ-204 k 2026-07-31. Odporúčať ich je vecná chyba. |
| „**Graph** konektory & obohatenie metadátami" | „**Copilot connectors** — synced a federated (MCP)" | Microsoft produkt premenoval a rozdelil na dva typy s odlišnou architektúrou. |
| „Kanály a adaptéry **Azure Bot Service**" | „Kanály, aktivity a turny v Agents SDK" | Rola Bot Service sa zúžila na registráciu kanála; nosná vrstva je Agents SDK. |
| „Vektorizácia & RAG design" ako povinný blok | presunuté do **sprievodného materiálu** | Fokus kurzu je blízke okolie Microsoft 365: retrieval tam robí semantic index; vlastná vektorizácia je architektonické rozhodnutie, nie východiskový stav. |
| „Sanitizácia výstupov a **watermarking**" | „**Prompt injection / XPIA**, prevencia exfiltrácie" | Watermarking textových odpovedí agenta nemá robustný obranný prínos; injection cez obsah je reálny a aktuálny model hrozby. |
| „Responsible AI & governance" ako samostatný blok | zlúčené do **Bezpečnosť & middleware** + **Agent 365 a governance** | V pro-code kurze je guardrail kód v pipeline, nie samostatná prednáška. Compliance patrí ku governance vrstve. |
| „Bezpečnosť" a „Middleware" ako dva bloky | **jeden blok „Bezpečnosť & middleware — útok a obrana ako kód"** | Oba učili to isté z opačných strán: útok ukáže, že obrana v prompte nedrží, a middleware je odpoveď. Spojené to má dramaturgiu útok → obrana → scope; oddelené to znamenalo stavať obranu dvakrát. |
| — (chýba) | **SharePoint agenti** ako plnohodnotná cesta v rozhodovacej osi | Publikum kurzu spravuje SharePoint obsah; agent vzniknutý jedným klikom nad knižnicou je pre nich najbližší vstup — vrátane jeho stropu a zdieľania do Teams. |
| — (chýba) | **no-code/low-code showcase a deklaratívne maximum** pred pro-code | Nová progresia kurzu: developer najprv naživo posúdi agent builder a Copilot Studio a vyčerpá deklaratívnu cestu — až tam, kde končí, siaha po SDK. Rozhodovacia kompetencia, za ktorú zákazník platí najviac. |
| — (chýba) | **dátová hygiena SharePoint Online a Exchange Online** pred nasadením agenta | Agent oprávnenia neprelamuje, ale zviditeľňuje — oversharing a permission sprawl; SharePoint Advanced Management, Restricted Content Discovery, hygienický checklist. Prax kladie túto otázku pred grounding. |
| — (chýba) | **Microsoft Agent Framework** (nástupca Semantic Kernel + AutoGen), multi-agent, A2A | Vrstva, ktorú pro-code tím nad Agents SDK reálne používa. |
| — (chýba) | **SharePoint Copilot Apps** (SPFx 1.24, Public Preview) — interaktívne UX v Copilot canvase | MCP Apps model, hands-on blok; najkratší most medzi SPFx vývojom a svetom agentov. |
| — (chýba) | **distribúcia agentov cez Microsoft Marketplace** vrát. reálnej case study *(sprievodný materiál)* | Podmienky publikácie, Partner Center, proces validácie — na skutočnom publikovanom listingu (Normiqa Navigator), nie na slajde. |
| — (chýba) | **Agent 365, Entra Agent ID, instrumentácia pro-code agenta** | GA 2026-05-01. Najsilnejšia pro-code téma: low-code agenti sa registrujú automaticky, pro-code sa musia instrumentovať. |
| — (chýba) | **third-party porovnanie governance (Orchestry)** — súčasť bloku Agent 365 | Agent 365 nie je jediná odpoveď; kurz dáva rozhodovací rámec „kedy first-party a kedy third-party". |
| — (chýba) | **Microsoft Foundry**, Foundry Agent Service | Premenované z Azure AI Foundry (Ignite 2025); publikácia Foundry agentov do M365 Copilotu a Teams GA 06/2026. |
| — (chýba) | pozicionovanie **Copilot Studio** v rozhodovacej osi | Zákazníci sa na Copilot Studio pýtajú; kurz musí dať rozhodovaciu kompetenciu, nie jednu cestu. |

Štruktúra sa mení z 15 blokov na **16 vyučovaných blokov** (3–4 denne) plus **sprievodný
materiál na samoštúdium**. Bloky sú oproti pôvodnému návrhu dlhšie a je ich menej —
kalibrácia z prvého behu ukázala, že hustejší program ide na úkor hĺbky labov.
Celkový rozsah zostáva 5 dní. Fokus kurzu: **blízke okolie Microsoft 365** — vlastná
vektorizácia, hlboký Azure a všeobecné AI témy sú vedľajšie koľaje, nie jadro.

## URL

`microsoft-365-agents-sdk-copilot-extensions-a-agent-365_spo_copilot`

> [!NOTE] Pre editora
> Nový slug. Nastaviť **301 redirect** z existujúceho
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Titulok kurzu

Microsoft 365 Agents SDK, Copilot Extensions a Agent 365

## Krátky popis (meta description / teaser)

Pro-code kurz stavby, zabezpečenia a prevádzky agentov v blízkom okolí Microsoft 365 — od
rozhodovacej osi a deklaratívneho maxima cez grounding, multi-agent orchestráciu a middleware
až po SharePoint Copilot Apps, hosting, instrumentáciu do Agent 365, evaluáciu
a nákladový model.

## Popis kurzu

Päťdenný pro-code kurz pre vývojárov a architektov, ktorí stavajú agentov v blízkom okolí
Microsoft 365. Celý týždeň sa buduje **jeden agent** — od živého posúdenia no-code
a low-code ciest (Copilot agent builder, Copilot Studio) a deklaratívneho maxima
v Microsoft 365 Agents Toolkite, cez jadro Agents SDK a lokálny beh v Agents Playgrounde,
grounding nad firemným obsahom (Copilot connectors, semantic index, Copilot Retrieval API,
MCP), akcie nad Microsoft Graphom s korektnými hranicami oprávnení a dátovú hygienu tenantu,
multi-agent orchestráciu v Microsoft Agent Frameworku a middleware vynucujúci politiky, až po
interaktívne UX v Copilot canvase (SharePoint Copilot Apps), hosting a publikáciu do kanálov,
**instrumentáciu do Agent 365** s Entra Agent ID, evaluáciu
golden setom, obranu proti prompt injection a nákladový model.

Kurz stavia na rozhodovacej kompetencii: kedy deklaratívny agent, kedy custom engine, kedy
Copilot Studio a kedy Microsoft Foundry — a ako tú voľbu obhájiť pred zákazníkom aj pred
interným security tímom. Kód sa píše v **TypeScripte** (Node.js, Microsoft 365 Agents SDK).

## Pre koho je kurz určený

- Solution architekti a AI engineers
- Vývojári Microsoft 365 rozširujúci Copilota
- Technologickí konzultanti navrhujúci podnikové AI integrácie
- Platformoví inžinieri zabezpečujúci bezpečné zavedenie AI

## Predpoklady

- Základy JavaScriptu (JS_PROG1) a TypeScriptu (JS_TS1) — **primárny jazyk kurzu**
- Základy C# (úroveň kurzu GOC2125) — výhodou (inštruktorské demá Agent Frameworku)
- REST a JSON
- Základy Azure a Microsoft 365
- Skúsenosť s Microsoft Graph (výhodou)
- Skúsenosť s prompt engineeringom (výhodou)

## Formát a dĺžka

- 5 dní, inštruktorom vedený kurz s praktickými labmi
- úroveň: pokročilí
- kód v **TypeScripte** (Node.js)

> [!NOTE] Pre editora
> Cena zámerne vynechaná — doplní ju obchodné oddelenie GOPAS priamo v CMS/cenníku.

## Osnova kurzu

### Deň 1 — Mapa stacku a no-code/low-code cesty

- **Onboarding, prostredie & toolchain** — VS Code, Microsoft 365 Agents Toolkit, Node.js,
  Agents Playground; tri modely účtovania (Copilot licencia, Copilot Credits, inference).
- **Mapa ciest tvorby agentov & rozhodovacia os** — architektúra Copilotu; deklaratívny vs.
  custom engine agent; Agents SDK, Agent Framework, Copilot Studio, Microsoft Foundry,
  Agent Builder a **SharePoint agenti** — kedy čo a ako voľbu obhájiť pred zákazníkom.
- **No-code a low-code cesty — showcase** — Copilot agent builder a Copilot Studio naživo
  na rovnakom zadaní; pri každej ceste: kto hostuje, kto platí model, kto governuje
  a čo sa nedá.

### Deň 2 — Deklaratívny strop, prvý agent v kóde a hygiena

- **Deklaratívni agenti & Agents Toolkit** — scaffold a provisioning deklaratívneho agenta,
  instructions ako orchestrácia bez kódu, vrstvy inštrukcií, schopnosti aktuálnej verzie
  manifestu, TypeSpec; presne pomenovaný strop deklaratívnej cesty ako motivácia pre
  custom engine.
- **Agents SDK — jadro** — `AgentApplication`, `AgentApplicationOptions`, aktivity a turny,
  `TurnState`, kanály; prvý bežiaci agent lokálne, vrátane ošetrenia chybových vetiev.
- **Dátová hygiena v SharePoint Online a Exchange Online** — oversharing a permission
  sprawl, SharePoint Advanced Management, Restricted Content Discovery, sensitivity labels;
  hygienický checklist pred nasadením agenta.

### Deň 3 — Znalosti, akcie a prompt

- **Grounding: Copilot connectors, semantic index, MCP** — princípy indexácie SharePoint
  a OneDrive obsahu, synced vs. federated konektory, vynútenie oprávnení; zapojenie knowledge
  do agenta cez **Copilot Retrieval API** — a kedy retrieval nerobiť sám.
- **Action handlers & integrácia s Microsoft Graph** — smerovanie akcií, validácia parametrov,
  hranice oprávnení (delegated vs. app-only), MCP ako nástroj.
- **Prompt & systémová orchestrácia** — system/user/tool správy, few-shot, reťazenie promptov,
  tool-call loop, evaluačné heuristiky a meraná baseline pre zvyšok týždňa.

### Deň 4 — Copilot Apps, multi-agent a bezpečnosť

- **SharePoint Copilot Apps** *(Public Preview)* — interaktívne UX priamo v Copilot canvase;
  SPFx 1.24, MCP Apps model, Copilot Workbench, hosting automaticky v tenante; najkratší
  most medzi SPFx zručnosťami a svetom agentov.
- **Microsoft Agent Framework, workflows & multi-agent** — orchestrácia nad Agents SDK,
  vzory (sekvencia, fan-out, handoff, supervízor), A2A — a kedy viac agentov **nerobiť**.
- **Bezpečnosť & middleware — útok a obrana ako kód** — prompt injection a XPIA cez obsah,
  prevencia exfiltrácie; middleware pipeline, pre/post processing, redakcia a filtrovanie
  výstupov, safety filtre a ich strop, vzory mitigácie halucinácií; minimalizácia scope ako
  jediná neprehovoriteľná hranica.

### Deň 5 — Hosting, governance, kvalita a capstone

- **Hosting & publikácia** — endpoint agenta (App Service / Azure Container Apps) vs.
  orchestrácia okolo neho (Functions, Durable Functions, Logic Apps, Foundry Agent Service);
  timeout a retry patterny, idempotencia; manifest ako verzovaný kontrakt a publikácia
  do Microsoft 365 Copilotu a Teams.
- **Agent 365, Entra Agent ID & instrumentácia pro-code agenta** — control plane pre agentov,
  identita a lifecycle, Agent 365 SDK a CLI, registry a observability, compliance
  a dohľadateľnosť, Foundry Control Plane vs. Agent 365; porovnanie s third-party governance
  (Orchestry) a rámec „kedy first-party a kedy third-party".
- **Evaluácia & kvalita** — kvalitatívne vs. kvantitatívne metriky, golden set, regresné
  testy, human-in-the-loop, evaluácia a observability v Microsoft Foundry.
- **Capstone architektúra & roadmapa** — prezentácia end-to-end riešenia, revízia KPI
  a evaluačnej matice, token budget a rollback plán; ďalšie kroky: certifikácie **AI-103**
  a **AI-200** (aktuálny Microsoft Certification Poster; AI-500 Multi-Agent AI Solutions
  Expert ako pokročilá cesta).

### Sprievodný materiál na samoštúdium

Účastníci dostávajú navyše kompletné moduly, ktoré rozširujú vyučovanú látku a sú písané
tak, aby sa dali prejsť samostatne:

- **Vlastný retrieval** — chunking, embeddings, hybridný semantic ranking, kompromis
  latencia vs. relevancia a cena vlastného ACL modelu.
- **Agenti v Marketplace** — org katalóg vs. Microsoft Marketplace / Agent Store, Partner
  Center, validačné politiky, proces review a najčastejšie dôvody zamietnutia; case study
  skutočného publikovaného agenta (Normiqa Navigator).
- **Výkon, náklady & lifecycle** — token ekonomika, cache vrstvy, optimalizácia retrievalu;
  propagácia medzi prostrediami, verzovanie, rollback, governance výmen modelov.
- **Porovnanie ciest tvorby agentov** — rozdielová matica Agent Builder / Copilot Studio /
  Agents Toolkit / SharePoint agenti podľa jednotlivých schopností.
- **Základy promptovania a agentná anatómia** — anatómia promptu, orchestrátor, vrstvy
  inštrukcií (prompt, kontext, custom instructions, pamäť, Agent Instructions).

## Výstup kurzu

Účastník odchádza s funkčným agentom postaveným na Microsoft 365 Agents SDK a s blueprintom
jeho nasadenia: architektúra, rozhodnutia vrátane odôvodnenia, hygienický checklist tenantu,
model hrozby a obranné vrstvy, KPI a evaluačná matica, nákladový model a rollback plán.

## Pred publikáciou — kontrolný zoznam pre editora

- [ ] Nastaviť **301 redirect** z existujúceho `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`
      na nové URL uvedené vyššie.
- [ ] Doplniť cenu kurzu (obchodné oddelenie GOPAS).
- [ ] **Odstrániť zo stránky zmienky o AI-102 a AZ-204** — obe skúšky sú retirované.
- [ ] Overiť aktuálnosť názvov produktov (Microsoft Foundry, Copilot connectors, Agent 365)
      — Microsoft ich mení v rade mesiacov.
- [ ] Overiť k dátumu publikácie stav **SharePoint Copilot Apps** (SPFx 1.24, Public Preview —
      aj pracovný názov sa môže zmeniť) a status skúšky AI-500 (beta).
- [ ] Skontrolovať, že žiadny blok „Pre editora" ani delta tabuľka nezostal skopírovaný
      do publikovaného textu.

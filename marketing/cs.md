# SPO_COPILOT — obsah pro web (gopas.cz)

> [!NOTE] Pro editora
> Každý nadpis „##" níže odpovídá jednomu poli na stránce kurzu; text pod ním vlož do daného
> pole. Bloky „Pro editora" samotné nejsou obsah stránky — nekopírovat na web.
>
> **Aktualizováno po prvním běhu (týden 2026-08-24).** Osnova níž odpovídá tomu, co se
> skutečně odučilo, ne původnímu plánu.

## Delta — co se mění proti aktuálně živé stránce a proč

> [!NOTE] Pro editora
> Tato sekce **není** obsah stránky. Je to odůvodnění změn pro schvalovací kolečko.

### Věcné chyby, které je potřeba opravit

| Aktuálně na webu | Nově | Důvod |
| --- | --- | --- |
| Úroveň **„Mírně pokročilý"** | **Pokročilý** | Účastníci pátý den píšou middleware pipeline, validují zápisy do SharePointu přes Graph a obhajují nákladový model. Mírně pokročilý účastník kurz neutáhne a odejde zklamaný. |
| Předpoklady začínají **C#** | **TypeScript primárně**, C# jen jako výhoda | Celý týden se píše v TypeScriptu. C# se objeví jen ve zmínce o Agent Frameworku. Pořadí na stránce odrazuje správné publikum a láká špatné. |
| „Prompt & systémová **orchestrácia**", „Událostmi řízená **orchestrácia**" | orchestr**a**ce | Slovakismus v české verzi stránky (dvakrát). |
| „Další kroky: **AI-102, AZ-204**" | **AI-103, AI-200** | Obě zkoušky jsou retirované: AI-102 k 2026-06-30, AZ-204 k 2026-07-31. |

### Obsahové změny

| Aktuálně na webu | Nově | Důvod |
| --- | --- | --- |
| „**Graph** konektory & obohacení metadaty" | „**Copilot connectors** — synced a federated (MCP)" | Microsoft produkt přejmenoval a rozdělil na dva typy s odlišnou architekturou. |
| „Kanály a adaptéry **Azure Bot Service**" | „Kanály, aktivity a turny v Agents SDK" | Role Bot Service se zúžila na registraci kanálu. |
| „**Vektorizace & RAG design**" jako povinný blok (2,5 h) | doprovodný materiál + **měřený blok o retrievalu** na D5 | Retrieval nad tenantem dělá semantic index. Kurz místo teorie vektorizace ukazuje **naměřené srovnání tří vyhledávacích API** a rozhodnutí, kdy si retrieval stavět sám. |
| „Sanitizace výstupů a **watermarking**" | „**Prompt injection / XPIA**, prevence exfiltrace" | Watermarking textových odpovědí nemá robustní obranný přínos; injection přes obsah je reálný model hrozby. |
| „**Responsible AI & governance**" jako samostatný blok (2,5 h) | rozpuštěno do **Bezpečnost & middleware** + **Agent 365** | V pro-code kurzu je guardrail kód v pipeline, ne samostatná přednáška. |
| „Bezpečnost" a „Middleware" jako dva bloky | **jeden blok „útok a obrana jako kód"** | Oba učily totéž z opačných stran. Spojené to má dramaturgii útok → proč prompt nedrží → middleware → scope. |
| „Událostmi řízená orchestrace", „Nasazení & řízení životního cyklu" jako bloky | **doprovodný materiál** | Vyžadovalo by Azure subscription pro každého účastníka. Podstata („kde běží endpoint vs. orchestrace") je složená do bloku o Agent 365. |
| — (chybí) | **Skills — rozšíření Copilot in SharePoint** | Nejnižší příčka rozšiřování Copilota: `SKILL.md`, žádný runtime, řídí se právy na souborech. Publikum kurzu spravuje SharePoint obsah. |
| — (chybí) | **SharePoint agenti** jako plnohodnotná cesta | Agent vzniklý jedním klikem nad knihovnou je pro toto publikum nejbližší vstup — včetně jeho stropu. |
| — (chybí) | **no-code/low-code showcase a deklarativní maximum** před pro-code | Vývojář nejdřív naživo posoudí Agent Builder a Copilot Studio a vyčerpá deklarativní cestu — teprve tam, kde končí, sahá k SDK. |
| — (chybí) | **datová hygiena SharePoint Online a Exchange Online** | Agent oprávnění neprolamuje, ale zviditelňuje. Praxe klade tuto otázku před grounding. |
| — (chybí) | **identita aplikací** — app registrace, permissions, single/multi-tenant, tokeny | V prvním běhu si to skupina vyžádala jako samostatný výklad. Bez toho nelze obhájit hranici oprávnění agenta. |
| — (chybí) | **Microsoft Agent Framework**, A2A a **Foundry Agent Service** | Vrstva orchestrace nad Agents SDK a PaaS větev mapy cest. |
| — (chybí) | **SharePoint Copilot Apps** (SPFx, Public Preview) — *volitelný blok* | Nejkratší most mezi SPFx dovednostmi a světem agentů. V prvním běhu se nevešel; nabízí se při náskoku a jako samostudium. |
| — (chybí) | **distribuce přes Microsoft Marketplace** vč. case study | Podmínky publikace, Partner Center, proces validace — na skutečném publikovaném listingu, ne na slidu. |
| — (chybí) | **Agent 365, Entra Agent ID, instrumentace pro-code agenta** | GA 2026-05-01. Low-code agenti se registrují automaticky, pro-code se musí instrumentovat. |
| — (chybí) | **naměřený nákladový model a ROI** | Účastník odchází s vlastními čísly z týdne, ne s odhadem: spotřeba tokenů, cena za dotaz, návratnost. |

Struktura se mění z 15 modulů po 2,5 h na **denní bloky různé délky** (3–6 denně) plus
doprovodný materiál k samostudiu. Rozsah zůstává 5 dní.

## URL

`microsoft-365-agents-sdk-copilot-extensions-a-agent-365_spo_copilot`

> [!NOTE] Pro editora
> Nový slug. Nastavit **301 redirect** ze stávajícího
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Titulek kurzu

Microsoft 365 Agents SDK, Copilot Extensions a Agent 365

## Krátký popis (meta description / teaser)

Pro-code kurz stavby, zabezpečení a provozu agentů v blízkém okolí Microsoft 365. Celý týden
se buduje jeden agent — od rozhodnutí, kterou cestou vůbec jít, přes grounding nad firemním
obsahem a akce nad Microsoft Graphem až po middleware, instrumentaci do Agent 365, evaluaci
a nákladový model podložený vlastním měřením.

## Popis kurzu

Pětidenní pro-code kurz pro vývojáře a architekty, kteří staví agenty v blízkém okolí
Microsoft 365. **Celý týden se buduje jeden agent** — Support Asistent nad firemními
runbooky — a každý den mu přibude jedna vrstva.

Kurz začíná tam, kde začíná reálný projekt: **rozhodnutím, kterou cestou jít**. Účastníci
naživo posoudí Skills, SharePoint agenty, Copilot agent builder a Copilot Studio, postaví
deklarativního agenta v Microsoft 365 Agents Toolkitu a **narazí na jeho strop** — teprve
tam sáhnou k Agents SDK. To rozhodnutí pak celý týden obhajují.

Následuje jádro Agents SDK a lokální běh v Agents Playgroundu, identita aplikací a hranice
oprávnění, grounding nad firemním obsahem přes Microsoft Graph, akce se zápisem do
SharePointu a s validací parametrů, systémový prompt jako kontrakt, a **útok na vlastního
agenta** — po kterém je zřejmé, proč obrana v promptu nestačí a jak vypadá obrana v kódu.
Poslední den doplní multi-agent orchestraci a Foundry Agent Service, instrumentaci do
Agent 365 s Entra Agent ID, evaluaci golden setem a obhajobu nákladů.

**Všechno se měří.** Agent od středy loguje spotřebu tokenů; v pátek z toho účastník
spočítá cenu za dotaz, měsíční provoz a návratnost svého řešení. Odchází s vlastními čísly,
ne s odhadem — a s tím, co se s nimi dá říct zákazníkovi.

Kurz staví na rozhodovací kompetenci: kdy deklarativní agent, kdy custom engine, kdy
Copilot Studio a kdy Microsoft Foundry — a jak tu volbu obhájit před zákazníkem i před
interním security týmem. Kód se píše v **TypeScriptu** (Node.js, Microsoft 365 Agents SDK).

## Pro koho je kurz určen

- Solution architekti a AI engineers
- Vývojáři Microsoft 365 rozšiřující Copilota
- Technologičtí konzultanti navrhující podnikové AI integrace
- Platformní inženýři zajišťující bezpečné zavedení AI

## Předpoklady

- **Základy JavaScriptu (JS_PROG1) a TypeScriptu (JS_TS1)** — primární jazyk kurzu
- REST a JSON
- Základy Azure a Microsoft 365
- Zkušenost s Microsoft Graph — výhodou
- Zkušenost s prompt engineeringem — výhodou
- Základy C# (úroveň GOC2125) — výhodou, jen pro zmínky o Agent Frameworku

## Formát a délka

- 5 dní, instruktorem vedený kurz s praktickými laby
- úroveň: **pokročilý**
- kód v **TypeScriptu** (Node.js)

> [!NOTE] Pro editora
> Cena záměrně vynechána — doplní ji obchodní oddělení GOPAS přímo v CMS/ceníku.

## Osnova kurzu

### Den 1 — Mapa stacku a no-code/low-code cesty

- **Onboarding, prostředí & toolchain** — VS Code, Microsoft 365 Agents Toolkit, Node.js,
  Agents Playground; tři modely účtování (Copilot licence, Copilot Credits, inference).
- **Mapa cest tvorby agentů & rozhodovací osa** — architektura Copilotu; deklarativní vs.
  custom engine agent; Agent Builder, SharePoint agenti, deklarativní agent z Toolkitu,
  Copilot Studio, Agents SDK a Foundry Agent Service — kdy co a jak volbu obhájit.
- **No-code a low-code cesty — showcase** — Agent Builder a Copilot Studio naživo na stejném
  zadání; u každé cesty: kdo hostuje, kdo platí model, kdo governuje a co nejde.

### Den 2 — Copilot v SharePointu a deklarativní strop

- **Skills — rozšíření Copilot in SharePoint** — anatomie `SKILL.md`, tvorba v chatu, review
  a běh; governance bez admin vypínače (řídí se právy na souborech).
- **SharePoint agenti** — agent nad knihovnou jedním klikem, jeho strop a sdílení do Teams.
- **Deklarativní agenti & Agents Toolkit** — scaffold a provisioning, instructions jako
  orchestrace bez kódu, schopnosti manifestu, ALM a repo-as-code; **přesně pojmenovaný strop
  deklarativní cesty** jako motivace pro custom engine.
- **Datová hygiena v SharePoint Online a Exchange Online** — oversharing a permission sprawl,
  SharePoint Advanced Management, Restricted Content Discovery, sensitivity labels;
  hygienický checklist před nasazením agenta.
- **Agenti v Microsoft Marketplace** — org katalog vs. Marketplace, Partner Center, validační
  proces a nejčastější důvody zamítnutí; case study reálného publikovaného agenta.

### Den 3 — První agent v kódu a znalosti

- **Agents SDK — jádro** — `AgentApplication`, aktivity a turny, `TurnState`, kanály; první
  běžící agent lokálně včetně ošetření chybových větví; Microsoft Foundry v kostce.
- **Identita aplikací** — app registrace, delegated vs. application permissions,
  single/multi-tenant, Enterprise applications, tokeny a scopes; hranice, kterou žádný
  prompt nepřemluví.
- **Grounding nad firemním obsahem** — Copilot connectors (synced vs. federated), semantic
  index a vynucení oprávnění, MCP; zapojení knowledge do agenta **naživo nad firemní
  knihovnou** — a kdy retrieval nedělat sám.

### Den 4 — Akce, prompt a bezpečnost

- **Action handlers & integrace s Microsoft Graph** — směrování akcí, **validace parametrů
  před zápisem**, zápis do SharePointu, žadatel z identity volajícího; delegated vs. app-only
  a co která hranice znamená pro audit.
- **Prompt & systémová orchestrace** — systémový prompt jako kontrakt, few-shot na formát,
  tool-call smyčka a kola uvnitř turnu, měřená baseline pro zbytek týdne.
- **Bezpečnost & middleware — útok a obrana jako kód** — prompt injection a XPIA přes obsah,
  žebřík útoků na vlastního agenta; middleware pipeline, pre/post processing, redakce PII,
  whitelist odkazů a ověření citací; minimalizace scope jako jediná nepřemluvitelná hranice.
- **SharePoint Copilot Apps** *(Public Preview, volitelný blok)* — interaktivní UX přímo
  v Copilot canvasu; SPFx, MCP Apps model, hosting automaticky v tenantu.

### Den 5 — Orchestrace, governance, kvalita a capstone

- **Rekapitulace rozhodovací mapy** — po čtyřech dnech praxe znovu, tentokrát jako
  rozhodovací nástroj: co která cesta stojí a co konkrétně by volbu změnilo.
- **Microsoft Agent Framework, A2A a Foundry Agent Service** — orchestrace nad Agents SDK,
  vzory a jejich cena, kdy víc agentů **nedělat**; PaaS větev mapy a dva control plany.
- **Agent 365, Entra Agent ID & instrumentace pro-code agenta** — control plane pro agenty,
  identita a lifecycle, registry a observability, compliance a dohledatelnost; srovnání
  s third-party governance a rámec „kdy first-party a kdy third-party".
- **Retrieval v praxi — co se dá naměřit** — tři různá vyhledávací rozhraní Microsoftu 365
  a jak se liší na tomtéž obsahu; proč formát obsahu rozhoduje o kvalitě groundingu; jak
  poznat mlčící chybu a proč je dražší než hlasitá.
- **Evaluace & kvalita** — golden set a regresní testy, deterministické politiky vs. hodnocení
  odpovědí, rozptyl mezi běhy a prahy pro vydání, human-in-the-loop.
- **Capstone architektura & roadmapa** — blueprint end-to-end řešení, KPI a evaluační matice,
  **nákladový model a ROI z vlastních naměřených dat**, model hrozby a rollback plán; další
  kroky: certifikace **AI-103** a **AI-200**.

### Doprovodný materiál k samostudiu

Účastníci dostávají kompletní moduly, které rozšiřují vyučovanou látku a jsou psané tak,
aby se daly projít samostatně:

- **Vlastní retrieval** — chunking, embeddings, hybridní ranking, security trimming
  a kompromis latence vs. relevance.
- **Hosting a publikace** — endpoint agenta vs. orchestrace okolo něj, timeout a retry
  patterny, idempotence, publikace do kanálů.
- **Výkon, náklady & lifecycle** — token ekonomika, cache vrstvy, verzování, rollback,
  governance výměn modelů.
- **Multi-agent lab** — ruční orchestrace triage + resolver nad Agents SDK a měření toho,
  co rozdělení stálo.
- **Srovnání cest tvorby agentů** — rozdílová matice po jednotlivých schopnostech.
- **Third-party governance** — srovnávací rámec k Agent 365.
- **Základy promptování a agentní anatomie** — anatomie promptu, vrstvy instrukcí.

## Výstup kurzu

Účastník odchází s **funkčním agentem** postaveným na Microsoft 365 Agents SDK — grounding
nad firemním obsahem, akce se zápisem přes Graph, middleware vynucující politiky — a
s **blueprintem jeho nasazení**: architektura, rozhodnutí včetně odůvodnění, hygienický
checklist tenantu, model hrozby a obranné vrstvy, KPI a evaluační matice, **nákladový model
a ROI spočítané z vlastních naměřených dat** a rollback plán.

## Před publikací — kontrolní seznam pro editora

- [ ] Nastavit **301 redirect** ze stávajícího `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`
      na nové URL uvedené výše.
- [ ] Změnit úroveň z „Mírně pokročilý" na **„Pokročilý"**.
- [ ] Přeřadit **TypeScript před C#** v předpokladech.
- [ ] Opravit dva výskyty **„orchestrácia" → „orchestrace"**.
- [ ] **Odstranit zmínky o AI-102 a AZ-204** — obě zkoušky jsou retirované.
- [ ] Doplnit cenu kurzu (obchodní oddělení GOPAS).
- [ ] Ověřit aktuálnost názvů produktů (Microsoft Foundry, Copilot connectors, Agent 365)
      — Microsoft je mění v řádu měsíců.
- [ ] Ověřit k datu publikace stav **SharePoint Copilot Apps** (Public Preview) a status
      zkoušky AI-500 (beta).
- [ ] Zkontrolovat, že žádný blok „Pro editora" ani delta tabulka nezůstal zkopírovaný
      do publikovaného textu.

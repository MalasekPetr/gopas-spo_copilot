# SPO_COPILOT — obsah pro web (gopas.cz)

> [!NOTE] Pro editora
> Každý nadpis „##" níže odpovídá jednomu poli na stránce kurzu; text pod ním vlož do daného
> pole. Bloky „Pro editora" samotné nejsou obsah stránky — nekopírovat na web.

## Delta — co se mění proti aktuálně živé stránce a proč

> [!NOTE] Pro editora
> Tato sekce **není** obsah stránky. Je to odůvodnění změn pro schvalovací kolečko.

| Aktuálně na webu | Nově | Důvod |
|---|---|---|
| „Další kroky: **AI-102, AZ-204**" | **AI-103, AI-200** | Obě zkoušky jsou retirované: AI-102 k 2026-06-30, AZ-204 k 2026-07-31. Doporučovat je je věcná chyba. |
| „**Graph** konektory & obohacení metadaty" | „**Copilot connectors** — synced a federated (MCP)" | Microsoft produkt přejmenoval a rozdělil na dva typy s odlišnou architekturou. |
| „Kanály a adaptéry **Azure Bot Service**" | „Kanály, aktivity a turny v Agents SDK" | Role Bot Service se zúžila na registraci kanálu; nosná vrstva je Agents SDK. |
| „Vektorizace & RAG design" jako povinný blok | přesunuto do **doprovodného materiálu** | Fokus kurzu je blízké okolí Microsoft 365: retrieval tam dělá semantic index; vlastní vektorizace je architektonické rozhodnutí, ne výchozí stav. |
| „Sanitizace výstupů a **watermarking**" | „**Prompt injection / XPIA**, prevence exfiltrace" | Watermarking textových odpovědí agenta nemá robustní obranný přínos; injection přes obsah je reálný a aktuální model hrozby. |
| „Responsible AI & governance" jako samostatný blok | sloučeno do **Bezpečnost & middleware** + **Agent 365 a governance** | V pro-code kurzu je guardrail kód v pipeline, ne samostatná přednáška. Compliance patří k governance vrstvě. |
| „Bezpečnost" a „Middleware" jako dva bloky | **jeden blok „Bezpečnost & middleware — útok a obrana jako kód"** | Oba učily totéž z opačných stran: útok ukáže, že obrana v promptu nedrží, a middleware je odpověď. Spojené to má dramaturgii útok → obrana → scope; oddělené to znamenalo stavět obranu dvakrát. |
| — (chybí) | **SharePoint agenti** jako plnohodnotná cesta v rozhodovací ose | Publikum kurzu spravuje SharePoint obsah; agent vzniklý jedním klikem nad knihovnou je pro ně nejbližší vstup — včetně jeho stropu a sdílení do Teams. |
| — (chybí) | **no-code/low-code showcase a deklarativní maximum** před pro-code | Nová progrese kurzu: developer nejdřív naživo posoudí agent builder a Copilot Studio a vyčerpá deklarativní cestu — teprve tam, kde končí, sahá k SDK. Rozhodovací kompetence, za kterou zákazník platí nejvíc. |
| — (chybí) | **datová hygiena SharePoint Online a Exchange Online** před nasazením agenta | Agent oprávnění neprolamuje, ale zviditelňuje — oversharing a permission sprawl; SharePoint Advanced Management, Restricted Content Discovery, hygienický checklist. Praxe klade tuto otázku před grounding. |
| — (chybí) | **Microsoft Agent Framework** (nástupce Semantic Kernel + AutoGen), multi-agent, A2A | Vrstva, kterou pro-code tým nad Agents SDK reálně používá. |
| — (chybí) | **SharePoint Copilot Apps** (SPFx 1.24, Public Preview) — interaktivní UX v Copilot canvasu | MCP Apps model, hands-on blok; nejkratší most mezi SPFx vývojem a světem agentů. |
| — (chybí) | **distribuce agentů přes Microsoft Marketplace** vč. reálné case study *(doprovodný materiál)* | Podmínky publikace, Partner Center, proces validace — na skutečném publikovaném listingu (Normiqa Navigator), ne na slidu. |
| — (chybí) | **Agent 365, Entra Agent ID, instrumentace pro-code agenta** | GA 2026-05-01. Nejsilnější pro-code téma: low-code agenti se registrují automaticky, pro-code se musí instrumentovat. |
| — (chybí) | **third-party srovnání governance (Orchestry)** — součást bloku Agent 365 | Agent 365 není jediná odpověď; kurz dává rozhodovací rámec „kdy first-party a kdy third-party". |
| — (chybí) | **Microsoft Foundry**, Foundry Agent Service | Přejmenováno z Azure AI Foundry (Ignite 2025); publikace Foundry agentů do M365 Copilotu a Teams GA 06/2026. |
| — (chybí) | pozicování **Copilot Studio** v rozhodovací ose | Zákazníci se na Copilot Studio ptají; kurz musí dát rozhodovací kompetenci, ne jednu cestu. |

Struktura se mění z 15 bloků na **16 vyučovaných bloků** (3–4 denně) plus **doprovodný
materiál k samostudiu**. Celkový rozsah zůstává 5 dní. Bloky jsou proti původnímu návrhu
delší a je jich méně — kalibrace z prvního běhu ukázala, že hustší program jde na úkor
hloubky labů. Fokus kurzu: **blízké okolí Microsoft 365** — vlastní vektorizace, hluboký
Azure a obecná AI témata jsou vedlejší koleje, ne jádro.

## URL

`microsoft-365-agents-sdk-copilot-extensions-a-agent-365_spo_copilot`

> [!NOTE] Pro editora
> Nový slug. Nastavit **301 redirect** ze stávajícího
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Titulek kurzu

Microsoft 365 Agents SDK, Copilot Extensions a Agent 365

## Krátký popis (meta description / teaser)

Pro-code kurz stavby, zabezpečení a provozu agentů v blízkém okolí Microsoft 365 — od
rozhodovací osy a deklarativního maxima přes grounding, multi-agent orchestraci a middleware
až po SharePoint Copilot Apps, hosting, instrumentaci do Agent 365, evaluaci
a nákladový model.

## Popis kurzu

Pětidenní pro-code kurz pro vývojáře a architekty, kteří staví agenty v blízkém okolí
Microsoft 365. Celý týden se buduje **jeden agent** — od živého posouzení no-code
a low-code cest (Copilot agent builder, Copilot Studio) a deklarativního maxima
v Microsoft 365 Agents Toolkitu, přes jádro Agents SDK a lokální běh v Agents Playgroundu,
grounding nad firemním obsahem (Copilot connectors, semantic index, Copilot Retrieval API,
MCP), akce nad Microsoft Graphem s korektními hranicemi oprávnění a datovou hygienu tenantu,
multi-agent orchestraci v Microsoft Agent Frameworku a middleware vynucující politiky, až po
interaktivní UX v Copilot canvasu (SharePoint Copilot Apps), hosting a publikaci do kanálů,
**instrumentaci do Agent 365** s Entra Agent ID, evaluaci
golden setem, obranu proti prompt injection a nákladový model.

Kurz staví na rozhodovací kompetenci: kdy deklarativní agent, kdy custom engine, kdy
Copilot Studio a kdy Microsoft Foundry — a jak tu volbu obhájit před zákazníkem i před
interním security týmem. Kód se píše v **TypeScriptu** (Node.js, Microsoft 365 Agents SDK).

## Pro koho je kurz určen

- Solution architekti a AI engineers
- Vývojáři Microsoft 365 rozšiřující Copilota
- Technologičtí konzultanti navrhující podnikové AI integrace
- Platformní inženýři zajišťující bezpečné zavedení AI

## Předpoklady

- Základy JavaScriptu (JS_PROG1) a TypeScriptu (JS_TS1) — **primární jazyk kurzu**
- Základy C# (úroveň kurzu GOC2125) — výhodou (instruktorská dema Agent Frameworku)
- REST a JSON
- Základy Azure a Microsoft 365
- Zkušenost s Microsoft Graph (výhodou)
- Zkušenost s prompt engineeringem (výhodou)

## Formát a délka

- 5 dní, instruktorem vedený kurz s praktickými laby
- úroveň: pokročilí
- kód v **TypeScriptu** (Node.js)

> [!NOTE] Pro editora
> Cena záměrně vynechána — doplní ji obchodní oddělení GOPAS přímo v CMS/ceníku.

## Osnova kurzu

### Den 1 — Mapa stacku a no-code/low-code cesty

- **Onboarding, prostředí & toolchain** — VS Code, Microsoft 365 Agents Toolkit, Node.js,
  Agents Playground; tři modely účtování (Copilot licence, Copilot Credits, inference).
- **Mapa cest tvorby agentů & rozhodovací osa** — architektura Copilotu; deklarativní vs.
  custom engine agent; Agents SDK, Agent Framework, Copilot Studio, Microsoft Foundry,
  Agent Builder a **SharePoint agenti** — kdy co a jak volbu obhájit před zákazníkem.
- **No-code a low-code cesty — showcase** — Copilot agent builder a Copilot Studio naživo
  na stejném zadání; u každé cesty: kdo hostuje, kdo platí model, kdo governuje a co nejde.

### Den 2 — Deklarativní strop, první agent v kódu a hygiena

- **Deklarativní agenti & Agents Toolkit** — scaffold a provisioning deklarativního agenta,
  instructions jako orchestrace bez kódu, vrstvy instrukcí, schopnosti aktuální verze
  manifestu, TypeSpec; přesně pojmenovaný strop deklarativní cesty jako motivace pro
  custom engine.
- **Agents SDK — jádro** — `AgentApplication`, `AgentApplicationOptions`, aktivity a turny,
  `TurnState`, kanály; první běžící agent lokálně, včetně ošetření chybových větví.
- **Datová hygiena v SharePoint Online a Exchange Online** — oversharing a permission
  sprawl, SharePoint Advanced Management, Restricted Content Discovery, sensitivity labels;
  hygienický checklist před nasazením agenta.

### Den 3 — Znalosti, akce a prompt

- **Grounding: Copilot connectors, semantic index, MCP** — principy indexace SharePoint
  a OneDrive obsahu, synced vs. federated konektory, vynucení oprávnění; zapojení knowledge
  do agenta přes **Copilot Retrieval API** — a kdy retrieval nedělat sám.
- **Action handlers & integrace s Microsoft Graph** — směrování akcí, validace parametrů,
  hranice oprávnění (delegated vs. app-only), MCP jako nástroj.
- **Prompt & systémová orchestrace** — system/user/tool zprávy, few-shot, řetězení promptů,
  tool-call loop, evaluační heuristiky a měřená baseline pro zbytek týdne.

### Den 4 — Copilot Apps, multi-agent a bezpečnost

- **SharePoint Copilot Apps** *(Public Preview)* — interaktivní UX přímo v Copilot canvasu;
  SPFx 1.24, MCP Apps model, Copilot Workbench, hosting automaticky v tenantu; nejkratší
  most mezi SPFx dovednostmi a světem agentů.
- **Microsoft Agent Framework, workflows & multi-agent** — orchestrace nad Agents SDK,
  vzory (sekvence, fan-out, handoff, supervizor), A2A — a kdy víc agentů **nedělat**.
- **Bezpečnost & middleware — útok a obrana jako kód** — prompt injection a XPIA přes obsah,
  prevence exfiltrace; middleware pipeline, pre/post processing, redakce a filtrování
  výstupů, safety filtry a jejich strop, vzory mitigace halucinací; minimalizace scope jako
  jediná nepřemluvitelná hranice.

### Den 5 — Hosting, governance, kvalita a capstone

- **Hosting & publikace** — endpoint agenta (App Service / Azure Container Apps) vs.
  orchestrace okolo něj (Functions, Durable Functions, Logic Apps, Foundry Agent Service);
  timeout a retry patterny, idempotence; manifest jako verzovaný kontrakt a publikace
  do Microsoft 365 Copilotu a Teams.
- **Agent 365, Entra Agent ID & instrumentace pro-code agenta** — control plane pro agenty,
  identita a lifecycle, Agent 365 SDK a CLI, registry a observability, compliance
  a dohledatelnost, Foundry Control Plane vs. Agent 365; srovnání s third-party governance
  (Orchestry) a rámec „kdy first-party a kdy third-party".
- **Evaluace & kvalita** — kvalitativní vs. kvantitativní metriky, golden set, regresní
  testy, human-in-the-loop, evaluace a observability v Microsoft Foundry.
- **Capstone architektura & roadmapa** — prezentace end-to-end řešení, revize KPI
  a evaluační matice, token budget a rollback plán; další kroky: certifikace **AI-103**
  a **AI-200** (aktuální Microsoft Certification Poster; AI-500 Multi-Agent AI Solutions
  Expert jako pokročilá cesta).

### Doprovodný materiál k samostudiu

Účastníci dostávají navíc kompletní moduly, které rozšiřují vyučovanou látku a jsou psané
tak, aby se daly projít samostatně:

- **Vlastní retrieval** — chunking, embeddings, hybridní semantic ranking, kompromis
  latence vs. relevance a cena vlastního ACL modelu.
- **Agenti v Marketplace** — org katalog vs. Microsoft Marketplace / Agent Store, Partner
  Center, validační politiky, proces review a nejčastější důvody zamítnutí; case study
  reálného publikovaného agenta (Normiqa Navigator).
- **Výkon, náklady & lifecycle** — token ekonomika, cache vrstvy, optimalizace retrievalu;
  propagace mezi prostředími, verzování, rollback, governance výměn modelů.
- **Srovnání cest tvorby agentů** — rozdílová matice Agent Builder / Copilot Studio /
  Agents Toolkit / SharePoint agenti po jednotlivých schopnostech.
- **Základy promptování a agentní anatomie** — anatomie promptu, orchestrátor, vrstvy
  instrukcí (prompt, kontext, custom instructions, paměť, Agent Instructions).

## Výstup kurzu

Účastník odchází s funkčním agentem postaveným na Microsoft 365 Agents SDK a s blueprintem
jeho nasazení: architektura, rozhodnutí včetně odůvodnění, hygienický checklist tenantu,
model hrozby a obranné vrstvy, KPI a evaluační matice, nákladový model a rollback plán.

## Před publikací — kontrolní seznam pro editora

- [ ] Nastavit **301 redirect** ze stávajícího `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`
      na nové URL uvedené výše.
- [ ] Doplnit cenu kurzu (obchodní oddělení GOPAS).
- [ ] **Odstranit ze stránky zmínky o AI-102 a AZ-204** — obě zkoušky jsou retirované.
- [ ] Ověřit aktuálnost názvů produktů (Microsoft Foundry, Copilot connectors, Agent 365)
      — Microsoft je mění v řádu měsíců.
- [ ] Ověřit k datu publikace stav **SharePoint Copilot Apps** (SPFx 1.24, Public Preview —
      i pracovní název se může změnit) a status zkoušky AI-500 (beta).
- [ ] Zkontrolovat, že žádný blok „Pro editora" ani delta tabulka nezůstal zkopírovaný
      do publikovaného textu.

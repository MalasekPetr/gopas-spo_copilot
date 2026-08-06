# Glosář — závazné názvosloví

Jediný zdroj pravdy pro názvy produktů, SDK, protokolů a certifikací. Všechny moduly se
odkazují sem.

> [!WARNING] Ověřit k datu běhu — stav k 2026-08.
> Tenhle obor přejmenovává produkty po měsících a retiruje certifikace po kvartálech.
> Před každým během projet všechny položky s tímto markerem. Špatné jméno produktu
> v materiálu je nejviditelnější chyba, kterou lektor může udělat.

## Přejmenování — co studenty nejvíc plete

| Používat | Dřívější názvy | Poznámka |
|---|---|---|
| **Microsoft 365 Copilot connectors** | Microsoft Graph connectors | Přejmenováno. Backend API se **stále** jmenuje Microsoft Graph connectors API. |
| **Microsoft Foundry** | Azure AI Studio → Azure AI Foundry | Přejmenováno na Ignite 2025. |
| **Microsoft 365 Agents Toolkit** | Teams Toolkit | Nástupce; rozsah je širší než Teams. |
| **Microsoft 365 Agents Playground** | Teams App Test Tool | Lokální debug **bez tenantu, tunelu a registrace bota**. |
| **Microsoft Agent Framework** | Semantic Kernel + AutoGen | Sloučení obou; použitelný **uvnitř** Agents SDK. |
| **Microsoft Entra Agent ID** | (nový) | Identita agenta jako first-class objekt v Entra. |
| **AI-103** | AI-102 (retired **2026-06-30**) | Azure AI Apps and Agents Developer Associate. |
| **AI-200** | AZ-204 (retired **2026-07-31**) | **Azure AI Cloud Developer Associate**; větší akcent na kód a observability. Název ověřen proti Certification Posteru (2026-08). |

> [!IMPORTANT] Brand vs. URL
> Microsoft dokumentace **Microsoft Foundry** stále žije pod `learn.microsoft.com/azure/foundry/`
> a blogy pod `azure-ai-foundry-blog`. Studenty na to v labech upozornit, ať je URL nezmate —
> brand se přejmenoval, URL a backend zůstaly.

> [!IMPORTANT] Retirované certifikace
> Katalogová osnova kurzu jmenuje **AI-102 a AZ-204** jako „další kroky". Obě jsou
> k datu psaní **retirované**. Správné pokračování: **AI-103** (AI Apps and Agents Developer)
> a **AI-200** (Cloud Developer). Řeší [`day-5/capstone/`](day-5/capstone/).

## Vrstvy stacku — co je co (a co čím není)

| Vrstva | Co to je | Co to **není** |
|---|---|---|
| **Microsoft 365 Copilot** | pracovní plocha / distribuční kanál | ne runtime tvého agenta |
| **Microsoft 365 Agents SDK** | framework pro příjem zpráv, stav, routing aktivit, autentizaci, transport napříč kanály | **není** AI model, **není** orchestrační engine, **není** no-code builder |
| **Microsoft Agent Framework** | orchestrace, workflows, multi-agent (nástupce Semantic Kernel + AutoGen) | není transportní vrstva — tu dělá Agents SDK |
| **Microsoft 365 Agents Toolkit** | VS Code / Visual Studio scaffolding, testování, deployment, CI/CD, TypeSpec, MCP | není runtime |
| **Copilot Studio** | low-code stavba agentů, Power Platform governance | není pro-code cesta |
| **Microsoft Foundry** | Azure PaaS runtime pro agenty a modely (Foundry Agent Service, evaluations, Control Plane) | není součást M365 licence |
| **Agent 365** | control plane — identita, registry, observability, governance agentů napříč původem | **nehostuje ani netvoří** agenty |

## Deklarativní vs. custom engine agent

- **Deklarativní agent** — přizpůsobuje Microsoft 365 Copilot: `instructions`, `knowledge`,
  `actions` v manifestu. Běží na orchestrátoru a modelech Microsoft 365 Copilotu.
  Nepotřebuje vlastní hosting ani model endpoint.
- **Custom engine agent** — vlastní orchestrace, vlastní model, vlastní hosting. Staví se
  přes **Agents SDK** (pro-code), Copilot Studio (low-code) nebo Foundry.
  **Potřebuje inference endpoint** — viz [`environment.md`](environment.md).

Rozhodovací osa je nosný obsah [`day-1/agent-landscape/`](day-1/agent-landscape/).

## Agents SDK — klíčové pojmy

| Pojem | Význam |
|---|---|
| **`AgentApplication`** | vstupní bod pro všechny příchozí aktivity; drží handlery, routing, stav |
| **`AgentApplicationOptions`** | konfigurace aplikace (storage, autentizace, chování turnu) |
| **Activity** | jedna příchozí/odchozí událost (zpráva, lifecycle event, akce Adaptive Card, OAuth callback) |
| **Turn** | zpracování jedné aktivity od příjmu po odpověď |
| **`TurnState`** | stav v rámci turnu / konverzace / uživatele |
| **Kanál** | Microsoft 365 Copilot, Teams, web chat, e-mail, SMS a další |

> [!WARNING] Ověřit k datu běhu
> Role **Azure Bot Service** se zúžila na registraci kanálu a channel adaptaci — není to
> nosná architektonická vrstva, jak naznačuje starší dokumentace i katalogová osnova.
> Ověřit aktuální požadavek na Bot registraci per kanál před během.

## Copilot connectors — synced vs. federated

Nejdůležitější rozlišení pro modul o ingestion strategii. Katalogová osnova ho ještě nezná.

| | **Synced connectors** | **Federated connectors** |
|---|---|---|
| Data | indexovaná do Microsoft Graphu | fetchovaná **live**, bez indexace |
| Mechanismus | Microsoft Graph connectors API (crawl + ACL) | **MCP** |
| Hodí se na | široká indexace, relevance přes semantic index | citlivá, dynamická nebo živá data |
| Zápis | ne | ne (read-only) |
| Konfigurace | tenant (admin) nebo personal (uživatel) | admin povolí, uživatel se autentizuje |

> [!WARNING] Ověřit k datu běhu — stav k 2026-08
> Vlastní (custom) konektor jde postavit **jen jako synced** — přes Agents Toolkit nebo Graph
> connectors API. Federated konektory jsou k datu psaní jen ty od Microsoftu.

## Retrieval — kdy si ho dělat sám

- **Semantic index** (Microsoft Graph) + Copilot connectors dělají retrieval **za tebe**,
  včetně vynucení permissions ze zdrojového systému.
- **Vlastní vektorizace** (chunking, embeddings, hybrid semantic ranking, Azure AI Search)
  je **rozhodnutí**, ne výchozí stav. Cena: vlastní ACL model, vlastní refresh, vlastní
  relevance ladění.
- Proto je vlastní retrieval v tomto kurzu **volitelný modul**
  [`day-2/opt-custom-retrieval/`](day-2/opt-custom-retrieval/), ne povinné jádro.

## Protokoly

| Zkratka | Význam | Kde v kurzu |
|---|---|---|
| **MCP** (Model Context Protocol) | standard pro připojení nástrojů a dat k modelu; first-class v Agents Toolkitu; nese federated konektory | `knowledge-grounding`, `actions-graph` |
| **MCP Apps** | rozšíření MCP o interaktivní UX komponenty; v M365 implementované jako **SharePoint Copilot Apps** (SPFx, tenant-hosted, Public Preview) | `spfx-copilot-apps` |
| **A2A** (Agent-to-Agent) | komunikace mezi agenty | `agent-framework` |

> [!WARNING] Ověřit k datu běhu
> A2A i MCP se vyvíjejí rychleji než dokumentace. Ověřit aktuální podporu v Agents SDK
> a Toolkitu před během. **SharePoint Copilot Apps** jsou Public Preview (SPFx 1.24,
> 2026-07) — i pracovní název se může změnit.

## Agent 365, Entra Agent ID a governance

> [!WARNING] Ověřit k datu běhu — stav k 2026-08.
> **Agent 365**: GA **2026-05-01**
> ([oznámení GA](https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/)),
> standalone licence **$15/user/měs** (nebo v E7,
> [Microsoft licensing FAQ](https://www.microsoft.com/licensing/faqs/122)).
> Licencuje se **uživatel**, ne agent.

- Každý agent dostává **Microsoft Entra Agent ID** — identita, lifecycle, řízení přístupu.
  Umožňuje access reviews, lifecycle politiky, owner attestation u high-impact agentů.
- **Agent 365 SDK + CLI** = developerský povrch Agent 365. Agent 365 samo **agenty nehostuje
  ani netvoří**; podporuje pro-code frameworky (Agent Framework, Agents SDK a další).
- **Microsoft Foundry** registruje agenty do Agent 365 registry automaticky a spravuje
  jejich identity po celý lifecycle.

> [!IMPORTANT] Nosný pro-code teaching point
> **Copilot Studio agenti se do Agent 365 registry registrují automaticky. Pro-code agenti
> se musí explicitně instrumentovat.** To je přesně ta práce, kterou tato audience dělá —
> a důvod, proč „low-code je governed, pro-code je divočina" je mýtus, pokud instrumentaci
> uděláš. Řeší [`day-4/agent-365-governance/`](day-4/agent-365-governance/).

**Dva control plany, nezaměňovat**: **Foundry Control Plane** (infrastruktura a agenti v Azure)
vs. **Agent 365** (agenti napříč původem, z pohledu IT/security v M365). Sync mezi nimi existuje.

**Third-party alternativa**: **Orchestry** (orchestry.com) — governance vrstva nad M365
od třetí strany; nemá pod kontrolou Entra Agent ID (identita zůstává first-party doména).
Jediné non-Microsoft téma kurzu, srovnávací blok [`day-5/orchestry-governance/`](day-5/orchestry-governance/) —
rozsah agent governance ověřovat u vendora před během.

## Licence, kredity a inference — tři různé peněženky

| Peněženka | Co platí | Pozor |
|---|---|---|
| **M365 Copilot licence** | přístup k Copilot zážitkům, deklarativní agenti, grounding nad tenantem | per user |
| **Copilot Credits (PAYG)** | Copilot Chat nad tenant daty, použití agentů, Agent Builder | **neplatí volání modelu z vlastního kódu** |
| **Azure inference** (Foundry / Azure OpenAI) | tokeny modelu, který volá tvůj custom engine agent | jde přes Azure subscription, ne přes M365 |

> [!IMPORTANT] Nosný teaching point kurzu
> **Copilot Credits ≠ inference endpoint.** Custom engine agent postavený na Agents SDK si
> model přináší vlastní — Copilot Credits mu ho nezaplatí. Tohle je nejčastější rozpočtové
> nedorozumění u zákazníků a přímý důsledek pro architekturu. Viz [`environment.md`](environment.md).

## Nástroje a jejich licenční dotyk

| Nástroj | Co to je | Licenční dotyk |
|---|---|---|
| **Microsoft 365 Agents Toolkit** | VS Code / Visual Studio rozšíření; scaffolding, MCP, TypeSpec, publikace | zdarma |
| **Microsoft 365 Agents Playground** | lokální test agenta bez tenantu | zdarma |
| **Microsoft 365 Agents SDK** | framework (C#, JS/TS, Python) | zdarma (model se platí zvlášť) |
| **Microsoft Agent Framework** | orchestrace / multi-agent | zdarma (model se platí zvlášť) |
| **Agent 365 SDK / CLI** | instrumentace agenta do Agent 365 | vyžaduje Agent 365 licenci pro provoz |
| **GitHub Copilot** | AI asistent při psaní kódu | vlastní licence, **mimo M365 licenční tok** |
| **Copilot Studio** | low-code stavba agentů | Copilot Credits / M365 Copilot licence |

## Podporované jazyky Agents SDK

**C#** (.NET), **JavaScript/TypeScript** (Node), **Python**.
V tomto kurzu: **C# primárně**, TypeScript parity úryvky, Python jen zmínkou — viz
[`CONVENTIONS.md`](CONVENTIONS.md).

## Hosting — endpoint agenta a orchestrace okolo

Dvě různé otázky: kde běží **vždy dostupný HTTP endpoint agenta** (ASP.NET Core aplikace)
a kde běží **orchestrace okolo něj**.

| Volba | Kdy |
|---|---|
| **App Service / Azure Container Apps** | **endpoint samotného agenta** — výchozí odpověď pro Agents SDK |
| **Azure Functions** | krátké event-driven zpracování, consumption billing |
| **Azure Logic Apps** | integrace bez kódu, konektorová krajina |
| **Durable Functions** | dlouhé stavové orchestrace, fan-out/fan-in |
| **Foundry Agent Service** | hostovaný agent v Azure, publikovatelný do M365 Copilotu a Teams |
| **Agent Framework workflows** | orchestrace uvnitř tvého procesu |

> [!WARNING] Ověřit k datu běhu — stav k 2026-08.
> Publikace **Foundry agentů do Microsoft 365 Copilotu a Teams** je GA od **06/2026** —
> jedna governed publikační pipeline místo rebuildu per surface. Ověřit aktuální rozsah.

## Zdroje (Microsoft)

- [Microsoft 365 Agents SDK — overview](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)
- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)
- [Use Semantic Kernel and Agent Framework in Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/using-semantic-kernel-agent-framework)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)
- [Microsoft 365 Agents Toolkit — overview](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/overview-agents-toolkit)
- [Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)
- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent)
- [Choose the right tool to build a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-tool-comparison)
- [Microsoft Agent 365 SDK and CLI](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/)
- [What is Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)
- [Governing agent identities — Entra ID Governance](https://learn.microsoft.com/en-us/entra/id-governance/agent-id-governance-overview)
- [Microsoft Agent 365 integration with Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-365-integration)
- [Agent identity concepts in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity)
- [Exam and assessment lab retirement](https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams)

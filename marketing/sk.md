# SPO_COPILOT — obsah pre web (gopas.sk)

> [!NOTE] Pre editora
> Každý nadpis „##" nižšie zodpovedá jednému poľu na stránke kurzu; text pod ním vlož do daného
> poľa. Bloky „Pre editora" samotné nie sú obsah stránky — nekopírovať na web.

## Delta — čo sa mení proti aktuálne živej stránke a prečo

> [!NOTE] Pre editora
> Táto sekcia **nie je** obsah stránky. Je to odôvodnenie zmien pre schvaľovacie kolečko.

| Aktuálne na webe | Novo | Dôvod |
|---|---|---|
| „Ďalšie kroky: **AI-102, AZ-204**" | **AI-103, AI-200** | Obe skúšky sú retirované: AI-102 k 2026-06-30, AZ-204 k 2026-07-31. Odporúčať ich je vecná chyba. |
| „**Graph** konektory & obohatenie metadátami" | „**Copilot connectors** — synced a federated (MCP)" | Microsoft produkt premenoval a rozdelil na dva typy s odlišnou architektúrou. |
| „Kanály a adaptéry **Azure Bot Service**" | „Kanály, aktivity a turny v Agents SDK" | Rola Bot Service sa zúžila na registráciu kanála; nosná vrstva je Agents SDK. |
| „Vektorizácia & RAG design" ako povinný blok | presunuté do **voliteľného** bloku | V Microsoft 365 robí retrieval semantic index; vlastná vektorizácia je architektonické rozhodnutie, nie výchozí stav. |
| „Sanitizácia výstupov a **watermarking**" | „**Prompt injection / XPIA**, prevencia exfiltrácie" | Watermarking textových odpovedí agenta nemá robustný obranný prínos; injection cez obsah je reálny a aktuálny model hrozby. |
| „Responsible AI & governance" ako samostatný blok | zlúčené do **Middleware & enforcement politík** + **Agent 365 a governance** | V pro-code kurze je guardrail kód v pipeline, nie samostatná prednáška. Compliance patrí ku governance vrstve. |
| — (chýba) | **Microsoft Agent Framework** (nástupca Semantic Kernel + AutoGen), multi-agent, A2A | Vrstva, ktorú pro-code tím nad Agents SDK reálne používa. |
| — (chýba) | **Agent 365, Entra Agent ID, instrumentácia pro-code agenta** | GA 2026-05-01. Najsilnejšia pro-code téma: low-code agenti sa registrujú automaticky, pro-code sa musia instrumentovať. |
| — (chýba) | **Microsoft Foundry**, Foundry Agent Service | Premenované z Azure AI Foundry (Ignite 2025); publikácia Foundry agentov do M365 Copilotu a Teams GA 06/2026. |
| — (chýba) | pozicionovanie **Copilot Studio** v rozhodovacej osi | Zákazníci sa na Copilot Studio pýtajú; kurz musí dať rozhodovaciu kompetenciu, nie jednu cestu. |

Štruktúra sa mení z 15 blokov na **16** (15 povinných + 1 voliteľný). Celkový rozsah
zostáva 5 dní.

## URL

`microsoft-365-agents-sdk-copilot-extensions-a-agent-365_spo_copilot`

> [!NOTE] Pre editora
> Nový slug. Nastaviť **301 redirect** zo stávajúceho
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Titulok kurzu

Microsoft 365 Agents SDK, Copilot Extensions a Agent 365

## Krátky popis (meta description / teaser)

Pro-code kurz stavby, zabezpečenia a prevádzky agentov na Microsoft 365 Agents SDK — od
rozhodovacej osi a groundingu cez multi-agent orchestráciu a middleware až po instrumentáciu
do Agent 365, evaluáciu a nákladový model.

## Popis kurzu

Päťdenný pro-code kurz pre vývojárov a architektov, ktorí stavajú agentov nad Microsoft 365.
Celý týždeň sa buduje **jeden agent** — od scaffoldingu v Microsoft 365 Agents Toolkite
a lokálneho behu v Agents Playgrounde, cez grounding nad firemným obsahom (Copilot connectors,
semantic index, MCP), akcie nad Microsoft Graphom s korektnými hranicami oprávnení, multi-agent
orchestráciu v Microsoft Agent Frameworku, middleware vynucujúci politiky, až po hosting,
**instrumentáciu do Agent 365** s Entra Agent ID, evaluáciu golden setom, obranu proti prompt
injection a nákladový model.

Kurz stavia na rozhodovacej kompetencii: kedy deklaratívny agent, kedy custom engine, kedy
Copilot Studio a kedy Microsoft Foundry — a ako tú voľbu obhájiť pred zákazníkom aj pred
interným security tímom. Kód sa píše v **C#**, s TypeScript ukážkami pre paritu.

## Pre koho je kurz určený

- Solution architekti a AI engineers
- Vývojári Microsoft 365 rozširujúci Copilota
- Technologickí konzultanti navrhujúci podnikové AI integrácie
- Platformoví inženýri zabezpečujúci bezpečné zavedenie AI

## Predpoklady

- Základy C# (úroveň kurzu GOC2125) — **primárny jazyk kurzu**
- Základy JavaScriptu (JS_PROG1) a TypeScriptu (JS_TS1) — pre ukážky parity
- REST a JSON
- Základy Azure a Microsoft 365
- Skúsenosť s Microsoft Graph (výhodou)
- Skúsenosť s prompt engineeringom (výhodou)

## Formát a dĺžka

- 5 dní, instruktorom vedený kurz s praktickými labmi
- úroveň: pokročilí
- kód v **C#**, TypeScript ukážky pre paritu

> [!NOTE] Pre editora
> Cena zámerne vynechaná — doplní ju obchodné oddelenie GOPAS priamo v CMS/cenníku.

## Osnova kurzu

### Deň 1 — Mapa stacku, prostredie a prvý agent

- **Onboarding, prostredie & toolchain** — VS Code, Microsoft 365 Agents Toolkit, .NET SDK,
  Agents Playground; tri modely účtovania (Copilot licencia, Copilot Credits, inference).
- **Mapa ciest tvorby agentov & rozhodovacia os** — architektúra Copilotu; deklaratívny vs.
  custom engine agent; Agents SDK, Agent Framework, Copilot Studio, Microsoft Foundry,
  Agent Builder — kedy čo a ako voľbu obhájiť.
- **Agents SDK — jadro** — `AgentApplication`, `AgentApplicationOptions`, aktivity a turny,
  `TurnState`, kanály; prvý bežiaci agent lokálne, vrátane ošetrenia chybových vetiev.

### Deň 2 — Znalosti, akcie a prompt

- **Grounding: Copilot connectors, semantic index, MCP** — princípy indexácie SharePoint
  a OneDrive obsahu, synced vs. federated konektory, obohatenie metadátami, vynútenie oprávnení.
- **Action handlers & integrácia s Microsoft Graph** — smerovanie akcií, validácia parametrov,
  hranice oprávnení (delegated vs. app-only), Entra Agent ID, MCP ako nástroj.
- **Prompt & systémová orchestrácia** — system/user/tool zprávy, few-shot, reťazenie promptov,
  tool-call loop, evaluačné heuristiky.

> Voliteľne podľa času skupiny: **Vlastný retrieval** — chunking, embeddings, hybridný
> semantic ranking, kompromis latencia vs. relevancia a cena vlastného ACL modelu.

### Deň 3 — Multi-agent, politiky a manifest

- **Microsoft Agent Framework, workflows & multi-agent** — orchestrácia nad Agents SDK,
  vzory (sekvencia, fan-out, handoff, supervízor), A2A — a kedy viac agentov **nerobiť**.
- **Middleware & enforcement politík** — pre/post processing, redakcia, filtrovanie výstupov,
  safety filtre a content moderation, vzory mitigácie halucinácií.
- **Manifest, deklarácia schopností & kanály** — manifest ako verzovaný kontrakt, TypeSpec,
  publikácia do Microsoft 365 Copilotu, Teams a webu; stavba deklaratívneho agenta pre porovnanie.

### Deň 4 — Hosting, governance a kvalita

- **Udalosťami riadená orchestrácia & hosting** — Azure Functions vs. Logic Apps vs. Durable
  Functions vs. Foundry Agent Service; reťazenie volaní modelu a nástrojov, timeout a retry
  patterny, idempotencia.
- **Agent 365, Entra Agent ID & instrumentácia pro-code agenta** — control plane pre agentov,
  identita a lifecycle, Agent 365 SDK a CLI, registry a observability, compliance
  a dohľadateľnosť, Foundry Control Plane vs. Agent 365.
- **Evaluácia & kvalita** — kvalitatívne vs. kvantitatívne metriky, golden set, regresné testy,
  human-in-the-loop, evaluácia a observability v Microsoft Foundry.

### Deň 5 — Bezpečnosť, náklady a capstone

- **Bezpečnosť & riadenie rizík** — prompt injection a XPIA, prevencia exfiltrácie,
  minimalizácia scope, sanitizácia výstupov, detekcia v auditnej stope.
- **Výkon, náklady & lifecycle** — token ekonomika, cache vrstvy, optimalizácia retrievalu,
  odolnosť; propagácia medzi prostrediami, verzovanie, rollback, governance výmen modelov
  a plánovanie deprecácií.
- **Capstone architektúra & roadmapa** — prezentácia end-to-end riešenia, revízia KPI
  a evaluačnej matice, ďalšie kroky (AI-103, AI-200, multi-agent vzory).

## Výstup kurzu

Účastník odchádza s funkčným agentom postaveným na Microsoft 365 Agents SDK a s blueprintom
jeho nasadenia: architektúra, rozhodnutia vrátane odôvodnenia, model hrozby a obranné vrstvy,
KPI a evaluačná matica, nákladový model a rollback plán.

## Pred publikáciou — kontrolný seznam pre editora

- [ ] Nastaviť **301 redirect** zo stávajúceho `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`
      na nové URL uvedené vyššie.
- [ ] Doplniť cenu kurzu (obchodné oddelenie GOPAS).
- [ ] **Odstrániť zo stránky zmienky o AI-102 a AZ-204** — obe skúšky sú retirované.
- [ ] Overiť aktuálnosť názvov produktov (Microsoft Foundry, Copilot connectors, Agent 365)
      — Microsoft ich mení v rade mesiacov.
- [ ] Skontrolovať, že žiadny blok „Pre editora" ani delta tabuľka nezostal skopírovaný
      do publikovaného textu.

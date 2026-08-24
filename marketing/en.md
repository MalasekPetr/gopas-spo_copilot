# SPO_COPILOT — website content (gopas.eu)

> [!NOTE] Editor note
> Each "##" heading below corresponds to one field on the course page; the text under it is
> the content for that field. "Editor note" blocks themselves are not page content — do not
> copy them to the website.

## Delta — what changes versus the currently live page, and why

> [!NOTE] Editor note
> This section is **not** page content. It is the rationale for the approval round.

| Currently on the page | New | Reason |
|---|---|---|
| "Next steps: **AI-102, AZ-204**" | **AI-103, AI-200** | Both exams are retired: AI-102 on 2026-06-30, AZ-204 on 2026-07-31. Recommending them is factually wrong. |
| "**Graph** connectors & metadata enrichment" | "**Copilot connectors** — synced and federated (MCP)" | Microsoft renamed the product and split it into two types with different architectures. |
| "Channels and **Azure Bot Service** adapters" | "Channels, activities and turns in the Agents SDK" | The role of Bot Service narrowed to channel registration; the architectural layer is the Agents SDK. |
| "Vectorization & RAG design" as a required block | moved to an **optional** block | The course focus is the near surroundings of Microsoft 365: the semantic index handles retrieval there; custom vectorization is an architectural decision, not the default. |
| "Output sanitization and **watermarking**" | "**Prompt injection / XPIA**, exfiltration prevention" | Watermarking an agent's text responses offers no robust defensive value; injection through content is the real, current threat model. |
| "Responsible AI & governance" as a standalone block | merged into **Middleware & policy enforcement** + **Agent 365 and governance** | In a pro-code course a guardrail is code in a pipeline, not a separate lecture. Compliance belongs with the governance layer. |
| — (missing) | **no-code/low-code showcase and the declarative maximum** before pro-code | New course progression: the developer first assesses agent builder and Copilot Studio live and exhausts the declarative path — only where it ends do they reach for the SDK. The decision competence customers pay the most for. |
| — (missing) | **data hygiene in SharePoint Online and Exchange Online** before deploying an agent | An agent does not break permissions — it exposes them: oversharing and permission sprawl; SharePoint Advanced Management, Restricted Content Discovery, a hygiene checklist. In practice this question comes before grounding. |
| — (missing) | **Microsoft Agent Framework** (successor to Semantic Kernel + AutoGen), multi-agent, A2A | The layer a pro-code team actually uses on top of the Agents SDK. |
| — (missing) | **SharePoint Copilot Apps** (SPFx 1.24, Public Preview) — interactive UX in the Copilot canvas | MCP Apps model, hands-on block; the shortest bridge between SPFx development and the agent world. |
| — (missing) | **agent distribution via Microsoft Marketplace** incl. a real case study | Publishing conditions, Partner Center, the validation process — shown on a real published listing (Normiqa Navigator), not a slide. |
| — (missing) | **Agent 365, Entra Agent ID, instrumenting a pro-code agent** | GA 2026-05-01. The strongest pro-code topic: low-code agents register automatically, pro-code agents must be instrumented. |
| — (missing) | **third-party governance comparison (Orchestry)** | Agent 365 is not the only answer; the course provides a decision framework for "when first-party and when third-party". |
| — (missing) | **Microsoft Foundry**, Foundry Agent Service | Renamed from Azure AI Foundry (Ignite 2025); publishing Foundry agents into M365 Copilot and Teams GA 06/2026. |
| — (missing) | positioning **Copilot Studio** on the decision axis | Customers ask about Copilot Studio; the course must build decision competence, not teach a single path. |

The structure changes from 15 blocks to **21** (20 required + 1 optional), 4–5 blocks per
day. Total length remains 5 days. Course focus: the **near surroundings of Microsoft 365**
— custom vectorization, deep Azure, and general AI topics are side tracks, not the core.

## URL

`microsoft-365-agents-sdk-copilot-extensions-and-agent-365_spo_copilot`

> [!NOTE] Editor note
> New slug. Set up a **301 redirect** from the current
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Course title

Microsoft 365 Agents SDK, Copilot Extensions, and Agent 365

## Short description (meta description / teaser)

A pro-code course on building, securing, and operating agents in the near surroundings of
Microsoft 365 — from the decision axis and the declarative maximum, through grounding,
multi-agent orchestration, and middleware, to SharePoint Copilot Apps, Microsoft Marketplace,
Agent 365 instrumentation, evaluation, and cost modelling.

## Course overview

A five-day pro-code course for developers and architects building agents in the near
surroundings of Microsoft 365. One agent is built across the whole week — from a live
assessment of the no-code and low-code paths (Copilot agent builder, Copilot Studio) and
the declarative maximum in Microsoft 365 Agents Toolkit, through the Agents SDK core and
running locally in Agents Playground, grounding over enterprise content (Copilot connectors,
semantic index, Copilot Retrieval API, MCP), actions over Microsoft Graph with correct
permission boundaries and tenant data hygiene, multi-agent orchestration in Microsoft Agent
Framework and middleware that enforces policy, to interactive UX in the Copilot canvas
(SharePoint Copilot Apps), hosting and publishing to channels, Microsoft Marketplace
conditions, **instrumentation into Agent 365** with Entra Agent ID, golden-set evaluation,
prompt-injection defence, and a cost model.

The course is built around decision competence: when a declarative agent, when a custom
engine agent, when Copilot Studio, and when Microsoft Foundry — and how to defend that choice
to a customer and to an internal security team. Code is written in **TypeScript** (Node.js, Microsoft 365 Agents SDK).

## Who this course is for

- Solution architects and AI engineers
- Microsoft 365 developers extending Copilot
- Technology consultants designing enterprise AI integrations
- Platform engineers enabling secure AI adoption

## Prerequisites

- JavaScript (JS_PROG1) and TypeScript (JS_TS1) basics — **the course's primary language**
- C# fundamentals (GOC2125 course level) — advantageous (instructor demos of Agent Framework)
- REST and JSON
- Azure and Microsoft 365 basics
- Microsoft Graph experience (advantageous)
- Prompt engineering experience (advantageous)

## Format and length

- 5 days, instructor-led with hands-on labs
- level: advanced
- code in **TypeScript** (Node.js)

> [!NOTE] Editor note
> Price intentionally omitted — GOPAS sales fills it in directly in the CMS/price list.

## Course outline

### Day 1 — Stack map, no-code/low-code, and the first agent

- **Onboarding, environment & toolchain** — VS Code, Microsoft 365 Agents Toolkit, Node.js,
  Agents Playground; the three billing models (Copilot licence, Copilot Credits, inference).
- **Agent build paths & the decision axis** — Copilot architecture; declarative vs. custom
  engine agents; Agents SDK, Agent Framework, Copilot Studio, Microsoft Foundry, Agent Builder
  — when to use which, and how to defend the choice.
- **No-code and low-code paths — showcase** — Copilot agent builder and Copilot Studio live,
  on the same assignment; for each path: who hosts, who pays for the model, who governs,
  and what it cannot do.
- **Agents SDK core** — `AgentApplication`, `AgentApplicationOptions`, activities and turns,
  `TurnState`, channels; a first running agent locally, including error-path handling.

### Day 2 — The declarative maximum, knowledge, actions, and hygiene

- **Declarative agents & Agents Toolkit** — scaffolding and provisioning a declarative agent,
  instructions as orchestration without code, capabilities of the current manifest version,
  TypeSpec; the precisely named ceiling of the declarative path as the motivation for a
  custom engine.
- **Grounding: Copilot connectors, semantic index, MCP** — indexing principles for SharePoint
  and OneDrive content, synced vs. federated connectors, permission enforcement; wiring
  knowledge into the agent via the **Copilot Retrieval API** — and when not to do retrieval
  yourself.
- **Action handlers & Microsoft Graph integration** — action routing, parameter validation,
  permission boundaries (delegated vs. app-only), MCP as a tool.
- **Data hygiene in SharePoint Online and Exchange Online** — oversharing and permission
  sprawl, SharePoint Advanced Management, Restricted Content Discovery, sensitivity labels;
  a hygiene checklist before deploying an agent.

> Optional, subject to group pace: **Custom retrieval** — chunking, embeddings, hybrid
> semantic ranking, the latency vs. relevance trade-off, and the cost of owning an ACL model.

### Day 3 — Prompting, multi-agent, and policy

- **Prompt & system orchestration** — system/user/tool messages, few-shot, prompt chaining,
  the tool-call loop, evaluation heuristics.
- **Microsoft Agent Framework, workflows & multi-agent** — orchestration on top of the Agents
  SDK, patterns (sequence, fan-out, handoff, supervisor), A2A — and when **not** to split
  into multiple agents.
- **Middleware & policy enforcement** — pre/post processing, redaction, output filtering,
  safety filters and content moderation, hallucination mitigation patterns.

### Day 4 — Copilot Apps, hosting, Marketplace, and governance

- **SharePoint Copilot Apps** *(Public Preview)* — interactive UX directly in the Copilot
  canvas; SPFx 1.24, the MCP Apps model, Copilot Workbench, hosting automatically in the
  tenant; the shortest bridge between SPFx skills and the agent world.
- **Event-driven orchestration, hosting & publishing** — the agent endpoint (App Service /
  Azure Container Apps) vs. the orchestration around it (Functions, Durable Functions,
  Logic Apps, Foundry Agent Service); timeout and retry patterns, idempotency; the manifest
  as a versioned contract and publishing to Microsoft 365 Copilot and Teams.
- **Agents in the Marketplace — publishing conditions** — org catalog vs. Microsoft
  Marketplace / Agent Store, Partner Center, agent validation policies, the review process
  and the most common rejection reasons; case study of a real published agent
  (Normiqa Navigator).
- **Agent 365, Entra Agent ID & instrumenting a pro-code agent** — the agent control plane,
  identity and lifecycle, Agent 365 SDK and CLI, registry and observability, compliance and
  auditability, Foundry Control Plane vs. Agent 365.

### Day 5 — Governance alternative, quality, security, and capstone

- **Orchestry — a third-party governance alternative** — a structured comparison of
  first-party (Agent 365) and third-party governance: scope, identity, licensing, lock-in,
  roadmap risk; a decision framework for "when Microsoft first-party and when third-party".
- **Evaluation & quality** — qualitative vs. quantitative metrics, golden sets, regression
  tests, human-in-the-loop, evaluation and observability in Microsoft Foundry.
- **Security & risk management** — prompt injection and XPIA, exfiltration prevention, scope
  minimization, output sanitization, detection in the audit trail.
- **Performance, cost & lifecycle** — token economics, cache layers, retrieval optimization,
  resilience; environment promotion, versioning, rollback, model-exchange governance and
  deprecation planning.
- **Capstone architecture & roadmap** — end-to-end solution presentation, KPI and evaluation
  matrix review; next steps: the **AI-103** and **AI-200** certifications (current Microsoft
  Certification Poster; AI-500 Multi-Agent AI Solutions Expert as the advanced path).

## Course outcome

Participants leave with a working agent built on the Microsoft 365 Agents SDK and a deployment
blueprint: architecture, decisions with rationale, a tenant hygiene checklist, threat model
and defence layers, KPI and evaluation matrix, cost model, and rollback plan.

## Before publishing — editor checklist

- [ ] Set up a **301 redirect** from the current
      `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot` to the new URL above.
- [ ] Add the course price (GOPAS sales).
- [ ] **Remove all mentions of AI-102 and AZ-204** from the page — both exams are retired.
- [ ] Verify current product names (Microsoft Foundry, Copilot connectors, Agent 365) —
      Microsoft changes these within months.
- [ ] Verify, as of the publication date, the status of **SharePoint Copilot Apps**
      (SPFx 1.24, Public Preview — even the working name may change) and the AI-500 exam
      status (beta).
- [ ] Check that no "Editor note" block or the delta table was copied into the published text.

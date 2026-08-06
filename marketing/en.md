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
| "Vectorization & RAG design" as a required block | moved to an **optional** block | In Microsoft 365 the semantic index handles retrieval; custom vectorization is an architectural decision, not the default. |
| "Output sanitization and **watermarking**" | "**Prompt injection / XPIA**, exfiltration prevention" | Watermarking an agent's text responses offers no robust defensive value; injection through content is the real, current threat model. |
| "Responsible AI & governance" as a standalone block | merged into **Middleware & policy enforcement** + **Agent 365 and governance** | In a pro-code course a guardrail is code in a pipeline, not a separate lecture. Compliance belongs with the governance layer. |
| — (missing) | **Microsoft Agent Framework** (successor to Semantic Kernel + AutoGen), multi-agent, A2A | The layer a pro-code team actually uses on top of the Agents SDK. |
| — (missing) | **Agent 365, Entra Agent ID, instrumenting a pro-code agent** | GA 2026-05-01. The strongest pro-code topic: low-code agents register automatically, pro-code agents must be instrumented. |
| — (missing) | **Microsoft Foundry**, Foundry Agent Service | Renamed from Azure AI Foundry (Ignite 2025); publishing Foundry agents into M365 Copilot and Teams GA 06/2026. |
| — (missing) | positioning **Copilot Studio** on the decision axis | Customers ask about Copilot Studio; the course must build decision competence, not teach a single path. |

The structure changes from 15 blocks to **16** (15 required + 1 optional). Total length
remains 5 days.

## URL

`microsoft-365-agents-sdk-copilot-extensions-and-agent-365_spo_copilot`

> [!NOTE] Editor note
> New slug. Set up a **301 redirect** from the current
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Course title

Microsoft 365 Agents SDK, Copilot Extensions, and Agent 365

## Short description (meta description / teaser)

A pro-code course on building, securing, and operating agents on the Microsoft 365 Agents SDK
— from the decision axis and grounding, through multi-agent orchestration and middleware,
to Agent 365 instrumentation, evaluation, and cost modelling.

## Course overview

A five-day pro-code course for developers and architects building agents on Microsoft 365.
One agent is built across the whole week — from scaffolding in Microsoft 365 Agents Toolkit
and running locally in Agents Playground, through grounding over enterprise content (Copilot
connectors, semantic index, MCP), actions over Microsoft Graph with correct permission
boundaries, multi-agent orchestration in Microsoft Agent Framework, middleware that enforces
policy, to hosting, **instrumentation into Agent 365** with Entra Agent ID, golden-set
evaluation, prompt-injection defence, and a cost model.

The course is built around decision competence: when a declarative agent, when a custom
engine agent, when Copilot Studio, and when Microsoft Foundry — and how to defend that choice
to a customer and to an internal security team. Code is written in **C#**, with TypeScript
snippets for parity.

## Who this course is for

- Solution architects and AI engineers
- Microsoft 365 developers extending Copilot
- Technology consultants designing enterprise AI integrations
- Platform engineers enabling secure AI adoption

## Prerequisites

- C# fundamentals (GOC2125 course level) — **the course's primary language**
- JavaScript (JS_PROG1) and TypeScript (JS_TS1) basics — for parity snippets
- REST and JSON
- Azure and Microsoft 365 basics
- Microsoft Graph experience (advantageous)
- Prompt engineering experience (advantageous)

## Format and length

- 5 days, instructor-led with hands-on labs
- level: advanced
- code in **C#**, TypeScript snippets for parity

> [!NOTE] Editor note
> Price intentionally omitted — GOPAS sales fills it in directly in the CMS/price list.

## Course outline

### Day 1 — Stack map, environment, and the first agent

- **Onboarding, environment & toolchain** — VS Code, Microsoft 365 Agents Toolkit, .NET SDK,
  Agents Playground; the three billing models (Copilot licence, Copilot Credits, inference).
- **Agent build paths & the decision axis** — Copilot architecture; declarative vs. custom
  engine agents; Agents SDK, Agent Framework, Copilot Studio, Microsoft Foundry, Agent Builder
  — when to use which, and how to defend the choice.
- **Agents SDK core** — `AgentApplication`, `AgentApplicationOptions`, activities and turns,
  `TurnState`, channels; a first running agent locally, including error-path handling.

### Day 2 — Knowledge, actions, and prompting

- **Grounding: Copilot connectors, semantic index, MCP** — indexing principles for SharePoint
  and OneDrive content, synced vs. federated connectors, metadata enrichment, permission
  enforcement.
- **Action handlers & Microsoft Graph integration** — action routing, parameter validation,
  permission boundaries (delegated vs. app-only), Entra Agent ID, MCP as a tool.
- **Prompt & system orchestration** — system/user/tool messages, few-shot, prompt chaining,
  the tool-call loop, evaluation heuristics.

> Optional, subject to group pace: **Custom retrieval** — chunking, embeddings, hybrid
> semantic ranking, the latency vs. relevance trade-off, and the cost of owning an ACL model.

### Day 3 — Multi-agent, policy, and the manifest

- **Microsoft Agent Framework, workflows & multi-agent** — orchestration on top of the Agents
  SDK, patterns (sequence, fan-out, handoff, supervisor), A2A — and when **not** to split
  into multiple agents.
- **Middleware & policy enforcement** — pre/post processing, redaction, output filtering,
  safety filters and content moderation, hallucination mitigation patterns.
- **Manifest, capability declaration & channels** — the manifest as a versioned contract,
  TypeSpec, publishing to Microsoft 365 Copilot, Teams, and web; building a declarative agent
  for comparison.

### Day 4 — Hosting, governance, and quality

- **Event-driven orchestration & hosting** — Azure Functions vs. Logic Apps vs. Durable
  Functions vs. Foundry Agent Service; chaining model and tool calls, timeout and retry
  patterns, idempotency.
- **Agent 365, Entra Agent ID & instrumenting a pro-code agent** — the agent control plane,
  identity and lifecycle, Agent 365 SDK and CLI, registry and observability, compliance and
  auditability, Foundry Control Plane vs. Agent 365.
- **Evaluation & quality** — qualitative vs. quantitative metrics, golden sets, regression
  tests, human-in-the-loop, evaluation and observability in Microsoft Foundry.

### Day 5 — Security, cost, and capstone

- **Security & risk management** — prompt injection and XPIA, exfiltration prevention, scope
  minimization, output sanitization, detection in the audit trail.
- **Performance, cost & lifecycle** — token economics, cache layers, retrieval optimization,
  resilience; environment promotion, versioning, rollback, model-exchange governance and
  deprecation planning.
- **Capstone architecture & roadmap** — end-to-end solution presentation, KPI and evaluation
  matrix review, next steps (AI-103, AI-200, multi-agent patterns).

## Course outcome

Participants leave with a working agent built on the Microsoft 365 Agents SDK and a deployment
blueprint: architecture, decisions with rationale, threat model and defence layers, KPI and
evaluation matrix, cost model, and rollback plan.

## Before publishing — editor checklist

- [ ] Set up a **301 redirect** from the current
      `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot` to the new URL above.
- [ ] Add the course price (GOPAS sales).
- [ ] **Remove all mentions of AI-102 and AZ-204** from the page — both exams are retired.
- [ ] Verify current product names (Microsoft Foundry, Copilot connectors, Agent 365) —
      Microsoft changes these within months.
- [ ] Check that no "Editor note" block or the delta table was copied into the published text.

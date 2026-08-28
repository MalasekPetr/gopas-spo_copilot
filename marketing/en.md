# SPO_COPILOT — website content (gopas.eu)

> [!NOTE] Editor note
> Each "##" heading below corresponds to one field on the course page; the text under it is
> the content for that field. "Editor note" blocks themselves are not page content — do not
> copy them to the website.
>
> **Updated after the first delivery (week of 2026-08-24).** The outline below reflects what
> was actually taught, not the original plan.

## Delta — what changes versus the currently live page, and why

> [!NOTE] Editor note
> This section is **not** page content. It is the rationale for the approval round.

### Factual errors that need fixing

| Currently on the page | New | Reason |
| --- | --- | --- |
| Level **"Moderately advanced"** | **Advanced** | On day five participants write a middleware pipeline, validate writes to SharePoint through Graph, and defend a cost model. A moderately advanced attendee will not keep up and will leave disappointed. |
| Prerequisites start with **C#** | **TypeScript first**, C# only as an advantage | The whole week is written in TypeScript. C# appears only in a mention of the Agent Framework. The current order deters the right audience and attracts the wrong one. |
| "Next steps: **AI-102, AZ-204**" | **AI-103, AI-200** | Both exams are retired: AI-102 on 2026-06-30, AZ-204 on 2026-07-31. |

### Content changes

| Currently on the page | New | Reason |
| --- | --- | --- |
| "**Graph** connectors & metadata enrichment" | "**Copilot connectors** — synced and federated (MCP)" | Microsoft renamed the product and split it into two types with different architectures. |
| "Channels and **Azure Bot Service** adapters" | "Channels, activities and turns in the Agents SDK" | The role of Bot Service narrowed to channel registration. |
| "**Vectorization & RAG design**" as a required block (2.5 h) | accompanying material + a **measured retrieval block** on day 5 | The semantic index handles retrieval over tenant content. Instead of vectorization theory the course now shows a **measured comparison of three search APIs** and the decision of when to build retrieval yourself. |
| "Output sanitization and **watermarking**" | "**Prompt injection / XPIA**, exfiltration prevention" | Watermarking an agent's text responses offers no robust defensive value; injection through content is the real threat model. |
| "**Responsible AI & governance**" as a standalone block (2.5 h) | dissolved into **Security & middleware** + **Agent 365** | In a pro-code course a guardrail is code in a pipeline, not a separate lecture. |
| "Security" and "Middleware" as two blocks | **one block: "attack and defence as code"** | Both taught the same thing from opposite sides. Together they have a dramaturgy: attack → why the prompt does not hold → middleware → scope. |
| "Event-driven orchestration", "Deployment & lifecycle management" as blocks | **accompanying material** | Would require an Azure subscription per attendee. The substance ("where the endpoint runs vs. the orchestration around it") is folded into the Agent 365 block. |
| — (missing) | **Skills — extending Copilot in SharePoint** | The lowest rung of extending Copilot: `SKILL.md`, no runtime, governed by file permissions. This audience manages SharePoint content. |
| — (missing) | **SharePoint agents** as a full path | An agent created with one click over a library is the closest entry point for this audience — including its ceiling. |
| — (missing) | **no-code/low-code showcase and the declarative ceiling** before pro-code | Developers first judge Agent Builder and Copilot Studio live and exhaust the declarative path — only where it ends do they reach for the SDK. |
| — (missing) | **data hygiene in SharePoint Online and Exchange Online** | An agent does not break permissions, it makes them visible. Practice raises this question before grounding. |
| — (missing) | **application identity** — app registrations, permissions, single/multi-tenant, tokens | The first delivery group asked for this as a dedicated session. Without it the agent's permission boundary cannot be defended. |
| — (missing) | **Microsoft Agent Framework**, A2A and **Foundry Agent Service** | The orchestration layer above the Agents SDK and the PaaS branch of the map. |
| — (missing) | **SharePoint Copilot Apps** (SPFx, Public Preview) — *optional block* | The shortest bridge between SPFx skills and the world of agents. |
| — (missing) | **distribution through Microsoft Marketplace** incl. a case study | Publishing terms, Partner Center, validation process — on a real published listing, not a slide. |
| — (missing) | **Agent 365, Entra Agent ID, instrumenting a pro-code agent** | GA on 2026-05-01. Low-code agents register automatically; pro-code agents must be instrumented. |
| — (missing) | **a measured cost model and ROI** | Attendees leave with their own numbers from the week, not an estimate. |

The structure changes from 15 blocks of 2.5 h each to **daily blocks of varying length**
(3–6 per day) plus accompanying self-study material. The length stays at 5 days.

## URL

`microsoft-365-agents-sdk-copilot-extensions-and-agent-365_spo_copilot`

> [!NOTE] Editor note
> New slug. Set up a **301 redirect** from the current
> `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`.

## Course title

Microsoft 365 Agents SDK, Copilot Extensions and Agent 365

## Short description (meta description / teaser)

A pro-code course on building, securing and operating agents in the near surroundings of
Microsoft 365. One agent is built across the whole week — from deciding which path to take
at all, through grounding over company content and actions over Microsoft Graph, to
middleware, instrumentation into Agent 365, evaluation and a cost model backed by your own
measurements.

## Course overview

A five-day pro-code course for developers and architects who build agents in the near
surroundings of Microsoft 365. **One agent is built across the whole week** — a Support
Assistant over company runbooks — gaining one layer each day.

The course starts where a real project starts: **with the decision of which path to take**.
Participants assess Skills, SharePoint agents, Copilot Agent Builder and Copilot Studio live,
build a declarative agent in the Microsoft 365 Agents Toolkit and **hit its ceiling** — only
there do they reach for the Agents SDK. They then defend that decision for the rest of the week.

Next comes the core of the Agents SDK and local execution in the Agents Playground,
application identity and permission boundaries, grounding over company content through
Microsoft Graph, actions that write to SharePoint with parameter validation, the system
prompt as a contract, and **an attack on your own agent** — after which it is obvious why a
defence written into the prompt does not hold and what a defence in code looks like. The last
day adds multi-agent orchestration and Foundry Agent Service, instrumentation into Agent 365
with Entra Agent ID, evaluation with a golden set, and a defence of the numbers.

**Everything is measured.** From Wednesday the agent logs its token consumption; on Friday
each participant computes cost per query, monthly running cost and the return on their own
solution. They leave with their own numbers rather than an estimate — and with what can be
said to a customer on the strength of them.

The course is built on decision-making competence: when a declarative agent, when a custom
engine, when Copilot Studio and when Microsoft Foundry — and how to defend that choice to a
customer and to an internal security team. Code is written in **TypeScript** (Node.js,
Microsoft 365 Agents SDK).

## Who this course is for

- Solution architects and AI engineers
- Microsoft 365 developers extending Copilot
- Technology consultants designing enterprise AI integrations
- Platform engineers enabling safe AI adoption

## Prerequisites

- **JavaScript (JS_PROG1) and TypeScript (JS_TS1) fundamentals** — the primary language of the course
- REST and JSON
- Azure and Microsoft 365 fundamentals
- Experience with Microsoft Graph — an advantage
- Experience with prompt engineering — an advantage
- C# fundamentals (GOC2125 level) — an advantage, only for Agent Framework mentions

## Format and length

- 5 days, instructor-led with hands-on labs
- level: **advanced**
- code in **TypeScript** (Node.js)

> [!NOTE] Editor note
> Price intentionally omitted — the GOPAS sales department fills it in directly in the CMS.

## Course outline

### Day 1 — Mapping the stack and the no-code/low-code paths

- **Onboarding, environment & toolchain** — VS Code, Microsoft 365 Agents Toolkit, Node.js,
  Agents Playground; three billing models (Copilot licence, Copilot Credits, inference).
- **Map of agent-building paths & the decision axis** — Copilot architecture; declarative vs.
  custom engine agent; Agent Builder, SharePoint agents, the declarative agent from the
  Toolkit, Copilot Studio, Agents SDK and Foundry Agent Service — when to use which and how
  to defend the choice.
- **No-code and low-code paths — showcase** — Agent Builder and Copilot Studio live on the
  same brief; for each path: who hosts, who pays for the model, who governs and what is
  out of reach.

### Day 2 — Copilot in SharePoint and the declarative ceiling

- **Skills — extending Copilot in SharePoint** — anatomy of `SKILL.md`, authoring in chat,
  review and run; governance without an admin switch (governed by file permissions).
- **SharePoint agents** — an agent over a library in one click, its ceiling, sharing to Teams.
- **Declarative agents & the Agents Toolkit** — scaffolding and provisioning, instructions as
  orchestration without code, manifest capabilities, ALM and repo-as-code; **a precisely named
  ceiling** of the declarative path as the motivation for a custom engine.
- **Data hygiene in SharePoint Online and Exchange Online** — oversharing and permission
  sprawl, SharePoint Advanced Management, Restricted Content Discovery, sensitivity labels;
  a hygiene checklist before deploying an agent.
- **Agents in Microsoft Marketplace** — org catalogue vs. Marketplace, Partner Center,
  the validation process and the most common rejection reasons; a case study of a real
  published agent.

### Day 3 — The first agent in code, and knowledge

- **Agents SDK — the core** — `AgentApplication`, activities and turns, `TurnState`, channels;
  the first agent running locally including error handling; Microsoft Foundry in brief.
- **Application identity** — app registrations, delegated vs. application permissions,
  single/multi-tenant, Enterprise applications, tokens and scopes; the boundary no prompt
  can talk its way past.
- **Grounding over company content** — Copilot connectors (synced vs. federated), the semantic
  index and permission enforcement, MCP; wiring knowledge into the agent **live over a company
  library** — and when not to build retrieval yourself.

### Day 4 — Actions, prompt and security

- **Action handlers & Microsoft Graph integration** — routing actions, **parameter validation
  before the write**, writing to SharePoint, the requester taken from the caller's identity;
  delegated vs. app-only and what each boundary means for auditability.
- **Prompt & system orchestration** — the system prompt as a contract, few-shot for format,
  the tool-call loop and rounds within a turn, a measured baseline for the rest of the week.
- **Security & middleware — attack and defence as code** — prompt injection and XPIA through
  content, a ladder of attacks on your own agent; the middleware pipeline, pre/post
  processing, PII redaction, link allow-listing and citation verification; scope minimisation
  as the only boundary that cannot be talked around.
- **SharePoint Copilot Apps** *(Public Preview, optional block)* — interactive UX directly in
  the Copilot canvas; SPFx, the MCP Apps model, hosting automatic in the tenant.

### Day 5 — Orchestration, governance, quality and capstone

- **Revisiting the decision map** — after four days of practice, this time as a decision tool:
  what each path costs and what specifically would change the choice.
- **Microsoft Agent Framework, A2A and Foundry Agent Service** — orchestration above the
  Agents SDK, patterns and their price, when **not** to use more agents; the PaaS branch of
  the map and two control planes.
- **Agent 365, Entra Agent ID & instrumenting a pro-code agent** — the control plane for
  agents, identity and lifecycle, registry and observability, compliance and auditability;
  a comparison with third-party governance and a framework for "when first-party and when
  third-party".
- **Retrieval in practice — what can be measured** — three different Microsoft 365 search
  interfaces and how they differ on the same content; why the content format decides the
  quality of grounding; how to recognise a silent failure and why it costs more than a loud one.
- **Evaluation & quality** — a golden set and regression tests, deterministic policies vs.
  judging answers, variance between runs and release thresholds, human-in-the-loop.
- **Capstone architecture & roadmap** — a blueprint of the end-to-end solution, KPIs and an
  evaluation matrix, **a cost model and ROI from your own measured data**, a threat model and
  a rollback plan; next steps: the **AI-103** and **AI-200** certifications.

### Accompanying self-study material

Participants also receive complete modules that extend the taught material and are written
to be worked through independently:

- **Custom retrieval** — chunking, embeddings, hybrid ranking, security trimming and the
  latency-versus-relevance trade-off.
- **Hosting and publishing** — the agent endpoint vs. the orchestration around it, timeout and
  retry patterns, idempotence, publishing to channels.
- **Performance, cost & lifecycle** — token economics, cache layers, versioning, rollback,
  governance of model swaps.
- **Multi-agent lab** — hand-built triage + resolver orchestration over the Agents SDK and a
  measurement of what the split cost.
- **Comparison of agent-building paths** — a capability-by-capability difference matrix.
- **Third-party governance** — a comparison framework alongside Agent 365.
- **Prompting fundamentals and agent anatomy** — anatomy of a prompt, layers of instructions.

## Course outcome

Participants leave with **a working agent** built on the Microsoft 365 Agents SDK — grounding
over company content, actions that write through Graph, middleware enforcing policies — and
with **a blueprint for its deployment**: architecture, decisions including their rationale,
a tenant hygiene checklist, a threat model and defence layers, KPIs and an evaluation matrix,
**a cost model and ROI computed from their own measured data**, and a rollback plan.

## Before publishing — editor checklist

- [ ] Set up a **301 redirect** from the current `microsoft-365-agents-sdk-a-copilot-extensions_spo_copilot`
      to the new URL above.
- [ ] Change the level from "Moderately advanced" to **"Advanced"**.
- [ ] Move **TypeScript ahead of C#** in the prerequisites.
- [ ] **Remove the AI-102 and AZ-204 mentions** — both exams are retired.
- [ ] Add the course price (GOPAS sales department).
- [ ] Verify current product names (Microsoft Foundry, Copilot connectors, Agent 365) —
      Microsoft changes them on a scale of months.
- [ ] Verify, as of the publication date, the status of **SharePoint Copilot Apps**
      (Public Preview) and of the AI-500 exam (beta).
- [ ] Check that no "Editor note" block or delta table was copied into the published text.

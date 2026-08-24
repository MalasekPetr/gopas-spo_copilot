# Prostředí kurzu — tenant, PAYG a model endpoint

Referenční údaje o prostředí, na které se odkazují laby.

> [!IMPORTANT] Publikace
> Repo je **public** — tento soubor obsahuje jen student-facing část. Instructor-only údaje
> (tenant ID, admin účet, model rolí, lifecycle účtů, app registrace se secrety/certifikáty,
> Azure subscription ID, API klíče modelu) jsou drženy **mimo repo**, v instruktorském kanálu.
> Sekretový povrch je tu větší než u administrátorských kurzů — přidávají se app registrace,
> cert thumbprinty a klíče k modelu.

## Student-facing — M365 tenant

| Položka | Hodnota |
|---|---|
| Tenant (org) | Malach IS |
| Přihlašovací doména | `spdemo.online` |
| Účty studentů | `user.11@spdemo.online` – `user.30@spdemo.online` (user 11–30) |
| Licence | Microsoft 365 **Business Basic** |
| AI | Copilot přes **Pay-as-you-go** (Copilot Credits) |
| Hesla | přidělena na začátku kurzu |
| SharePoint root URL | `https://ms365x17157302.sharepoint.com` |

## Model endpoint — instruktorský Foundry deployment (rozhodnuto 2026-08-24)

> [!IMPORTANT] Proč vlastní endpoint
> **Copilot Credits neplatí volání modelu z vlastního kódu.** Business Basic + PAYG dává
> Copilot zážitky a deklarativní agenty, ale **nedává inference endpoint** pro custom engine
> agenta postaveného na Agents SDK. Na endpointu stojí hands-on **8 z 21 modulů**:
> `agents-sdk-core`, `prompt-orchestration`, `agent-framework`, `middleware-policy`,
> `event-driven-hosting`, `evaluation-quality`, `security-risk`, `perf-cost-lifecycle`.

Řešení: **jeden model deployment (mini tier) v instruktorské Azure subscription**, bez
požadavku na Azure subscription nebo Global admin u studentů. Provozní pravidla:

- **Hard cap na deploymentu** (TPM/RPM quota) nastavený předem — jediné reálné nákladové
  riziko je 20 studentů ve smyčce; alerty samy spotřebu nezastaví.
- **Klíče per student, výhradně mimo repo** (rozdává instruktor; user secrets / `.env`).
- **Po kurzu klíče rotovat/zneplatnit** — povinný krok offboardingu (viz
  [`scripts/`](scripts/)); klíče byly u 20 lidí.
- Orientační náklad: mini-tier model, laby celého týdne ≈ nízké desítky USD.

Fallback pro jednotlivce (rozbitý klíč, výpadek): **GitHub Models** na studentském GitHub
účtu — jen jako záchrana jednoho studenta, ne kurzovní cesta (free tier rate limity by
zastavily multi-agent lab D3 i evaluace D5).

> [!IMPORTANT] Data sovereignty
> Instruktorský model endpoint znamená inference **mimo studentský tenant**. V labech proto
> jen **kurzovní demo data** — nikdy reálná zákaznická ani personální data. Platí i pro
> promptové ukázky a golden set v `evaluation-quality`.

## Matice požadavků per blok

Co který modul reálně potřebuje pod baseline `spdemo.online` + PAYG:

| Modul | M365 tenant | Model endpoint | Azure subscription | Režim |
|---|---|---|---|---|
| `day-1/onboarding` | ano | — | — | hands-on |
| `day-1/agent-landscape` | — | — | — | hands-on (rozhodovací lab, bez kódu) |
| `day-1/no-code-showcase` | ano (agent builder na PAYG; Studio = licence/trial instruktora) | — | — | hands-on (builder) + **demo** (Studio) |
| `day-1/agents-sdk-core` | — | **ano** | — | hands-on (Agents Playground, bez tenantu) |
| `day-2/declarative-agents` | ano | — | — | hands-on (deklarativní agent na PAYG) |
| `day-2/knowledge-grounding` | ano | ano | — | hands-on |
| `day-2/actions-graph` | ano | ano | — | hands-on |
| `day-2/data-hygiene` | ano (SAM v tenantu funguje) | — | — | **instruktorské demo** živě + checklist |
| `day-2/opt-custom-retrieval` | — | ano | **ano** | **instruktorské demo** |
| `day-3/prompt-orchestration` | — | **ano** | — | hands-on |
| `day-3/agent-framework` | — | **ano** | — | hands-on |
| `day-3/middleware-policy` | — | **ano** | — | hands-on |
| `day-4/spfx-copilot-apps` | — (lokálně Workbench; deploy = demo instruktora) | — | — | hands-on (preview toolchain) |
| `day-4/event-driven-hosting` | ano (publikace) | ano | **ano** | **instruktorské demo** (rezilience lokálně hands-on) |
| `day-4/marketplace-agents` | — (Partner Center instruktora) | — | — | **instruktorské demo** + checklist |
| `day-4/agent-365-governance` | ano | — | ano + **Agent 365 licence** | **instruktorské demo** |
| `day-5/orchestry-governance` | — (Orchestry trial potvrzen) | — | — | **instruktorské demo** živě |
| `day-5/evaluation-quality` | — | **ano** | — | hands-on (lokální golden set) |
| `day-5/security-risk` | — | **ano** | — | hands-on |
| `day-5/perf-cost-lifecycle` | — | **ano** | — | hands-on |
| `day-5/capstone` | — | — | — | hands-on (design dokument) |

Devět bloků je pod touto baseline **instruktorské demo** (showcase/srovnávací formáty
mají vždy studentský deliverable — checklist nebo tabulku — nezávislý na licencích).
Pokud se Azure subscription pro studenty objeví, hands-on kandidáti se upgradují
**bez zásahu do struktury kurzu** — jen se změní režim v labu.

> [!NOTE] Business Basic nemá desktop Office — ale to kurzu nevadí. Pro-code práce běží
> ve VS Code a Agents Playground lokálně; tenant se používá pro knowledge, Graph a publikaci
> deklarativního agenta.

## Lokální toolchain studenta

Zajišťuje `day-1/onboarding`. Bez tohoto nic dalšího nepojede:

| Nástroj | Účel |
|---|---|
| **Visual Studio Code** | primární IDE |
| **Microsoft 365 Agents Toolkit** (rozšíření VS Code) | scaffolding, publikace, MCP |
| **Node.js** (LTS) | TypeScript je primární jazyk kurzu (sjednoceno 2026-08-24) |
| **Microsoft 365 Agents Playground** | lokální test agenta bez tenantu a tunelu |
| **Git** | repo-as-code návyk, capstone artefakty |
| **GitHub Copilot** | volitelné, vlastní licence mimo M365 |

> [!WARNING] Ověřit k datu běhu
> Verze Agents Toolkitu, Node.js LTS a názvy šablon v Toolkitu se mění po měsících. Projít
> `day-1/onboarding/instructor-notes.md` go/no-go a scaffoldnout referenční projekt den předem.

## Náklady — PAYG upozornění pro učebnu

> [!WARNING] Ověřit k datu běhu.
> Copilot Credits ($0,01/kredit) čerpá **každá reálná** interakce (grounding, generative answer,
> tool call) — orientačně ~12 kreditů/konverzace. **Žádný tvrdý strop** (alerty nezastaví
> spotřebu). Při 20 studentech se to sčítá — mít nastavený budget alert.
>
> **Navíc** k tomu jdou tokeny modelu z instruktorského Foundry deploymentu (výše). To je
> **druhá, oddělená** nákladová položka — přesně ten teaching point, který kurz učí
> (viz [`GLOSSARY.md`](GLOSSARY.md), sekce „tři různé peněženky").

## Otevřené položky před prvním během

- [x] **Model endpoint** — rozhodnuto (2026-08-24): **instruktorský Foundry deployment**
      s hard capem; nasadit a otestovat z učebny večer D1, klíče rozdat ráno D2.
- [ ] **GitHub Copilot seaty** pro studenty (mimo M365 licenční tok, zajistit dopředu).
- [x] **Agent 365 licence** — rozhodnuto (2026-08-07): **1× licence jen pro lektora**
      ($15/user/měs, ověřit prerekvizity). Demo v `agent-365-governance` jede živě
      z lektorského účtu; studenti instrumentují proti mocku (Fáze 2 artefakt).
- [ ] Ověřit, že **provisioning deklarativního agenta** na PAYG bez Copilot licence stále
      funguje (empiricky potvrzeno 2026-07-17 na jiném běhu; Microsoft to takto nedokumentuje).
- [ ] Demo data pro nosný scénář nasazená (viz [`scripts/`](scripts/)).

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

Řešení: **jeden model deployment v instruktorské Azure subscription**, bez požadavku
na Azure subscription nebo Global admin u studentů.

Nasazeno 2026-08-25 (konkrétní endpoint a klíč jsou instructor-only, mimo repo):

| Položka | Hodnota |
|---|---|
| Subscription | `SPDemo.online PAYG` — adresář **`spdemo.online`**, ne malachiský tenant |
| Resource group | `rg-spo-copilot-course` (samostatná — cleanup jedním příkazem) |
| Region | `westeurope` |
| Model | `gpt-5-mini`, verze `2025-08-07` |
| SKU | **`DataZoneStandard`** — inference zůstává v EU datové zóně, ne global routing |
| Deployment name | `support-agent` |
| Capacity | 100 (= 100k TPM); kvóta subscription 300 |

Provozní pravidla:

- **Hard cap na deploymentu** (capacity) nastavený předem — jediné reálné nákladové
  riziko je 20 studentů ve smyčce. Capacity ale omezuje **rychlost, ne celkovou útratu**;
  proto navíc **budget alert na resource group**.
- **Klíče per student, výhradně mimo repo** (rozdává instruktor; user secrets / `.env`).
- **Po kurzu smazat celou resource group** — `az group delete -n rg-spo-copilot-course`.
  Tím odpadá i rotace klíčů, protože zdroj přestane existovat.
- Orientační náklad: mini-tier model, laby celého týdne ≈ nízké desítky USD.

> [!WARNING] `gpt-5-mini` je reasoning model — má to dva praktické důsledky
> **Reasoning tokeny se počítají do `max_completion_tokens`.** Změřeno na tomto deploymentu:
> při limitu 16 spotřebovalo reasoning všech 16 tokenů, `finish_reason` byl `length`
> a odpověď přišla **prázdná** s HTTP 200. Při 200 tokenech (128 reasoning) i 800
> (64 reasoning) odpověď v pořádku. **V labech nastavovat aspoň 400–800** — jinak student
> vidí agenta, který „běží a nic neříká", a hledá chybu ve svém kódu.
>
> Reasoning modely rovněž vyžadují **`max_completion_tokens`, ne `max_tokens`**.
>
> Do `perf-cost-lifecycle` je to konkrétní vstup: platíš i tokeny, které nevidíš.

Fallback pro jednotlivce (rozbitý klíč, výpadek): **GitHub Models** na studentském GitHub
účtu — jen jako záchrana jednoho studenta, ne kurzovní cesta (free tier rate limity by
zastavily multi-agent lab D3 i evaluace D5).

> [!IMPORTANT] Data sovereignty — poctivě
> Azure subscription je ve **stejném Entra adresáři** (`spdemo.online`) jako studenti,
> takže zdroj spadá pod tutéž governance. To ale **neznamená, že data zůstávají
> v M365 tenantu**: co pošleš do modelu, opouští hranici SharePointu a Graphu a jde
> do Azure. SKU `DataZoneStandard` drží zpracování v EU datové zóně — ne globálně.
>
> Praktické pravidlo zůstává: v labech jen **kurzovní demo data**, nikdy reálná zákaznická
> ani personální. Platí i pro promptové ukázky a golden set v `evaluation-quality`.
>
> Pro zákaznická jednání je tohle přesně ten rozdíl, který kurz učí: *„v tenantu"*
> u Copilotu (semantic index, Retrieval API) vs. *„ve tvé Azure subscription"*
> u custom engine agenta. Dvě různé hranice, dvě různé odpovědi pro security tým.

## Matice požadavků per blok

Co který modul reálně potřebuje pod baseline `spdemo.online` + PAYG:

| Modul | M365 tenant | Model endpoint | Azure subscription | Režim |
|---|---|---|---|---|
| `onboarding` | ano | — | — | hands-on |
| `agent-landscape` | — | — | — | hands-on (rozhodovací lab, bez kódu) |
| `no-code-showcase` | ano (agent builder na PAYG; Studio = licence/trial instruktora) | — | — | hands-on (builder) + **demo** (Studio) |
| `agents-sdk-core` | — | **ano** | — | hands-on (Agents Playground, bez tenantu) |
| `declarative-agents` | ano | — | — | hands-on (deklarativní agent na PAYG) |
| `knowledge-grounding` | ano | ano | — | hands-on |
| `actions-graph` | ano | ano | — | hands-on |
| `data-hygiene` | ano (SAM v tenantu funguje) | — | — | **instruktorské demo** živě + checklist |
| `opt-custom-retrieval` | — | ano | **ano** | **instruktorské demo** |
| `prompt-orchestration` | — | **ano** | — | hands-on |
| `agent-framework` | — | **ano** | — | hands-on |
| `middleware-policy` | — | **ano** | — | hands-on |
| `spfx-copilot-apps` | — (lokálně Workbench; deploy = demo instruktora) | — | — | hands-on (preview toolchain) |
| `event-driven-hosting` | ano (publikace) | ano | **ano** | **instruktorské demo** (rezilience lokálně hands-on) |
| `marketplace-agents` | — (Partner Center instruktora) | — | — | **instruktorské demo** + checklist |
| `agent-365-governance` | ano | — | ano + **Agent 365 licence** | **instruktorské demo** |
| `orchestry-governance` | — (Orchestry trial potvrzen) | — | — | **instruktorské demo** živě |
| `evaluation-quality` | — | **ano** | — | hands-on (lokální golden set) |
| `security-risk` | — | **ano** | — | hands-on |
| `perf-cost-lifecycle` | — | **ano** | — | hands-on |
| `capstone` | — | — | — | hands-on (design dokument) |

Devět bloků je pod touto baseline **instruktorské demo** (showcase/srovnávací formáty
mají vždy studentský deliverable — checklist nebo tabulku — nezávislý na licencích).
Pokud se Azure subscription pro studenty objeví, hands-on kandidáti se upgradují
**bez zásahu do struktury kurzu** — jen se změní režim v labu.

> [!NOTE] Business Basic nemá desktop Office — ale to kurzu nevadí. Pro-code práce běží
> ve VS Code a Agents Playground lokálně; tenant se používá pro knowledge, Graph a publikaci
> deklarativního agenta.

## Lokální toolchain studenta

Zajišťuje `onboarding`. Bez tohoto nic dalšího nepojede:

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
> `onboarding/instructor-notes.md` go/no-go a scaffoldnout referenční projekt den předem.

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

- [x] **Model endpoint** — nasazeno (2026-08-25): `gpt-5-mini` / `DataZoneStandard` /
      capacity 100 v `rg-spo-copilot-course`. Smoke test prošel, deployment `Succeeded`.
- [ ] **Otestovat endpoint ze stroje v učebně** — smoke test běžel z lektorského notebooku,
      takže ověřil klíč a deployment, **ne firewall a proxy**.
- [x] **Budget alert na `rg-spo-copilot-course`** (2026-08-25) — `budget-spo-copilot-course`,
      **100 EUR/měsíc**, prahy: 50 % a 80 % skutečné útraty + 100 % prognózované.
      Prognózovaný práh chytí runaway dřív než skutečný. Capacity omezuje rychlost,
      budget hlídá útratu — dvě nezávislé brzdy.
- [ ] **GitHub Copilot seaty** pro studenty (mimo M365 licenční tok, zajistit dopředu).
- [x] **Agent 365 licence** — rozhodnuto (2026-08-07): **1× licence jen pro lektora**
      ($15/user/měs, ověřit prerekvizity). Demo v `agent-365-governance` jede živě
      z lektorského účtu; studenti instrumentují proti mocku (Fáze 2 artefakt).
- [ ] Ověřit, že **provisioning deklarativního agenta** na PAYG bez Copilot licence stále
      funguje (empiricky potvrzeno 2026-07-17 na jiném běhu; Microsoft to takto nedokumentuje).
- [x] **Demo data pro nosný scénář nasazená** (2026-08-25) — knihovna `Runbooky` a list
      `Zaměstnanci` na `/sites/hr-demo`. Provisionováno skriptem `New-HRAgentData.ps1`
      z repa `gopas-goc224`, ne `New-SupportAgentData.ps1` — ten v `scripts/` zatím
      neexistuje (viz [`scripts/`](scripts/)).

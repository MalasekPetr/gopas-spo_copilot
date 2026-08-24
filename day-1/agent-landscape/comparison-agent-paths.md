# Srovnání schopností agentů podle cesty tvorby

> Modul: `agent-landscape` · Doplněk k tabulce pěti cest v [`README.md`](README.md) · Stav ověřen k 2026-07
> Prostředí: viz [`../../environment.md`](../../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../../GLOSSARY.md)

> [!NOTE] Referenční dokument, ne blok
> Převzato z kurzu GOC224 (2026-08-24). Ve výkladu se neprochází — studenti ho dostanou
> jako referenci. Je **detailnější než tabulka pěti cest** v README a jako jediný materiál
> kurzu pokrývá **SharePoint agenty** jako plnohodnotnou cestu. Odkazy na dny níže patří
> GOC224; v tomto kurzu odpovídají `data-hygiene` (RSS/RCD) a `agent-365-governance`.

Čtyři cesty vedou ke stejnému cíli (deklarativní agent na orchestrátoru M365 Copilot — výjimka viz custom engine níže), ale **schopnosti se liší víc, než mapa cest naznačuje**. Tohle je rozdílová tabulka pro rozhodnutí „čím stavět".

## Srovnávací matice

| Schopnost | **Agent Builder** | **Copilot Studio** (new exp.) | **Agents Toolkit** (VS Code) | **SharePoint agents** |
| --- | --- | --- | --- | --- |
| **SharePoint soubory/weby** | ✅ až 100 souborů/složek/webů | ✅ weby real-time nebo upload se sync | ✅ URL / SharePoint IDs (site, knihovna, složka, soubor) | ✅ zdroje z webu |
| **SharePoint listy** | ✅ **1 list** (20k položek / 50 MB; přílohy se neindexují) | ✅ **až 10 listů**, ~120k řádků celkem; **analytické/agregační dotazy** | ❌ list jako tabulku manifest nezná (`list_id` = **knihovna**, ne list — schema 1.7); tabulková data jen přes `Dataverse`/konektor/akci | ✅ **1 list — a nic jiného** (přidání listu odstraní ostatní zdroje; MC1255409) |
| **Dataverse** | ❌ | ✅ nativní | ✅ capability `Dataverse` (tabulky v manifestu) | ❌ |
| **Copilot konektory** | ✅ vč. scopování atributem | ✅ | ✅ + **KQL filtr** (`additional_search_terms`), scoping per item/container | ❌ |
| **Teams / e-mail / People / schůzky** | ✅ (Teams 5 chatů, e-mail bez scopování) | částečně (přes konektory/tools) | ✅ nejjemnější: e-mail per složka + **shared/group mailboxy**, schůzky per ID, People s related content | ❌ |
| **Web search** | ✅ 4 URL | ✅ | ✅ 4 sites | ❌ |
| **Akce / tools** | omezené (API pluginy přes rozšíření) | ✅ **nejsilnější**: Power Platform konektory, HTTP, **MCP**, agent flows, triggery (autonomní scénáře) | ✅ API pluginy (OpenAPI manifest), MCP; 1–10 akcí | ❌ (jen Q&A nad obsahem) |
| **Orchestrace / model** | orchestrátor M365 Copilot | **vlastní orchestrace** (generative vs. classic), volba modelu, potlačení obecných znalostí modelu | orchestrátor M365 Copilot + manifest overrides (viz níže) | orchestrátor M365 Copilot |
| **ALM / source control** | ❌ (osobní nástroj) | částečně (solutions, environmenty) | ✅ **repo-as-code**: manifest v gitu, CI/CD, provisioning | ❌ (.agent soubor na webu) |
| **Multi-agent** | ❌ | ✅ (connected agents, worker koncepty) | ✅ `worker_agents` v manifestu (preview) | ❌ |
| **Publikace** | sdílení + org katalog (ne marketplace) | org katalog, marketplace, **kanály mimo M365** (web, custom app) | org katalog, marketplace | jen web (+ sdílení do Teams chatu) |
| **Licence tvorba/použití** | Copilot licence nebo PAYG tenant | Copilot Studio přístup (Copilot Credits / PAYG) | tvorba zdarma; použití licence/kredity | tvorba: Copilot licence; použití: licence **nebo PAYG meter** |
| **Governance páky** | admin approval do katalogu | **DLP v Power Platform admin centru** (enforcement povinný), kanály, auth | RAI validace balíčku, admin approval, audit v repu | RCD/RSS na webu, SAM reporty (D3/D4) |

Průřezově pro všechny: **permission trimming** (agent nikdy nepřekročí práva uživatele), sensitivity labels respektovány, **Restricted SharePoint Search blokuje SharePoint knowledge úplně** a RCD vyřazuje web z groundingu (D2 explainer).

## Co má každá cesta exkluzivně

- **Copilot Studio**: analytika nad listy (jediná cesta na agregační dotazy „průměr/počet/max"), plná kontrola orchestrace vč. blokace obecných znalostí modelu (Agent Builder umí jen *prioritizovat* — „Only use specified sources" negarantuje), DLP integrace, autonomní triggery, kanály mimo M365.
- **Agents Toolkit**: manifest-only funkce, které v žádném UI nejsou — `editorial_answers` (až 300 předdefinovaných Q&A párů), `behavior_overrides.special_instructions.discourage_model_knowledge`, `default_response_mode` (Quick/Think deeper), `user_overrides` (uživatelské vypínače capabilities), scoping e-mailu na sdílené mailboxy a schůzek per ID. A jako jediná cesta vede i na **custom engine agenta** (vlastní orchestrátor/model/hosting — mimo deklarativní model).
- **Agent Builder**: nulová bariéra — agent za minuty přímo v Copilot appce, embedded files z disku (pozor: sdílením agenta sdílíš obsah souborů), automatická tvorba z popisu.
- **SharePoint agents**: jediná cesta, kde agenta staví **vlastník obsahu bez opuštění webu**; agent žije s webem (permissions, lifecycle) a použití jde přes PAYG i pro nelicencované.

## Rozhodovací osa (rozšíření tabulky z README)

1. **Potřebuješ data z listů?** analytika → Copilot Studio (10 listů) · lookup → Agent Builder (1 list + jiné zdroje) · „agent nad jedním listem a ničím jiným" → SharePoint agent · Toolkit → ne (čekat na schema 1.8+, sledovat [manifest changelog](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.7)).
2. **Potřebuješ akce/automatizaci?** konektory/MCP/triggery → Copilot Studio · vlastní API s OpenAPI → Toolkit · žádné akce → Builder/SharePoint agent.
3. **Potřebuješ source control a CI/CD?** → Toolkit, bez diskuze (repo-as-code přístup kurzu).
4. **Kdo staví?** koncový uživatel → Builder · vlastník webu → SharePoint agent · maker → Studio · vývojář → Toolkit.
5. **Kdo platí?** tenant bez Copilot licencí (náš případ): vše jede na Copilot Credits / PAYG — každý testovací dotaz stojí kredity, proto evaluační plán z labu.

## Zdroje (Microsoft)

[Agent Builder — knowledge](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge) · [Copilot Studio — SharePoint lists (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/knowledge-sharepoint-lists) · [Declarative agent manifest 1.7](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.7) · [SharePoint agents](https://learn.microsoft.com/en-us/sharepoint/get-started-sharepoint-agents) · [MC1255409 — Lists as knowledge source](https://mc.merill.net/message/MC1255409) · [Generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions) · [DLP for Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-07.
> Nejrychleji se hýbe podpora listů: SharePoint agents ji dostaly GA ~05/2026 (MC1255409), ale admin dokumentace ji k 2026-06-25 ještě nereflektuje — ukázat studentům jako příklad docs lag. Copilot Studio listy = production-ready preview. Manifest **schema 1.8 k 2026-07 neexistuje** (ověřeno: Learn 404, JSON schema endpoint 404, docs repo bez PR) — listy pro Toolkit tedy zatím nikde neavizovány. `EmbeddedKnowledge` v manifestu 1.7 je popsané, ale označené „not yet available". `worker_agents` = preview.

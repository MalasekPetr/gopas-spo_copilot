# Skills — rozšíření Copilot in SharePoint

> Typ: povinný · Den: 2 (otvírák) · Odhad: **70 min** (35 výklad + živé demo, 35 lab) · Publikum: **vývojáři / architekti**
> Prostředí: viz [`../../environment.md`](../../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../../GLOSSARY.md)

## Cíle

- Student ví, co Skill **je a není** (vs. agent, vs. jednorázový prompt) a kdy ho použít.
- Student zná anatomii `SKILL.md`, umí Skill navrhnout a zreviduje cizí návrh.
- Student viděl **živě** celý cyklus: tvorba v chatu → review draftu → uložení → běh se skill indicator kartou → soubor v Agent Assets.
- Student rozumí governance Skills (žádný admin vypínač; řídí se právy na souborech) a licenční bráně.

## Výklad

### Co je Skill

**Skill** = opakovatelný vícekrokový postup uložený jako **reusable asset** na webu — Copilot in SharePoint ho načte automaticky podle dotazu, nebo explicitně jménem ([Skills](https://learn.microsoft.com/en-us/sharepoint/copilot-in-sharepoint-skills)). Zachycuje org-specifická pravidla (standardy dokumentů, review checklisty), takže Copilot pracuje **konzistentně**, ne podle nálady jednorázového promptu.

- Tvorba: **přirozeným jazykem v chatu** — popíšeš workflow, agent vrátí draft definice, zreviduješ, uložíš.
- Běh: dotaz odpovídající účelu Skillu (auto-load), nebo „Run *název* on the selected documents"; načtení potvrzuje **skill indicator card** v chatu.

### Co Skill umí a neumí

- **Umí**: řetězit vestavěné schopnosti Copilot in SharePoint — sumarizace/porozumění obsahu, organizace souborů a složek, práce se seznamy (např. „zvaliduj smlouvy a nevalidní zapiš do listu Invalid Contracts").
- **Neumí**: externí systémy, vlastní kód. **Nepřekročí práva uživatele** — nerozšiřuje přístup ani schopnosti nad rámec Copilot in SharePoint. (Na akce a integrace jsou agenti — hned další blok.)

### Kde Skill žije — SKILL.md

Úložiště: knihovna **Agent Assets** na webu, cesta `/Agent Assets/Skills/<název>/SKILL.md`. Je to obyčejný **Markdown** (callback na D1 formáty!) — jde editovat i přímo, jen držet strukturu, ať ho Copilot dál umí interpretovat.

### Governance a práva

- **Žádný admin vypínač** — Skills jsou nativní schopnost Copilot in SharePoint, samostatně se nevypínají. Knihovnu Agent Assets vytváří produkt a **nejde smazat**.
- Řízení = **standardní file governance**: permissions, retention, sensitivity labels, audit — jako u každého obsahu. Default: **Edit** na webu = tvorba Skillu, **View** = spuštění; přísnější model = break inheritance na Agent Assets.
- **Licenční brána**: Skills běží tam, kde je dostupný **Copilot in SharePoint**. Microsoft to dokumentuje jako license-only, ale **empiricky funguje i na PAYG bez Copilot licence** — tvorba i použití (ověřeno na kurzu **2026-07-17**; MS to takto nedokumentuje — docs lag, re-verify). Druhá brána = **Edit** (tvorba) / **View** (spuštění).

### Jak se Skills aktivují

Skills se samostatně nezapínají — jedou tam, kde je dostupný **Copilot in SharePoint**. Dvě brány:

1. **Licence:** MS uvádí **M365 Copilot licenci**; **empiricky stačí i PAYG bez licence** (ověřeno 2026-07-17, MS nedokumentuje — re-verify).
2. **Dostupnost webu (tenant):** `KnowledgeAgentScope` na `Set-SPOTenant` (`AllSites` / `IncludeSelectedSites` / `ExcludeSelectedSites` / `NoSites`) — od poloviny června 2026 **opt-out preview** (default-on pro licencované; dřívější opt-out se ctí). PowerShell postup je v D2 PowerShell inventuru agentů v tenantu (mimo rozsah tohoto kurzu).

Na úrovni webu **není žádná „site collection feature" k aktivaci** (dle aktuálních docs). Web má jen *controls*: **Site AI settings** (vlastník volí, který agent se z ikony otevře; skryje Copilot tlačítko pro visitory) a **Restricted Content Discovery** (RCD web z Copilotu vyřadí — přebíjí availability). Skills jsou pak nativní schopnost — žádný další vypínač.

> [!WARNING] Ověřit k datu běhu
> Samostatnou „site collection feature" pro Skills/Copilot in SharePoint aktuální docs (opt-out preview, ms.date 2026-06) **neuvádějí** — aktivace = licence + `KnowledgeAgentScope`, na webu Site AI settings / RCD. Enablement se při GA mění; pokud narazíš na feature v UI, ověřit.

### Na jakém modelu Skills běží (a co Anthropic)

Copilot in SharePoint — a tedy Skills — běží na **Microsoft-managed reasoning modelu od OpenAI**; model se nekonfiguruje. Skills proto **na Anthropicu nezávisí** (Claude se v této cestě aktuálně nepoužívá). AI subprocesoři, Anthropic a EU Data Boundary: dokumentace Microsoftu k AI subprocesorům a EU Data Boundary.

### Kontext webu — SHAREPOINT.md (doporučení)

**Doporučená praxe:** jeden `SHAREPOINT.md` v **kořeni knihovny Agent Assets** dá Copilotu trvalý kontext o webu (účel, mapa knihoven, konvence pojmenování, pravidla pro AI, glosář) — načítá se do každého chatu na webu a Skills ho dědí. Konzistentní kontext napříč tenanty = levná páka na kvalitu odpovědí (obdoba `AGENTS.md`/`CLAUDE.md` pro repo).

> [!IMPORTANT] Zatím neoficiální
> **`SHAREPOINT.md` není k 2026-06 dokumentován na Microsoft Learn** (oficiálně jen `SKILL.md`) — komunitní pattern, chování před produkčním spoléháním ověřit. Detail, šablona, kam patří a na co dát pozor: [`explainer-sharepoint-md.md`](./explainer-sharepoint-md.md).

### Tip: `--agenttools` — co agent na webu umí

V chatu Copilot in SharePoint vypíše `--agenttools` **view-only seznam všech tools**, které má agent na daném místě, seskupené do kategorií (docAssist, Creation, Deletion, Automation & Rules…) — např. `create_file`, `create_folder`, `create_form`, `delete_field`, `delete_list`. Rychlá **discoverability**: co může Skill na tomto webu/knihovně řetězit.

> [!IMPORTANT] Zatím neoficiální
> `--agenttools` (a další `--` příkazy) **nejsou dokumentované na MS Learn** — in-product preview pomůcka; hláška v UI sama říká, že se tools v čase mění. Brát jako tip, ne stabilní API.

Nejblíž oficiálnímu **katalogu schopností** je [Work IQ SharePoint reference (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-sharepoint-work-iq) — MCP server „Work IQ SharePoint" pro Copilot Studio (`findSite`, `createSmallTextFile`, `createFolder`, `createList`, `createColumn`, `shareFileOrFolder`, `setSensitivityLabelOnFile`…). Pozor: **jiná plocha** (Copilot Studio MCP) a **jiné názvy** než `--agenttools` — reference schopností, ne 1:1 dokumentace toho příkazu. Preview: názvy se můžou měnit.

### Živé demo (instruktor)

Celý cyklus na instruktorském webu: prompt na tvorbu Skillu (review smluv → zápis nevalidních do listu) → review draftu → uložení → výběr souborů v knihovně → běh → skill indicator card → prohlídka `SKILL.md` v Agent Assets.

## Klíčové rozlišení

- **Skill vs. agent**: Skill = uložený *postup* uvnitř Copilot in SharePoint (bez vlastní persony, knowledge a akcí); agent = samostatná *persona* s instrukcemi, knowledge a případně akcemi. Mapa cest tvorby agentů: [`../../agent-landscape/`](../../day-1/agent-landscape/).
- **Skill vs. prompt**: prompt je jednorázový a osobní; Skill je uložený, sdílený (View stačí) a konzistentní. „Dobrý prompt, který píšeš potřetí" = kandidát na Skill (D2 prompt anatomie se recykluje).
- **Licence vs. permissions** (D1 vzor): licence otvírá funkci (Copilot in SharePoint), permissions řídí tvorbu/běh (Edit/View) — tady jsou brány **dvě za sebou**.

## Naše prostředí

- **Studenti Skills empiricky ZVLÁDNOU** — Copilot in SharePoint funguje i na Business Basic + PAYG bez Copilot licence (ověřeno na kurzu **2026-07-17**; MS to nedokumentuje — docs uvádějí licenci, re-verify před během). Studenti tedy Skill **navrhnou, vytvoří i spustí sami** (`SKILL.md` je jen Markdown — psát umí od D1). Fallback, kdyby v tenantu nešlo: návrh + review + instruktorský běh. *(Pozn.: dřívější předpoklad „license-only, PAYG neodemyká" byl na kurzu empiricky vyvrácen.)*

## Lab

Viz [`lab-skill-design.md`](./lab-skill-design.md) — návrh a review SKILL.md + živé spuštění vybraných návrhů.

## Zdroje (Microsoft)

[Extend Copilot in SharePoint with skills](https://learn.microsoft.com/en-us/sharepoint/copilot-in-sharepoint-skills) · [Get started with Copilot in SharePoint](https://learn.microsoft.com/en-us/sharepoint/copilot-in-sharepoint-get-started)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-07.
> Skills = součást **preview** Copilot in SharePoint — chování (auto-load, indicator card, formát SKILL.md) se může měnit; před během projít docs (ms.date 2026-06-23). **Licence: MS uvádí Copilot licenci (license-only), ale empiricky Skills fungují i na PAYG bez licence — ověřeno na kurzu 2026-07-17 (MS nedokumentuje, docs lag); re-verify při GA.** Skills jsou zatím dostupné jen v first-party Copilot in SharePoint experience.

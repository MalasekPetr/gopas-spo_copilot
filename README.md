# SPO_COPILOT — Microsoft 365 Agents SDK a Copilot Extensions

Zdrojové materiály kurzu **SPO_COPILOT** (GOPAS). Vše je psané v Markdownu s Mermaid diagramy,
renderovatelné přímo na GitHubu. 5 dní, pro-code kurz (TypeScript primárně; C# jen
v instruktorských demech Agent Frameworku).

> [!IMPORTANT] Osnova v repu ≠ osnova na webu
> Repo drží **restrukturalizovanou osnovu odpovídající stacku 2026**. Publikovaná katalogová
> osnova je obsahově zastaralá (jmenuje retirované certifikace AI-102/AZ-204, „Graph konektory"
> a neobsahuje Microsoft Agent Framework, Agent 365 ani Microsoft Foundry). Návrh nové webové
> osnovy včetně 301 redirectu je v [`marketing/`](./marketing/) — **musí být na webu před prvním
> během kurzu**.

## Jak repo číst

- **Začni dnem, ne modulem.** Každý den má vlastní briefing: [`day-1/`](./day-1/README.md) ·
  [`day-2/`](./day-2/README.md) · [`day-3/`](./day-3/README.md) · [`day-4/`](./day-4/README.md) ·
  [`day-5/`](./day-5/README.md). Je v něm tabulka bloků včetně volitelných, timing
  a kompresní ventily.
- **Pořadí modulů** napříč týdnem drží [`agenda.md`](./agenda.md) — složky jsou pojmenované
  **slugy**, ne čísly, aby vkládání dalších modulů nerozhazovalo číslování.
- **Závazné názvosloví** (produkty, SDK, certifikace, přejmenování) je v
  [`GLOSSARY.md`](./GLOSSARY.md) — jediný zdroj pravdy.
- **Konvence** (MD styl, Mermaid, currency-markery, prefixy souborů, kód v materiálech) jsou
  v [`CONVENTIONS.md`](./CONVENTIONS.md).
- **Šablony** modulu a labu jsou v [`_templates/`](./_templates/).
- **Prostředí kurzu** (tenant, PAYG, model endpoint, matice požadavků per blok) je
  v [`environment.md`](./environment.md).

## Nosná linka týdne

Kurz není 16 nesouvisejících přednášek — celý týden se buduje **jeden agent**. Scénář a jeho
postupné rozšiřování je v
[`scenario-support-agent.md`](./scenario-support-agent.md).

## Struktura

```text
gopas-spo_copilot/
├─ README.md              # tento soubor
├─ CONVENTIONS.md         # jak psát materiály
├─ GLOSSARY.md            # závazné názvosloví
├─ agenda.md              # 5denní pořadí bloků (single source of order)
├─ environment.md         # tenant, PAYG, model endpoint, matice požadavků
├─ scenario-support-agent.md  # nosná linka týdne — agent, který se staví celý týden
├─ self-study.md          # co se neodučí a kde to student najde
├─ _templates/            # module.md, lab.md
├─ day-1/ … day-5/        # obsah po dnech; každý modul = složka se slugem
│   ├─ README.md          # denní briefing: tabulka bloků, timing, ventily
│   └─ <modul>/           # README, instructor-notes, lab-*, solution/
├─ marketing/             # NÁVRH nové osnovy pro web (cs / en / sk)
└─ scripts/               # provozní skripty kurzu (lifecycle studentů, seed dat)
```

## Legenda

- **Povinný** modul — součást každého běhu.
- **Volitelný** modul — v tabulce dne označený **V**. Nejede v bloku, ale patří ke dni
  a student ho má ve stejné složce. Část z nich má prefix `opt-`, část se do samostudia
  přesunula až po rekalibraci (`security-risk`, `event-driven-hosting`,
  `orchestry-governance`, `perf-cost-lifecycle`).
- Currency-markery v textu:
  - `> [!WARNING] Ověřit k datu běhu` — fast-moving fakt (ceny, preview, verze SDK, retirement dat).
  - `> [!IMPORTANT]` — lineage / přejmenování / breaking change, na které studenty upozornit.

## Stav

**Po prvním běhu** (týden od 2026-08-24). Obsah je kompletní, rozvržení dnů
rekalibrované třikrát podle skutečně odučeného času — viz [`agenda.md`](./agenda.md)
a briefingy jednotlivých dnů. Co se neodučilo a kde to student najde, je
v [`self-study.md`](./self-study.md).

Struktura `day-N/<modul>/` zavedena 2026-08-27 (dřív byly moduly v kořeni).
**Studenti s klonem si musí udělat `git pull`** — cesty se změnily.

Model endpoint pro custom engine agenty: **instruktorský Foundry deployment**
(viz [`environment.md`](./environment.md)) — Business Basic + Copilot Credits
nedává inference endpoint pro vlastní kód.

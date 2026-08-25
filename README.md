# SPO_COPILOT — Microsoft 365 Agents SDK a Copilot Extensions

Zdrojové materiály kurzu **SPO_COPILOT** (GOPAS). Vše je psané v Markdownu s Mermaid diagramy,
renderovatelné přímo na GitHubu. 5 dní, pro-code kurz (TypeScript primárně; C# jen
v instruktorských demech Agent Frameworku).

> [!IMPORTANT] Osnova v repu ≠ osnova na webu
> Repo drží **restrukturalizovanou osnovu odpovídající stacku 2026**. Publikovaná katalogová
> osnova je obsahově zastaralá (jmenuje retirované certifikace AI-102/AZ-204, „Graph konektory"
> a neobsahuje Microsoft Agent Framework, Agent 365 ani Microsoft Foundry). Návrh nové webové
> osnovy včetně 301 redirectu je v [`marketing/`](marketing/) — **musí být na webu před prvním
> během kurzu**.

## Jak repo číst

- **Pořadí modulů** je definované v [`agenda.md`](agenda.md) — složky jsou pojmenované **slugy**,
  ne čísly, aby vkládání dalších modulů nerozhazovalo číslování.
- **Závazné názvosloví** (produkty, SDK, certifikace, přejmenování) je v
  [`GLOSSARY.md`](GLOSSARY.md) — jediný zdroj pravdy.
- **Konvence** (MD styl, Mermaid, currency-markery, prefixy souborů, kód v materiálech) jsou
  v [`CONVENTIONS.md`](CONVENTIONS.md).
- **Šablony** modulu a labu jsou v [`_templates/`](_templates/).
- **Prostředí kurzu** (tenant, PAYG, model endpoint, matice požadavků per blok) je
  v [`environment.md`](environment.md).

## Nosná linka týdne

Kurz není 16 nesouvisejících přednášek — celý týden se buduje **jeden agent**. Scénář a jeho
postupné rozšiřování je v
[`scenario-support-agent.md`](scenario-support-agent.md).

## Struktura

```text
gopas-spo_copilot/
├─ README.md          # tento soubor
├─ CONVENTIONS.md      # jak psát materiály
├─ GLOSSARY.md         # závazné názvosloví
├─ agenda.md           # 5denní pořadí bloků (single source of order)
├─ environment.md      # tenant, PAYG, model endpoint, matice požadavků
├─ _templates/         # module.md, lab.md
├─ dny/                # denní briefingy (den-1.md … den-5.md)
├─ <modul>/            # každý modul = složka se slugem v kořeni; den a pořadí drží agenda
├─ marketing/          # NÁVRH nové osnovy pro web (cs / en / sk)
└─ scripts/            # provozní skripty kurzu (lifecycle studentů, seed dat)
```

## Legenda

- **Povinný** modul — součást každého běhu.
- **Volitelný** modul (slug s prefixem `opt-`) — spouští se dle času / potřeb skupiny.
- Currency-markery v textu:
  - `> [!WARNING] Ověřit k datu běhu` — fast-moving fakt (ceny, preview, verze SDK, retirement dat).
  - `> [!IMPORTANT]` — lineage / přejmenování / breaking change, na které studenty upozornit.

## Stav

Fáze 2 — **obsah dopsán** (2026-08-24). Všechny moduly, laby i diagramy jsou rozpracované
do plné hloubky; v repu nezůstaly žádné TODO placeholdery kromě šablon v
[`_templates/`](_templates/). Rozvržení dnů je po prvním běhu rekalibrované — viz
[`agenda.md`](agenda.md) a [`self-study.md`](self-study.md).

Model endpoint pro custom engine agenty: **instruktorský Foundry deployment** (rozhodnuto
2026-08-24, viz [`environment.md`](environment.md)) — Business Basic + Copilot Credits
nedává inference endpoint pro vlastní kód.

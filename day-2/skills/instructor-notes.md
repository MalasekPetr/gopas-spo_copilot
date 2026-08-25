# Instructor notes — Skills

## Timing

- 35 min výklad + živé demo, 35 min lab (25 návrh/review + 10 živé běhy). **Otvírák dne 2** — převzato z GOC224, zařazeno na místě rozhodnutím lektora (2026-08-25) na základě zájmu skupiny. Skills demo čerpá kredity jen přes instruktorskou licenci.

## Go/no-go — otestovat před během

- **Instruktorský účet má M365 Copilot licenci** (potvrzeno 2026-07) a na demo webu se otvírá Copilot in SharePoint panel — ověřit ráno, je to preview.
- **Demo web je v `KnowledgeAgentScope`** (D2 konfigurace!) a nemá RCD — obojí by panel vypnulo.
- Připravit: knihovna s 3–4 dokumenty pro demo Skill (review smluv / kontrola metadat), jeden dokument záměrně „nevalidní".
- Vyzkoušet celý demo cyklus den předem — tvorba Skillu je preview, draft může vypadat jinak než na screenshotech.

## Tripwires

- **Studenti si Skills empiricky spustí** — Copilot in SharePoint funguje i na Business Basic + PAYG bez Copilot licence (ověřeno na kurzu 2026-07-17; MS to nedokumentuje — docs uvádějí licenci, docs lag). Lab tedy může být **plně hands-on** (návrh → tvorba → běh). Re-verify před během; fallback = návrh + instruktorský běh. Dřívější předpoklad „license-only" byl empiricky vyvrácen — psaní SKILL.md ale zůstává přenositelná dovednost.
- **Skills ≠ automatizace**: žádné externí systémy, žádný kód, žádné triggery — na to jsou agenti (odpoledne) a Power Automate (D3). Studenti budou chtít „skill, co pošle e-mail" — zastavit u kroku 3 labu.
- **Žádný admin vypínač** — governance dotazy směřovat na file permissions na Agent Assets (break inheritance), ne do admin centra.
- Agent Assets nejde smazat — nepanikat při demu, je to by design.
- Nezabřednout do formátu SKILL.md jako „specifikace" — je to preview, struktura se může měnit; učíme princip (postup jako reusable MD asset), ne syntax.

## Vazby

- Zpět: MD formát (D1 `formats`), prompt anatomie (D2 — nejednoznačné instrukce), agent vs. skill (D4 `copilot-agents`), KnowledgeAgentScope/RCD (D2 konfigurace + explainer).
- Dopředu: Copilot Studio (hned potom) — „skill = postup uvnitř Copilotu; když potřebujete akce, kanály nebo vlastní knowledge, stavíte agenta"; topics v Studiu ≠ Skills (jiný mechanismus, stejná disciplína popisů).

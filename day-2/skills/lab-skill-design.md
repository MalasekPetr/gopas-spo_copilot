# Lab · Návrh a review Skillu

> Modul: skills · Odhad: 35 min (25 návrh + review, 10 běhy) · Režim: **studenti hands-on** — návrh, tvorba i běh Skillu (Copilot in SharePoint empiricky funguje na PAYG, ověřeno 2026-07-17; MS nedokumentuje — re-verify, fallback instruktorský běh)

## Cíl

Navrhnout Skill pro opakovaný postup ze svého webu jako `SKILL.md`, projít peer review a vidět vybrané návrhy běžet živě.

## Kroky

### Část A — návrh (všichni)

1. Vyber **opakovaný postup** ze svého webu z tohoto týdne (např. kontrola metadat dokumentů z D2 knihovny, review checklist smluv z D3, kontrola tagů obrázků). Kritérium: děláš to promptem podruhé/potřetí stejně.
2. Napiš návrh `SKILL.md` (struktura podle dema): **název** (výstižný — podle něj se Skill volá), **účel** (1–2 věty, kdy se má načíst), **kroky** (číslovaný postup — co Copilot udělá, s čím a v jakém pořadí), **vstupy** (co si má vyžádat: výběr souborů, název listu…), **výstup** (co je hotovo).
3. Zkontroluj proti omezením: žádný externí systém, žádný kód, nic nad rámec práv uživatele. Pokud krok potřebuje akci mimo SharePoint → poznamenej „tohle už je agent" (odpolední blok).
4. **Peer review ve dvojici**: soused hledá (a) krok, který Copilot nemůže umět, (b) nejednoznačnou instrukci (D2 pravidla promptů platí i tady), (c) chybějící vstup. Zapracuj.

### Část B — tvorba a běh (studenti)

5. Každý student svůj návrh vytvoří přes chat na vlastním webu (empiricky funguje na PAYG — ověřeno 2026-07-17) a spustí. Sleduj: draft od agenta vs. původní návrh, skill indicator card, výsledný `SKILL.md` v Agent Assets. *(Fallback, kdyby v tenantu nešlo: 2–3 vybrané spustí instruktor.)*
6. Autor porovná: co agent v draftu změnil oproti mému návrhu a proč?

## Ověření

- [ ] `SKILL.md` návrh má název, účel, kroky, vstupy, výstup.
- [ ] Návrh prošel kontrolou omezení (žádný krok mimo schopnosti Copilot in SharePoint).
- [ ] Peer review proběhlo a je zapracované (min. 1 změna).
- [ ] U živých běhů: autoři zapsali rozdíl draft vs. návrh.

## Fallback

- Skills v tenantu nejedou (re-verify — dřív se čekalo license-only, empiricky ale na PAYG fungují 2026-07-17): části A a review jsou plnohodnotný deliverable; běhy nahradí instruktorský běh / screenshoty.

# Výklad · SHAREPOINT.md — kontext webu pro Copilota (doporučení)

> Modul: skills · Typ: doporučená praxe · Prostředí: viz [`../../environment.md`](../../environment.md)

> [!IMPORTANT] Zatím neoficiální
> **`SHAREPOINT.md` není k datu psaní (2026-06) dokumentován na Microsoft Learn** — oficiálně je popsán jen `SKILL.md` ([Skills](https://learn.microsoft.com/en-us/sharepoint/copilot-in-sharepoint-skills)). Níže je **doporučení** postavené na komunitní praxi; chování ověřit před spoléháním v produkci. Zdroje jsou třetí strana, ne Microsoft.

## Co to je a proč to doporučujeme

`SHAREPOINT.md` je **jeden Markdown soubor s trvalým kontextem o webu** — účel webu, mapa knihoven, konvence pojmenování, standardy a pravidla pro AI. Copilot in SharePoint ho podle komunitních zdrojů **automaticky načítá do každého chatu na webu** a **Skills z něj dědí** kontext (nemusí opakovat cesty a konvence).

Analogie z vývoje: je to pro web totéž, co `AGENTS.md` / `CLAUDE.md` pro repozitář — „co má AI o tomhle místě vědět", napsané jednou.

**Proč to dává smysl pro nás (Malach):** napříč ~15 zákaznickými tenanty a SPFx produkty je konzistentní, opakovaně použitelný kontext webu levná páka na kvalitu odpovědí Copilota — a governance artefakt, který je vidět a dá se verzovat/reviewovat.

## Kam patří

Do **kořene knihovny `Agent Assets`** na webu, název **`SHAREPOINT.md`** (velkými). Tedy **ne „kdekoli"** — jeden soubor na web, v Agent Assets (stejná knihovna, kde žijí Skills v `/Agent Assets/Skills/<název>/SKILL.md`).

## Co do něj psát

Psát **pro AI, ne pro lidi**: stručně, odrážky a tabulky místo prózy, ideálně do ~4000 slov.

- **Identita webu** — název, URL, účel jednou větou, cílové publikum, vlastník.
- **Mapa knihoven** — každá knihovna: cesta, co obsahuje, konvence pojmenování, pravidla.
- **Konvence pojmenování** — na úrovni dokumentů i položek listů, s příklady.
- **Standardy obsahu / styl** — jazyk (čeština), tón, reading level, zakázané/povinné fráze.
- **Pravidla pro AI** — explicitní pravidla pro generování a úpravy obsahu na tomto webu.
- **Glosář** — org-specifické zkratky a pojmy.

### Šablona

```markdown
# SHAREPOINT.md — <Název webu>

## Identita webu
- Účel: <jedna věta>
- URL: <https://...>
- Publikum: <kdo web používá>
- Vlastník: <kdo>

## Mapa knihoven
| Knihovna | Cesta | Obsah | Konvence pojmenování |
| --- | --- | --- | --- |
| Smlouvy | /Smlouvy | PP smlouvy, dodatky | <OsobniCislo>_<typ> |

## Konvence pojmenování
- Dokumenty: <pravidlo + příklad>
- Položky listů: <pravidlo + příklad>

## Standardy obsahu
- Jazyk: čeština · Tón: věcný · Zakázat: <…>

## Pravidla pro AI
- <explicitní pravidlo 1>
- <explicitní pravidlo 2>

## Glosář
- <zkratka>: <význam>
```

## Na co dát pozor

- **Načítá se do každého chatu** → **žádná citlivá data ani tajemství** do souboru (GDPR/ISO — je to kontext, ne trezor).
- Řídí se **právy na knihovně Agent Assets** jako každý obsah (Edit = úprava, View = čtení).
- Preview/komunitní chování — **ověřit, že se opravdu načítá**, a sledovat, jestli to Microsoft časem zdokumentuje/změní.

## Zdroje

Třetí strana (ne Microsoft): [copilotinsharepoint.com — SHAREPOINT.md](https://www.copilotinsharepoint.com/articles/sharepoint-md-file) · [leonarmston.com](https://www.leonarmston.com/2026/05/copilot-in-sharepoint-skills-contracts-sharepoint-md-context/). Oficiální kontext (Skills, Agent Assets): [Extend Copilot in SharePoint with skills](https://learn.microsoft.com/en-us/sharepoint/copilot-in-sharepoint-skills).

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-07.
> `SHAREPOINT.md` **není na MS Learn** — komunitní pattern. Před během ověřit, jestli se chování nezměnilo nebo jestli to Microsoft nezdokumentoval oficiálně (pak přesunout z „doporučení" do standardní výuky).

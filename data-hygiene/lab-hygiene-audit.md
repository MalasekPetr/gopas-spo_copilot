# Lab · Mini-audit hygieny před nasazením agenta

> Modul: `data-hygiene` · Odhad: 15 min · Režim: **instruktorské demo + checklist**
> Jazyk: — (bez kódu) · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Vyplněný **hygienický checklist před nasazením agenta** — deliverable, který student
použije u zákazníka před každým groundingem.

## Předpoklady

- Grounding z [`../knowledge-grounding/`](../knowledge-grounding/lab-grounding-runbooks.md)
  (agent už čte z knihovny `Runbooky`).
- Instruktor: přístup k SAM reportům dle licence (jinak screenshoty).

## Kroky

### Část A — demo: co je v tenantu špatně (instruktor)

1. Instruktor promítne **oversharing report / site access review** na demo tenantu —
   včetně jednoho záměrně špatně nasdíleného webu. Studenti si značí, čím se takový nález
   pozná a jak by ho popsali zákazníkovi.
2. Instruktor zapne **Restricted Content Discovery** na citlivé knihovně a ukáže dopad:
   agent z ní přestane odpovídat, ačkoli obsah dál existuje a uživatel k němu má přístup
   přes SharePoint.

### Část B — checklist (studenti)

3. Sestav **hygienický checklist před nasazením agenta** v obhajitelném pořadí: audit
   oversharingu → RCD jako okamžité zhasnutí → oprava ACL → sensitivity labels →
   lifecycle mrtvých webů → grounding až nakonec. Minimálně 5 bodů.
4. Ke každému bodu doplň dva sloupce: **kdo ho dělá** (IT admin vs. vývojář agenta)
   a **čím se ověří, že je hotový** — bez druhého sloupce je checklist přání, ne kontrola.

## Ověření

- [ ] Checklist má minimálně 5 bodů v obhajitelném pořadí (hygiena před groundingem).
- [ ] Student umí vysvětlit rozdíl RCD (příznak) vs. oprava ACL (příčina).
- [ ] Student umí říct, proč je dotaz 4 ze scénáře bezpečný jen v uklizeném tenantu.

## Fallback

- Bez SAM licence: část A ze screenshotů instruktora; checklist (část B) je nezávislý
  a je hlavní deliverable.

## Zdroje (Microsoft)

- [SharePoint Advanced Management — overview](https://learn.microsoft.com/en-us/sharepoint/advanced-management)
- [Restricted SharePoint Search](https://learn.microsoft.com/en-us/sharepoint/restricted-sharepoint-search)

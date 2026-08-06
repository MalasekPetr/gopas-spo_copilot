# Lab · Mini-audit hygieny před nasazením agenta

> Modul: `data-hygiene` · Odhad: 15 min · Režim: **instruktorské demo + checklist**
> Jazyk: — (bez kódu) · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Vyplněný **hygienický checklist před nasazením agenta** — deliverable, který student
použije u zákazníka před každým groundingem.

## Předpoklady

- Grounding z [`../knowledge-grounding/`](../knowledge-grounding/lab-grounding-runbooks.md)
  (agent už čte z knihovny `Runbooky`).
- Instruktor: přístup k SAM reportům dle licence (jinak screenshoty).

## Kroky

### Část A — demo: co je v tenantu špatně (instruktor)

1. <!-- TODO: ukazat oversharing report / site access review na demo tenantu;
     jeden zamerne "spatne" nasdileny web -->
2. <!-- TODO: Restricted Content Discovery na citlive knihovne a dopad na agenta
     (prestane z ni odpovidat) -->

### Část B — checklist (studenti)

3. <!-- TODO: student sestavi checklist: audit oversharingu -> RCD/oprava ACL ->
     sensitivity labels -> lifecycle mrtvych webu -> grounding az nakonec -->
4. <!-- TODO: ke kazdemu bodu: kdo ho dela (IT admin vs vyvojar) a cim se overi -->

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

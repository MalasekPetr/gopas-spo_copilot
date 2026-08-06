# Instructor notes — Datová hygiena v SPO a EXO

## Timing

- ~45 min (30 výklad + 15 mini-audit). Závěrečný blok dne 2 — záměrně lehčí formát
  (demo + checklist), studenti jsou po actions-graph unavení.
- Při skluzu dne se dá stáhnout na 30 min: výklad zkrátit, checklist zadat jako
  večerní úlohu. Nevypouštět celý — security-risk (D5) na hygienu odkazuje.

## Go/no-go — otestovat před během

- Ověřit **licenci SharePoint Advanced Management** v demo tenantu; bez ní připravit
  screenshoty reportů z jiného prostředí.
- Připravit v tenantu **jeden záměrně přesdílený web** (demo oversharingu) — a po kurzu
  ho uklidit.
- Ověřit aktuální stav **Restricted Content Discovery** (názvosloví i rozsah se mění).

## Tripwires

- **„To je admin téma, my jsme vývojáři."** Ne — vývojář, který groundí agenta nad
  neuklizeným tenantem, nese následky první. Checklist je součást architektonického
  deliverable, ne admin úkol.
- Nesklouznout do plného Purview výkladu — DLP a compliance je vlastní kurz; tady jen
  to, co ovlivňuje agenta.
- Studenti si spletou „agent vidí míň" (RCD) s „agent je bezpečný" — RCD je příznak,
  oprava ACL příčina. Explicitně.

## Vazby

- Zpět: `knowledge-grounding` (hygiena je předpoklad groundingu),
  `actions-graph` (delegated vs. app-only hranice — co agent vidí v EXO).
- Dopředu: `security-risk` (D5 — obsah v knowledge zdroji jako útočný vektor; uklizený
  tenant zmenšuje plochu), `capstone` (checklist patří do architektury).

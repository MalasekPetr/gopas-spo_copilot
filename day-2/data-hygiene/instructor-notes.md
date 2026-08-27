# Instructor notes — Datová hygiena v SPO a EXO

## Timing

- **60 min (40 výklad + 20 checklist)** — rozšířeno 2026-08-25 o hloubku **SAM**
  (tři pilíře, RAC vs. RCD, licenční past) převzatou z GOC224 `advanced-management`,
  na základě zájmu skupiny. Nahrazuje samostatný SAM blok — nedělat obojí, překrývá se.
- Závěrečný blok dne 2. Kdyby čas tlačil, zkrátit **tři pilíře** na jeden slide
  a nechat RAC/RCD rozlišení plus checklist — to je jádro.
- Při skluzu dne se dá stáhnout na 30 min: výklad zkrátit, checklist zadat jako
  večerní úlohu. Nevypouštět celý — security-risk (D5) na hygienu odkazuje.

## Go/no-go — otestovat před během

- **SAM v `spdemo.online` funguje** (potvrzeno 2026-08-06) — přesto před během ověřit,
  že reporty jedou a licence nevypršela; screenshoty mít jako zálohu.
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

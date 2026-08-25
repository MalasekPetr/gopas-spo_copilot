# Instructor notes — Agenti v Marketplace

## Timing

- ~50 min (35 výklad + 15 checklist). **Přesunuto na den 2** (odučeno 2026-08-25) —
  navazuje přímo na `Provision` deklarativního agenta: interní distribuce byla před chvílí,
  tady je ta veřejná. Narativ „agent opouští notebook" pokračuje až governance na D5.
- Case study nenafukovat přes 15 min — je to ilustrace procesu, ne produktovka.

## Go/no-go — otestovat před během

- **Ověřit aktuální validační politiky pro agenty** na learn — mění se; checklist v labu
  se vyplňuje proti aktuální stránce, ne proti slajdu.
- Ověřit živý stav listingu **Normiqa Navigator** (Agent Store / AppSource) a připravit,
  co z Partner Center ukázat — **bez citlivých údajů** (tržby, zákazníci, kontakty).
- Mít screenshoty jako zálohu pro případ výpadku Partner Center.

## Tripwires

- **Produktovka.** Normiqa Navigator je case study validačního procesu — pokud blok
  sklouzne k prodeji produktu, ztrácí kredibilitu. Ukazovat proces a zamítnutí, ne featury.
- Studenti podcení netechnické podmínky (privacy policy, terms, support proces) — právě
  ty bývají nejdražší; zdůraznit v kroku 2 labu.
- Nezaměňovat store validaci s Microsoft 365 certifikací — jiné úrovně důvěry.
- Monetizaci zmínit, nezabíhat — licenční modely ISV jsou vlastní téma mimo kurz.

## Vazby

- Zpět: `declarative-agents` (předchozí blok — `Provision` je distribuce do vlastního
  tenantu; tady je veřejná cesta), `skills` a `sharepoint-agents` (co se vůbec publikovat
  nedá — SharePoint agent žije s webem).
- Dopředu: `agents-sdk-core` a dál (D3 — custom engine přidává endpoint, který validace
  prověřuje; deklarativní agent tuhle plochu nemá), `spfx-copilot-apps` (D4 — store
  distribuce Copilot Apps zatím nepodporovaná, srovnání), `agent-365-governance` (D5 —
  publikovaný agent pod governance), `capstone` (store ANO/NE patří do roadmapy).

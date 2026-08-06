# Lab · Rozhodovací matice — tři zadání, tři různé odpovědi

> Modul: `agent-landscape` · Odhad: 50 min · Režim: **hands-on** (návrhový lab, bez kódu)
> Scénář: [`../agents-sdk-core/scenario-support-agent.md`](../agents-sdk-core/scenario-support-agent.md)

## Cíl

Pro tři různá zadání vybrat cestu tvorby agenta a **odůvodnit ji tak, jak by to student
řekl zákazníkovi** — včetně toho, co daná volba stojí a kdo ji bude udržovat.

## Předpoklady

- Přečtený [`../../GLOSSARY.md`](../../GLOSSARY.md), sekce vrstvy stacku a tři peněženky.
- Žádný toolchain ani tenant — lab je návrhový.

## Kroky

### Část A — tři zadání

1. <!-- TODO: zadani 1 — HR FAQ nad dokumenty v SharePointu, vlastnikem je HR, zadne akce.
     Ocekavana odpoved: deklarativni agent / Agent Builder. -->
2. <!-- TODO: zadani 2 — schvalovaci proces s Dataverse a Power Automate, vlastnik je
     business department, ma Power Platform governance. Ocekavana odpoved: Copilot Studio. -->
3. <!-- TODO: zadani 3 — Support Asistent (nas scenar): akce nad internim API, hranice
     opravneni, auditovatelnost, CI/CD. Ocekavana odpoved: custom engine pres Agents SDK. -->

### Část B — matice

4. <!-- TODO: student vyplni matici: cesta / vlastnik / infrastruktura / model a inference /
     governance a registry / ALM / co to stoji / kdo to udrzuje za dva roky -->

### Část C — obhajoba

5. <!-- TODO: pair-share: student obhajuje svou volbu, druhy hraje zakaznika, ktery chce
     Copilot Studio na vsechno. Instruktor moderuje. -->
6. <!-- TODO: spolecne: u ktereho zadani by se odpoved zmenila, kdyby zakaznik uz mel
     Agent 365? A kdyby nemel Azure subscription? -->

## Ověření

- [ ] Vyplněná matice pro všechna tři zadání.
- [ ] U každého zadání **jeden** primární důvod volby, ne seznam pěti.
- [ ] Student umí říct, co na daném zadání **nefunguje** u zavržené cesty (ne obecně, konkrétně).
- [ ] Odůvodněno, proč Support Asistent nemůže být jen deklarativní agent.

## Fallback

Při skluzu z bloku 1 se lab zkrátí na část A + společnou diskusi u tabule (matici vyplní
instruktor promítnutou). Části B a C jsou pak samostudium — zadání zůstává v repu.

## Zdroje (Microsoft)

- [Choose the right tool to build a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-tool-comparison)
- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent)

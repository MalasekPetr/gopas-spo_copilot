# Lab · Rozhodovací matice — tři zadání, tři různé odpovědi

> Modul: `agent-landscape` · Odhad: 45 min · Režim: **hands-on** (návrhový lab, bez kódu)
> Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Pro tři různá zadání vybrat cestu tvorby agenta a **odůvodnit ji tak, jak by to student
řekl zákazníkovi** — včetně toho, co daná volba stojí a kdo ji bude udržovat.

## Předpoklady

- Přečtený [`../../GLOSSARY.md`](../GLOSSARY.md), sekce vrstvy stacku a tři peněženky.
- Žádný toolchain ani tenant — lab je návrhový.

## Kroky

### Část A — tři zadání

Ke každému zadání vyber cestu tvorby a zapiš **jeden** primární důvod:

1. **Zadání 1 — HR FAQ.** HR tým chce agenta, který odpovídá zaměstnancům na dotazy
   (benefity, dovolená, směrnice) z dokumentů v knihovně SharePointu. Vlastníkem řešení
   je HR, žádné akce, žádná integrace mimo M365.
2. **Zadání 2 — schvalování služebních cest.** Business oddělení chce agenta, který
   provede žadatele schvalovacím procesem: data v Dataverse, schvalovací flow v Power
   Automate. Zákazník má zavedenou Power Platform governance (PPAC, DLP, Managed
   Environments) a řešení bude vlastnit business, ne IT.
3. **Zadání 3 — Support Asistent (náš scénář).** Akce nad interním ticket API s validací
   parametrů, hranice oprávnění, auditovatelnost, source control a CI/CD — body 3–5
   ze [`scenario-support-agent.md`](../scenario-support-agent.md).

### Část B — matice

4. Pro každé zadání vyplň řádek matice: **cesta / vlastník řešení / infrastruktura /
   model a inference (kdo platí) / governance a registry / ALM / co to stojí / kdo to
   udržuje za dva roky**.

### Část C — obhajoba

5. Pair-share: obhaj svou volbu u přiděleného zadání; kolega hraje zákazníka, který chce
   Copilot Studio na všechno. Argumentuj maticí, ne preferencí — instruktor moderuje.
6. Společně: u kterého zadání by se odpověď změnila, kdyby zákazník už měl **Agent 365**?
   A kdyby **neměl Azure subscription**?

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

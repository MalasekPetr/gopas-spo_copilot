# Lab · Deklarativní Support Asistent v1 — kam až to jde bez kódu

> Modul: `declarative-agents` · Odhad: 65 min · Režim: **hands-on**
> Jazyk: JSON (+ TypeSpec ukázka) · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Provisionovaný **deklarativní Support Asistent v1** (instructions + knowledge) a vyplněná
tabulka stropu: co zvládl, co ne, a za jak dlouho byl hotový.

## Předpoklady

- Přihlášení v Agents Toolkitu (VS Code) účtem `user.NN@spdemo.online`.
- Knihovna `Runbooky` provisionovaná instruktorem v tenantu (viz [`../../scripts/`](../../scripts/)).
- Čtyři testovací dotazy ze scénáře po ruce.

## Kroky

### Část A — scaffold a instructions

1. <!-- TODO: scaffoldnout Declarative Agent v Toolkitu; projit strukturu projektu -->
2. <!-- TODO: napsat instructions ze scenare: role, scope, ton, pravidlo odmitnuti
     mimo-scope dotazu. Iterovat aspon jednou -- prvni verze nikdy nesedi. -->

### Část B — knowledge a capabilities

3. <!-- TODO: knowledge = knihovna Runbooky (OneDriveAndSharePoint capability) -->
4. <!-- TODO: pridat jednu dalsi capability dle aktualniho schematu (napr. WebSearch)
     a rict, proc ji Support Asistent chce / nechce -->

### Část C — provision a měření

5. <!-- TODO: Provision do tenantu; overit, ze agent je videt v M365 Copilotu -->
6. <!-- TODO: pustit ctyri testovaci dotazy; zaznamenat vysledek a cas stavby -->

### Část D — strop

7. <!-- TODO: tabulka: dotaz 1-2 (zvladl -- knowledge), dotaz 3 (akce s validaci -- kde
     presne narazil), dotaz 4 (vynucene odmitnuti -- co udelaly instructions). -->
8. <!-- TODO: pojmenovat, co by se stalo, kdyby zakaznik chtel POUZE deklarativniho
     agenta -- a ktera zadani by to uplne stacilo -->

## Ověření

- [ ] Deklarativní agent je provisionovaný a odpovídá v M365 Copilotu.
- [ ] Dotazy 1–2 zodpovězené z knihovny `Runbooky`.
- [ ] Vyplněná tabulka stropu včetně času stavby.
- [ ] Student umí **konkrétně** říct, co deklarativní agent na tomto zadání neuzavře
  (dotaz 3 a 4) — a u jakého zadání by naopak stačil.

## Fallback

- **Provisioning na PAYG nefunguje** (Microsoft to nedokumentuje, může se změnit):
  části A–B se odjedou beze změny lokálně (editace manifestu bez `Provision`), části C–D
  promítne instruktor ze svého běhu. Tabulka stropu zůstává platná — vede se
  o schopnostech, ne o běhu.
- Nestíhá se: část B krok 4 (extra capability) vypustit; strop (část D) je jádro,
  nepřeskakovat.

## Zdroje (Microsoft)

- [Create declarative agents using Microsoft 365 Agents Toolkit](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents)
- [Add capabilities and custom actions to a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents-add-skills)
- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent)

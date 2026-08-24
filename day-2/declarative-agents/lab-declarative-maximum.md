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

1. V Toolkitu scaffoldni **deklarativního agenta** (šablona podle aktuální verze —
   instruktor promítá). Projdi strukturu projektu: manifest aplikace,
   `declarativeAgent.json`, `env/`.
2. Napiš instructions ze scénáře: role (IT support), scope (runbooky), tón, pravidlo
   odmítnutí mimo-scope dotazů. **Iteruj aspoň jednou** — první verze nikdy nesedí;
   obě verze si ponech, rozdíl je součást pointy.

### Část B — knowledge a capabilities

3. Zapoj knowledge: knihovna `Runbooky` přes capability **`OneDriveAndSharePoint`**
   (URL webu promítne instruktor).
4. Přidej jednu další capability podle aktuálního schématu (např. `WebSearch`) a napiš
   jednou větou, proč ji Support Asistent **chce, nebo nechce** — každá capability
   rozšiřuje, kam agent smí.

### Část C — provision a měření

5. **Provision** do tenantu; ověř, že agent je vidět v M365 Copilotu pod tvým účtem.
6. Pusť čtyři testovací dotazy ze scénáře; zaznamenej výsledek každého z nich
   a **celkový čas stavby** (od scaffoldu po první odpověď).

### Část D — strop

7. Vyplň tabulku stropu: dotazy 1–2 (zvládl — knowledge z Runbooků), dotaz 3 (akce
   s validací — **kde přesně** narazil), dotaz 4 (vynucené odmítnutí — co udělaly
   instructions a proč to není enforcement).
8. Odpověz písemně: co by se stalo, kdyby zákazník chtěl **pouze** deklarativního
   agenta? U jakých zadání by to úplně stačilo — a které body scénáře (3–5) by
   zůstaly neuzavřené?

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

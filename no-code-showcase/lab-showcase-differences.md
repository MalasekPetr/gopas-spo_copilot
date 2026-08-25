# Lab · Srovnání cest — co naklikáš a co už ne

> Modul: `no-code-showcase` · Odhad: 20 min · Režim: **hands-on (agent builder na PAYG) + instruktorské demo (Studio)**
> Jazyk: — (bez kódu) · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Vyplněná srovnávací tabulka cest (agent builder / Copilot Studio / deklarativní agent /
custom engine) a schopnost říct u konkrétního zadání, **která příčka stačí**.

## Předpoklady

- Proběhlá dema z výkladu (agent builder + Copilot Studio na zadání ze scénáře).
- Rozhodovací osa z [`../agent-landscape/`](../agent-landscape/lab-decision-matrix.md).

## Kroky

### Část A — agent builder (společně s instruktorem)

1. Postavte **společně** Support Asistenta v agent builderu podle
   [`guide-agent-builder.md`](guide-agent-builder.md): instructions + knowledge = knihovna
   `Runbooky`, nasdílení skupině **Students**. Změřte **čas stavby** a pusťte čtyři
   testovací dotazy; výsledky si zapiš — je to první sloupec tabulky a **baseline
   celého týdne**.

### Část A2 — Copilot Studio demo (instruktor)

2. Během dema si zapisuj: čas stavby, kde instruktor narazil, a které ze čtyř testovacích
   dotazů Studio agent zvládl.

### Část B — srovnávací tabulka

3. Vyplň srovnávací tabulku — řádky: **hosting / model a peněženka / knowledge / akce
   s validací / middleware a guardraily / ALM a verzování / governance (Agent 365) /
   strop**; sloupce: agent builder, Copilot Studio.
4. Doplň sloupce **„deklarativní agent (dnes odpoledne)"** a **„custom engine (D2–D5)"**
   zatím jako hypotézu — během týdne si je ověříš a opravíš.

### Část C — rozhodnutí

5. Tři mini-zadání — ke každému přiřkni příčku osy a jednu větu proč:
   - **a)** Interní FAQ nad produktovou dokumentací pro obchodní tým; vlastní si ho
     obchod sám, žádné akce.
   - **b)** Stavový dotaz na tikety v ServiceNow a založení požadavku přes existující
     konektor; zákazník má zavedenou Power Platform governance.
   - **c)** Agent pro externí zákazníky na veřejném webu, vlastní autentizace, smluvní SLA.

## Ověření

- [ ] Tabulka vyplněná pro agent builder a Copilot Studio (sloupce deklarativní/custom engine jako hypotéza).
- [ ] Student umí říct, které z čtyř testovacích dotazů Studio agent zvládl a proč ne zbytek.
- [ ] U tří mini-zadání přiřknutá příčka osy s odůvodněním — aspoň jednou no-code/low-code.

## Fallback

- **Agent builder na PAYG nefunguje** (licenční hranice se změnila): část A jede jako
  instruktorské demo; **Copilot Studio bez licence/trialu**: z nahrávky nebo screenshotů.
  Tabulka i část C fungují beze změny — vedou se o schopnostech, ne o klikání.
- Nestíhá se: část C se zadá jako večerní úloha; tabulka je povinný deliverable.

## Zdroje (Microsoft)

- [Microsoft Copilot Studio — overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
- [Build agents with the Copilot Studio agent builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder)

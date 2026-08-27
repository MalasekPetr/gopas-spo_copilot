# Referenční řešení — lab Rozhodovací matice

> Modul: `agent-landscape` (den 1) · **podklad pro instruktora**, ne pro studenty
> Zadání: [`lab-decision-matrix.md`](lab-decision-matrix.md)

> [!IMPORTANT] V labu odpovědi nejsou — ale v repu ano
> Zadání jsou v [`lab-decision-matrix.md`](./lab-decision-matrix.md) bez odpovědí záměrně.
> Repo je ale public a studenti ho klonují, takže zvídavý student si tuhle sekci najde.
> Nespoléhat na utajení: hodnota labu je v **obhajobě** (část C), ne v uhodnutí. Sekci
> promítat až po části C.

Matice je otočená proti zadání v labu (kritéria = řádky): osm sloupců vedle sebe je
na plátně nečitelných, takhle se dá promítat i psát na tabuli.

| Kritérium | 1 — HR FAQ | 2 — Schvalování cest | 3 — Support Asistent |
|---|---|---|---|
| **Cesta** | deklarativní agent (Toolkit) | **Copilot Studio** | custom engine (Agents SDK) |
| **Vlastník řešení** | HR; IT jen review manifestu | business oddělení; IT dohled | vývojový tým / IT |
| **Infrastruktura** | žádná vlastní | Power Platform (Dataverse, Flow) | vlastní: Node.js endpoint + ticket API |
| **Model a inference** | platí platforma (Copilot licence / PAYG) | Copilot Credits, message billing | **vlastní Azure inference — platíš tokeny** |
| **Governance a registry** | manifest schvaluje admin; ACL vynucuje semantic index | PPAC, DLP, Managed Environments; **auto-registrace do Agent 365** | Entra Agent ID + **explicitní instrumentace** (D4) |
| **ALM** | manifest v gitu, provision z Toolkitu | solutions, environments dev/test/prod | git, PR review, CI/CD, promotion (D5) |
| **Co to stojí** | hodiny práce, provoz nula | dny; licence Studia + kredity | týdny vývoje + trvalý provoz |
| **Kdo to udržuje za 2 roky** | content owner v HR | business vlastník s IT dohledem | **musí existovat vývojový tým** |

**Jeden primární důvod** (lab vyžaduje jeden, ne pět):

1. **Žádné akce** — není co by custom engine přidal; platforma pokrývá celé zadání.
2. **Vlastnictví a governance jsou už na Power Platform** — technologie následuje
   vlastnictví, ne naopak.
3. **Validace parametrů a auditovatelnost** — enforcement musí být v kódu, ne ve slovech.

**Co konkrétně nefunguje u zavržené cesty.** Tady studenti nejčastěji zůstanou
v obecnostech — tlač na konkrétní selhání:

- **Custom engine na zadání 1**: postavíš za týdny to, co platforma dá za hodinu, a HR pak
  nemůže změnit obsah bez vývojáře. Prohra na TCO i na agilitě.
- **Custom engine na zadání 2**: musel bys reimplementovat schvalovací flow a ACL model
  Dataverse — a tvůj agent obejde DLP politiky, které zákazník zavedl. Governance regrese.
- **Studio na zadání 3**: dotaz 3 zavolá ticket API přes konektor **bez validace parametrů**;
  dotaz 4 — topic ani instructions nejsou enforcement, odmítnutí je prosba a není
  auditovatelné. Přesně body 3–5 scénáře.

**Nuance u zadání 1 — obhajitelné je obojí.** Agent builder i deklarativní agent projdou.
Rozlišovač: sdílení napříč organizací + manifest v gitu → deklarativní agent z Toolkitu;
jen pro HR tým, hned, bez IT → agent builder. Kdo to rozliší sám, má osu pochopenou.

**Část C, otázka 6:**

- **Kdyby zákazník měl Agent 365**: nezmění se *která* cesta, ale *co stojí governance*.
  U zadání 1 a 2 nic (registrace jde sama), u zadání 3 klesá cena instrumentace — má kam
  přistát. Argument „pro-code je governance divočina" padá.
- **Kdyby neměl Azure subscription**: zadání 3 se láme. Není inference endpoint ani hosting,
  takže buď subscription vznikne, nebo **se musí změnit zadání** — degraduješ na
  deklarativního agenta a zákazníkovi řekneš, že body 3–5 nedostane. Nejcennější věta
  celého labu: architektura je funkcí omezení, ne přání.

> [!WARNING] Neuvádět z hlavy
> U zadání 1 je v řádku governance jen schvalování manifestu adminem. **Není ověřeno, jestli
> se deklarativní agenti registrují do Agent 365 automaticky** — doložená je auto-registrace
> Studio agentů a explicitní instrumentace pro-code agentů. Buď ověř před blokem, nebo to
> u tabule přiznej jako otevřenou otázku a vrať se k tomu v `agent-365-governance` (D4).


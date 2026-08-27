# Instructor notes — Mapa cest tvorby agentů & rozhodovací osa

## Timing

- ~60 min výklad + 45 min lab. Nejdiskutovanější blok kurzu — ale diskusi o Copilot Studiu
  teď odkládej do `no-code-showcase`, který jede hned potom a má ji v zadání. Výklad se
  proti původní verzi zkrátil: živou materializaci osy převzal showcase.
- Při skluzu z onboardingu: lab zkrátit na část A + diskuse (viz fallback v labu).

## Go/no-go — otestovat před během

- Projít **aktuální** stav rozhodovací osy. Tento blok stárne nejrychleji z celého kurzu:
  ověřit rozsah publikace Foundry agentů do M365 Copilotu/Teams, feature split Copilot Studia
  a jestli od posledního běhu nepřišlo oznámení, které osu mění.
- Připravit si jednu vlastní zákaznickou historku ke každé ze tří cest — bez ní blok sklouzne
  do přednášky o produktových názvech.

## Referenční řešení labu — matice (část B)

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

## Tripwires

- **Nesklouznout do prodeje pro-code.** Publikum jsou pro-code lidé a rádi si nechají potvrdit,
  že low-code je hračka. To je pedagogicky škodlivé: u zákazníka pak neobhájí volbu, jen ji
  vyhlásí. Zadání 2 v labu je záměrně **správně** Copilot Studio — referenční řešení všech
  tří zadání je v sekci výše.
- Studenti pletou **Agents SDK s orchestrátorem**. Držet čistě: SDK = transport, stav, routing;
  orchestrace = Agent Framework nebo vlastní kód. Microsoft to říká explicitně — Agents SDK
  není model, orchestrační engine ani no-code builder.
- Otázka „Copilot Studio už není Power Platform, viď?" padne skoro vždy. **Je** — PPAC, DLP,
  Managed Environments, Dataverse, Copilot Credits, ALM. Marketing ho prezentuje šířeji, ale
  admin a licenční model je Power Platform. Tohle je informace, kterou student jinde nedostane.
- **Agent 365 agenty nehostuje ani netvoří.** Studenti to čekají jako „Copilot Studio pro
  enterprise". Je to control plane.
- Nezabíhat do instrumentace Agent 365 — to je [`../../agent-365-governance/`](../../day-5/agent-365-governance/).
  Tady jen zasadit do mapy.

## Otázky, které padnou

- „Proč Microsoft nesjednotí nástroje?" — protože cílí různá publika a různé vlastnictví
  řešení. Koexistence je záměr, ne dluh.
- „Co když zákazník chce Copilot Studio a my víme, že to nevyjde?" — nabídnout matici z labu
  jako artefakt do jednání, ne názor proti názoru.
- „Umře Bot Framework?" — role Azure Bot Service se zúžila na registraci kanálu; ověřit
  aktuální stav před během.

## Vazby

- Zpět: toolchain z `onboarding`.
- Dopředu: osa se materializuje hned v `no-code-showcase` (agent builder + Copilot Studio
  naživo); deklarativního agenta student postaví ještě dnes v `declarative-agents`, aby
  srovnání nezůstalo teoretické; rozhodnutí „custom engine" se realizuje v
  `agents-sdk-core` (ráno D2);
  governance vrstva mapy se otevře v `agent-365-governance` (D4).
- Nit rozhodování: tenhle blok → `knowledge-grounding` (kdy retrieval nedělat sám) →
  `agent-framework` (kdy multi-agent) → `event-driven-hosting` (kde to běží).

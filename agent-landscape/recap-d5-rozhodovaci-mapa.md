# Rekapitulace · Rozhodovací mapa po čtyřech dnech

> Modul: `agent-landscape` · **Den 5, otvírák** · Odhad: **20 min** · Režim: pair-share, ne výklad
> Doplňuje [`README.md`](README.md) (pět cest) a [`comparison-agent-paths.md`](comparison-agent-paths.md) (rozdílová matice)

## Proč se mapa probírá podruhé

V pondělí byla mapa **informace**. Studenti si ji přečetli, ale neměli s čím ji porovnat.

Za čtyři dny postavili custom engine agenta a dvakrát narazili na to, co platforma umí sama:
semantic index s vynucením oprávnění (D3) a permission trimming, který nemuseli programovat.
Znají cenu vlastního retrievalu, vlastní orchestrace i vlastní telemetrie — **v korunách,
z vlastního logu**.

Ta samá tabulka je proto dnes něco jiného: **je to rozhodovací nástroj, ne přehled produktů.**
A rozhodnutí, které z ní dnes plyne, jde do capstonu jako první řádek blueprintu.

> [!TIP] Formát
> Neopakuj pondělní výklad. Promítni tabulku, polož otázku a nech dvojice odpovídat.
> Instruktor mluví jen u toho, co skupina nevysloví sama.

## Šest cest, ne pět

| Cesta | Kdo ji vlastní | Kde běží | Tvrdý strop |
|---|---|---|---|
| **Copilot agent builder** | koncový uživatel | uvnitř M365 Copilotu | bez ALM, omezené sdílení |
| **SharePoint agent** | **vlastník obsahu**, bez opuštění webu | u webu, žije s jeho oprávněními | Q&A nad obsahem, žádné akce, **jeden list a nic jiného** |
| **Copilot Studio** | business / citizen dev + IT | Power Platform | nejsilnější akce: konektory, MCP, autonomní triggery, DLP |
| **Agents SDK — custom engine** | vývojový tým | **tvoje** infrastruktura | vlastní model a orchestrace = vlastní práce a vlastní účet |
| **Agent Framework** | vývojový tým | **uvnitř** SDK aplikace | není samostatná cesta — orchestrační knihovna; jen C#/Python |
| **Foundry Agent Service** | vývojový / platform tým | PaaS v Azure | Foundry Control Plane + Entra Agent ID |

> [!IMPORTANT] Agent Framework není čtvrtá cesta
> Běží uvnitř SDK aplikace. Kdo ho v mapě uvádí jako sourozence custom enginu, plete
> **vrstvu** s **produktem**. Proto má tabulka šest řádků, ale cest je pět.

**Skills jsou jiná osa.** Nejsou cesta tvorby agenta: `SKILL.md` je rozšíření chování něčeho,
co už běží (viz [`../../skills/`](../skills/)). Nemají runtime, akce ani manifest a řídí se
právy na souborech. Cesty odpovídají na *„čím to postavit"*, Skills na *„jak zpřesnit chování"*.
Do jedné tabulky nepatří.

## Pět otázek — pořadí je záměrné

Nech dvojice odpovědět na každou za sebe a teprve pak komentuj. Zdroj:
[`comparison-agent-paths.md`](comparison-agent-paths.md).

1. **Kdo to bude vlastnit?**
   koncový uživatel → Builder · vlastník webu → SharePoint agent · maker → Studio · vývojový tým → SDK

2. **Potřebuješ akce?**
   konektory / MCP / autonomní triggery → Studio · vlastní API přes OpenAPI → Toolkit · žádné → Builder nebo SharePoint agent

3. **Potřebuješ data z listů?**
   analytika a agregace → **jedině Studio** (až 10 listů) · lookup → Builder (1 list) ·
   Toolkit **listy neumí** — manifest 1.7 zná `list_id` jako knihovnu, ne list

4. **Potřebuješ source control a CI/CD?**
   → Toolkit, bez diskuze

5. **Potřebuješ vlastní model, vlastní orchestraci nebo běh mimo M365?**
   → teprve tady custom engine

> [!NOTE] Věta, kterou si mají odnést
> **Custom engine je poslední možnost, ne první.** Když na pátou otázku odpovíš „ne",
> platíš hostingem, instrumentací a vlastním retrievalem za něco, co ti platforma dá zadarmo.
> Tuhle větu si tento týden zasloužili — čtyři dny ji dokazovali vlastníma rukama.

## Šestá otázka: kdy si stavět retrieval sám

> [!IMPORTANT] Tohle je odpověď na dotaz skupiny z úterý
> V úterý padla otázka na vlastní vektorizaci a slíbil se k ní návrat. Odpověď **není
> tutoriál na chunking** — je to rozhodnutí, a proto patří sem, do mapy.
>
> **Podklad pro instruktora:** [`explainer-vlastni-retrieval.md`](explainer-vlastni-retrieval.md)
> — čtyřminutový výklad postavený na **jejich vlastním** `retrieve()`, včetně čtyř otázek,
> kterými se to odučí bez jediného diagramu. Přečti si ho před blokem.
>
> **A slíbené demo se dá splnit doslova:** v repu je varianta agenta přes **Copilot
> Retrieval API** ([`../../knowledge-grounding/solution/agent-retrieval-api.ts`](../knowledge-grounding/solution/agent-retrieval-api.ts))
> — tentýž agent, jiná `retrieve()`. Sémantické hledání, **bez přepisu dotazu a bez
> stahování obsahu**. Studenti na tom uvidí o **jedno kolo na turn míň** ve vlastním
> `usage-log.jsonl`. Recept a licenční matice jsou v explaineru; **demo jet studentským
> tokenem**, s lektorským účtem vrací API prázdno.

Ve středu jste viděli, co dostanete zadarmo: **semantic index vyhledá nad tenantem a vynutí
oprávnění volajícího**. Nic z toho jste neprogramovali. Vlastní retrieval si stavíte, jen když
platí aspoň jedno:

| Kdy ano | Proč to platforma neřeší |
|---|---|
| Data **nejsou v M365** | semantic index indexuje tenant, ne cizí systém |
| Potřebuješ **vlastní ranking nebo chunking** | index je černá skříňka, neladíš ho |
| Potřebuješ **jinou hranici oprávnění** než uživatelovu | ACL trimming je vlastnost indexu, ne volba |
| **Latence nebo cena** indexu ti nevyhovují | změřené, ne tušené |
| Doména vyžaduje **embeddingy nad vlastním korpusem** | terminologie, kterou obecný model nezná |

**A co za to platíš:** chunking a jeho ladění, embedding pipeline a její běh, vektorové úložiště,
hybrid ranking, **a hlavně security trimming, který si musíš vynutit sám** — semantic index ho
dělá za tebe a chyba v něm je únik dat, ne horší odpověď.

Kdo chce detail, má ho v [`../../opt-custom-retrieval/`](../opt-custom-retrieval/) —
105 minut čtení k samostudiu, včetně toho, proč je vlastní vektorizace v kontextu
Microsoft 365 **rozhodnutí s cenovkou, ne výchozí stav**.

## Co studenti dostanou do ruky

**[`../../perf-cost-lifecycle/tekute-pisky-retrievalu.html`](../perf-cost-lifecycle/tekute-pisky-retrievalu.html)**
— výstup z projektu, ne slajd. Je to změřená odpověď na čtyři otázky, které během
týdne skutečně padly:

- proč hledání trefovalo špatné runbooky (`.md` je lexikální, `.pdf` sémantický),
- proč jsme na jeden dotaz volali model dvakrát (přepis dotazu je **kompenzace**),
- co která ze tří cest stojí — a proč je nejlevnější ta, která nic nenašla,
- kdy si stavět vlastní vektorizaci (sedm fází RAG a kdo je ve vašem kódu udělal).

Poslední sekce je o tom, proč se tomu říká tekuté písky: **tři rozhraní, tři různé
odpovědi na tentýž obsah**, a tři tiché chyby, které všechny vrátily `200`.

> [!TIP] Jak to použít v bloku
> **Neprocházej to celé.** Promítni dvě věci — tabulku `.md` vs. `.pdf` (0/4 → 4/4)
> a hlášku o chybějící hlavičce `Accept-Language`, která vrací `200` a prázdno.
> Dohromady tři minuty. Zbytek si přečtou; proto to dostanou jako soubor.

## Výstup do capstonu

Každý student odchází z bloku s **jednou větou**, kterou si zapíše a v části B capstonu
ji obhájí:

> *„Pro zadání X volím cestu Y, protože potřebuji Z — a nepotřebuji W."*

Ta druhá polovina věty je důležitější než první. Rozhodnutí bez toho, co jsi **ne**potřeboval,
není rozhodnutí, ale zvyk.

## Ověření

- [ ] Student umí vyjmenovat pět cest a říct, proč je Agent Framework řádek navíc, ne cesta.
- [ ] Student umí říct, čím se liší Skills od cest tvorby.
- [ ] Student odpoví na pátou otázku pro **vlastní** zadání z praxe, ne pro Support Asistenta.
- [ ] Student umí jmenovat aspoň dvě podmínky, za kterých má smysl stavět vlastní retrieval.
- [ ] Věta pro capstone je zapsaná, včetně části „a nepotřebuji…".

## Zdroje (Microsoft)

[Agent Builder — knowledge](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge) · [SharePoint agents](https://learn.microsoft.com/en-us/sharepoint/get-started-sharepoint-agents) · [Declarative agent manifest 1.7](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.7) · [Generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions) · [Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview)

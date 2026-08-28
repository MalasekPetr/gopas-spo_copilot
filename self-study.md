# Materiál k samostudiu

Moduly, které se v běhu neodučí, ale zůstávají v repu jako **hotový materiál pro studenty**.
Moduly, které se v běhu neodučí a jsou k samostudiu — viz
[`agenda.md`](./agenda.md).

> [!NOTE] Proč to není mazání
> Reálná kapacita je ~310 min odučeného obsahu denně, ne 360+. Zbytek týdne se musel vejít
> do nosné linky. Tyhle moduly jsou **kompletní a čitelné samostatně** — student je dostane
> s odkazem v capstonu, ne jako tichou absenci. Žádný povinný modul ani capstone na nich
> nezávisí; to je podmínka, která je udržela vyřaditelné.

## Vyřazené moduly

| Modul | Proč vyřazen | Co v něm student najde |
|---|---|---|
| [`event-driven-hosting`](./day-5/event-driven-hosting/) | studenti nemají Azure subscription — blok byl stejně jen instruktorské demo; „hosting v kostce" složen do `agent-365-governance` | osa hostingu (App Service, Container Apps, Functions, Durable, Logic Apps, Foundry Agent Service), timeout a retry patterny, idempotence, publikace do kanálů |
| [`opt-custom-retrieval`](./day-3/opt-custom-retrieval/) | rozhodovací část („stavět vlastní retrieval, nebo pronajmout index?") se odučí v **bloku 3 dne 5** ([`retrieval-reality`](./day-5/retrieval-reality/README.md)); tenhle modul je hloubka pod tím rozhodnutím | chunking, embeddings, hybrid ranking, security trimming — a hlavně *kdy retrieval nedělat sám* |
| [`agent-framework/lab-multi-agent-triage.md`](./day-5/agent-framework/lab-multi-agent-triage.md) | jen lab; modul samotný se učí na D5 jako informativní blok | ruční orchestrace triage + resolver nad Agents SDK, měření ceny multi-agent rozhodnutí |
| [`perf-cost-lifecycle`](./day-5/perf-cost-lifecycle/) | elastický ventil; jádro (token budget) složeno do capstonu | prompt caching, token budget, model retirements, promotion dev → test |
| [`orchestry-governance`](./day-2/orchestry-governance/) | srovnávací rámec, leaf; 10 min shrnutí složeno do `agent-365-governance` | third-party governance jako alternativa k Agent 365 |
| [`opt-prompting-fundamentals`](./day-1/opt-prompting-fundamentals/) | převzato z GOC224, pro pro-code publikum pod úrovní | anatomie promptu, orchestrator, **vrstvy instrukcí** (tabulka je vytažená do `declarative-agents`) |

## Referenční dokumenty

| Dokument | K čemu |
|---|---|
| [`agent-landscape/comparison-agent-paths.md`](./day-1/agent-landscape/comparison-agent-paths.md) | rozdílová matice čtyř cest tvorby **včetně SharePoint agentů** — schopnosti, exkluzivity, rozhodovací osa. Hodnotnější než tabulka pěti cest ve výkladu. |

## Převzato z GOC224 a zařazeno do osnovy

Opak vyřazování — moduly, které se do kurzu **přidaly** na základě zájmu skupiny
(2026-08-25). Zdroj: repo `gopas-goc224`, odkazy přepojené na tento kurz.

| Modul | Kde se učí | Proč |
|---|---|---|
| [`skills`](./day-2/skills/) | D2, otvírák | Skills jako rozšíření Copilot in SharePoint — nejbližší vstup pro SPFx publikum |
| [`sharepoint-agents`](./day-2/sharepoint-agents/) | D2, instruktorské demo | agent vzniklý nad knihovnou bez opuštění webu; ukazuje tvrdý strop single-source |
| SAM (hloubka) | složeno do [`data-hygiene`](./day-2/data-hygiene/) | tři pilíře, RAC vs. RCD, licenční past — nahrazuje samostatný SAM blok |

## Sloučené bloky

`middleware-policy` + `security-risk` → **jeden blok** „Bezpečnost & middleware — útok
a obrana jako kód" ([`middleware-policy/`](./day-4/middleware-policy/)). Oba učily totéž
z opačných stran: útok ukáže, že obrana v promptu nedrží, middleware je odpověď. Sloučením
odpadl druhý rozjezd a XPIA má bezprostřední odpověď místo dvoudenní pauzy.

## Co si odnášíš z projektu

Dva materiály v [`perf-cost-lifecycle/`](./day-5/perf-cost-lifecycle/), oba se otevřou
dvojklikem z klonu a fungují offline:

- [`day-5/retrieval-reality/`](./day-5/retrieval-reality/README.md) — změřená odpověď
  na to, proč se agent choval, jak se choval. Odučí se v bloku 3 dne 5; text je
  použitelný i jako podklad do zákaznického rozhovoru.
- [`roi-calculator.html`](./day-5/perf-cost-lifecycle/roi-calculator.html) — kalkulačka
  nákladů a návratnosti. Přetáhni do ní svůj `usage-log.jsonl` a počítá
  s **tvými** čísly.

Kompletní měření se surovými daty a návodem na reprodukci:
[`mereni-retrieval-vs-search.md`](./day-5/perf-cost-lifecycle/mereni-retrieval-vs-search.md).

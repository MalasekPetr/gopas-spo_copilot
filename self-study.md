# Materiál k samostudiu

Moduly, které se v běhu neodučí, ale zůstávají v repu jako **hotový materiál pro studenty**.
Rozhodnutí prvního běhu (2026-08-24) po rekalibraci timingu — viz [`agenda.md`](agenda.md).

> [!NOTE] Proč to není mazání
> Den 1 ukázal, že reálná kapacita je ~245–310 min odučeného obsahu denně, ne 360+.
> Zbytek týdne se musel vejít do nosné linky. Tyhle moduly jsou **kompletní a čitelné
> samostatně** — student je dostane s odkazem v capstonu, ne jako tichou absenci.
> Žádný povinný modul ani capstone na nich nezávisí; to je podmínka, která je udržela
> vyřaditelné.

## Vyřazené moduly

| Modul | Proč vyřazen | Co v něm student najde |
|---|---|---|
| [`day-2/opt-custom-retrieval`](day-2/opt-custom-retrieval/) | volitelný leaf od začátku; vlastní vektorizace je vedlejší kolej kurzu | chunking, embeddings, hybrid ranking, security trimming — a hlavně *kdy retrieval nedělat sám* |
| [`day-4/marketplace-agents`](day-4/marketplace-agents/) | case study bez závislostí; rozhodnutí ANO/NE se dá udělat z checklistu | podmínky publikace do Marketplace, validační kritéria, case study Normiqa Navigator |
| [`day-5/perf-cost-lifecycle`](day-5/perf-cost-lifecycle/) | elastický ventil; jádro (token budget) složeno do capstonu | prompt caching, token budget, model retirements, promotion dev → test |
| [`day-5/orchestry-governance`](day-5/orchestry-governance/) | srovnávací rámec, leaf; 10 min shrnutí složeno do `agent-365-governance` | third-party governance jako alternativa k Agent 365 |
| [`day-1/opt-prompting-fundamentals`](day-1/opt-prompting-fundamentals/) | převzato z GOC224, pro pro-code publikum pod úrovní | anatomie promptu, orchestrator, **vrstvy instrukcí** (tabulka je vytažená do `declarative-agents`) |

## Referenční dokumenty

| Dokument | K čemu |
|---|---|
| [`day-1/agent-landscape/comparison-agent-paths.md`](day-1/agent-landscape/comparison-agent-paths.md) | rozdílová matice čtyř cest tvorby **včetně SharePoint agentů** — schopnosti, exkluzivity, rozhodovací osa. Hodnotnější než tabulka pěti cest ve výkladu. |

## Sloučené bloky

`middleware-policy` + `security-risk` → **jeden blok** „Bezpečnost & middleware — útok
a obrana jako kód" ([`day-3/middleware-policy/`](day-3/middleware-policy/)). Oba učily totéž
z opačných stran: útok ukáže, že obrana v promptu nedrží, middleware je odpověď. Sloučením
odpadl druhý rozjezd a XPIA má bezprostřední odpověď místo dvoudenní pauzy.

## Co s tím po prvním běhu

- Ověřit, jestli vyřazené moduly někdo skutečně otevřel (zpětná vazba na konci týdne).
- Zvážit, jestli `opt-custom-retrieval` a `perf-cost-lifecycle` nemají být trvale mimo
  osnovu — pak upravit i [`marketing/`](marketing/).
- Přeměřit timing dne 2 a doladit odhady v `instructor-notes.md`.

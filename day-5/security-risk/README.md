# Bezpečnost & řízení rizik — sloučeno

> [!IMPORTANT] Tento modul se samostatně neodučí
> Rozhodnutím prvního běhu (2026-08-24) byl sloučen s `middleware-policy` do jednoho bloku
> **„Bezpečnost & middleware — útok a obrana jako kód"**:
> [`../../day-3/middleware-policy/`](../../day-3/middleware-policy/) (den 4).

## Proč

Oba moduly učily totéž z opačných stran. `security-risk` ukazoval, že obrana v promptu
nedrží; `middleware-policy` stavěl obranu, která drží. Odděleně to znamenalo:

- stavět obranu dvakrát (jednou jako guardrail, podruhé jako reakci na útok),
- nechat XPIA dva dny bez odpovědi,
- dvakrát rozjíždět stejné téma.

Sloučený blok jede v pořadí **útok → proč prompt nestačí → middleware → scope**, což je
i pořadí, v jakém se to řeší v praxi.

## Kde co skončilo

| Obsah | Kde je teď |
|---|---|
| Model útoku, prompt injection vs. XPIA | [`middleware-policy/README.md`](../../day-3/middleware-policy/README.md), sekce 1–2 |
| Exfiltrace a minimalizace scope | tamtéž, sekce 6 |
| Sanitizace výstupů, watermarking | tamtéž, sekce 8–9 |
| Útok na vlastního agenta (lab) | [`lab-middleware-pipeline.md`](../../day-3/middleware-policy/lab-middleware-pipeline.md), část A |
| Zdrojový materiál útoků a scope | [`lab-injection-and-scope.md`](lab-injection-and-scope.md) — zůstává jako podklad |

Složka zůstává v repu, aby nepřestaly fungovat odkazy z ostatních modulů a z glosáře.
Přehled všech změn po rekalibraci: [`../../self-study.md`](../../self-study.md).

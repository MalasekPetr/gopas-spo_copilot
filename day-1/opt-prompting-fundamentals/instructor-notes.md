# Instructor notes — Prompting fundamentals

## Timing

- 45 min výklad + 30 min lab. **V tomto běhu se neodučí** — modul je samostudium
  (viz [`../../self-study.md`](../../self-study.md)). Timing platí pro případ, že by se
  do osnovy vrátil; tabulka vrstev instrukcí je jádro, nekrátit.

## Tripwires

- Pojmy držet přesně dle README tabulky — studenti si jinak spojí Memory s context window. Kreslit vrstvy na tabuli.
- Memory/personalizace = **preview** — neslibovat chování; zmínit, že Purview retence/audit na paměť nesahá (governance dotek pro D5).
- XPIA zmínit u Agent Instructions jednou větou (instrukce nepatří do knowledge) — hlubší bezpečnost až D5.
- PAYG: hned ráno zopakovat pravidlo z ways-of-working — iterace ano, bezcílné mlácení do chatu ne.

## Lab

- Krok 5 (permissions test) je nejcennější moment — nechat studenty říct nahlas, že cizí data nevidí; váže na licence vs. permissions z D1.
- Hlídat čas: 3 verze stačí, nenechat soutěžit v počtu promptů.

## Vazby

- Zpět: `agent-landscape` (grounding, datové hranice), `onboarding` (PAYG chování,
  tři peněženky).
- Dopředu: Agent Instructions → `declarative-agents` (D2 — tabulka vrstev je tam vytažená
  a studenti ji uvidí u psaní instructions); orchestrator jako *cizí* pipeline →
  `prompt-orchestration` (D3), kde je orchestrace poprvé vlastní; XPIA →
  `middleware-policy` (D4, sloučený blok útok + obrana).

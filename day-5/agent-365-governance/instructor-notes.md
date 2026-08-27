# Instructor notes — Agent 365, Entra Agent ID & instrumentace

## Timing

**40 min**, blok 2. Části A a D jedeš ty, **části B a C jsou instruktorské demo** —
tak to vede i [`../../environment.md`](../../environment.md). Studenti píšou jen část D
(protipříklad + třívětná argumentace), a to je pro architekty to cennější.

Zahrnuje 10 min srovnání s Orchestry (modul [`../../day-2/orchestry-governance/`](../../day-2/orchestry-governance/)
je v samostudiu, jeho srovnávací tabulka se sem složila).

## Go/no-go

- **Agent 365 SDK a CLI je mladý povrch (GA 2026-05-01) — API se mění.** Projít CLI příkazy
  **před každým během**, ne jednou. Nejcitlivější blok kurzu na verze.
- **Ověřit, že lektorská licence je aktivní**, a projet demo registry/observability den
  předem. Snímky obrazovky mít jako zálohu — bez vizuálu blok ztrácí polovinu účinku.
- Ověřit, co se registruje **automaticky** (Copilot Studio, Foundry) vs. explicitně —
  to je nosná pointa a musí být přesná.
- Ověřit cenu ($15/user/měs) a jestli je stále standalone i v E7.

## Tripwires

- **„Agent 365 je Copilot Studio pro enterprise."** Není — je to control plane.
  Agenty nehostuje ani netvoří. Padne to skoro vždy.
- **„Licencujeme agenty."** Ne, licencuje se **uživatel**. Časté při rozpočtování.
- **Telemetrie není audit.** Studenti do telemetrie nalijí obsah dotazů včetně PII.
  Část B5 je na to explicitně — je to GDPR téma, ne jen dobrá praxe.
- Záměna **Foundry Control Plane** a **Agent 365**: dva control plany, jiný pohled
  (platformní tým v Azure vs. IT/security v M365).
- **Entra Agent ID není přejmenovaná app registrace.** Identita agenta umožňuje access
  reviews, lifecycle politiky a owner attestation.
- Nezabíhat do útoků — ty jsou [`../../day-4/security-risk/`](../../day-4/security-risk/).
  Tady je viditelnost, tam obrana.

## Argument, který si mají odnést

Zákazník i vlastní IT řeknou: *„Copilot Studio má governance, pro-code je divočina."*
Odpověď: **instrumentovaný pro-code agent je v témže registry, s vlastní identitou
a telemetrií — a navíc má vlastní middleware, testy a source control.**
Neinstrumentovaný pro-code agent tu kritiku ale zaslouží.

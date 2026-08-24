# Instructor notes — Agent 365, Entra Agent ID & instrumentace

## Timing

- ~40 min výklad + 45 min lab, **včetně 10 min srovnání s Orchestry** (modul
  `orchestry-governance` byl vyřazen do samostudia — jeho srovnávací tabulka se sem složila).
  **Blok 2 dne 5.**
- **Nejdůležitější blok kurzu z hlediska diferenciace.** Když se má něco jiného obětovat,
  ne tenhle.
- Části B a D nesou hodnotu i bez licence — chránit je časově.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Agent 365 SDK / CLI je mladý povrch (GA produktu 2026-05-01) — API se mění.**
  Přebuildovat `solution/` a projít CLI příkazy **před každým během**, ne jednou.
  Tenhle blok je z celého kurzu nejcitlivější na verze.
- **Agent 365 licence pro lektora je rozhodnutá** (2026-08-07) — před během ověřit, že
  je aktivní (vč. prerekvizit) a demo registry/observability projet den předem. Snímky
  obrazovky mít jako zálohu — bez vizuálu blok ztrácí polovinu účinku.
- Ověřit, co se do registry registruje **automaticky** (Copilot Studio, Foundry) vs.
  explicitně — to je nosná pointa a musí být přesná.
- Ověřit cenu ($15/user/měs) a jestli je stále standalone i v E7.
- Ověřit, jestli Agents SDK nezískalo nativní Agent 365 integraci — zjednodušilo by to lab.

## Tripwires

- **„Agent 365 je Copilot Studio pro enterprise."** Není — je to control plane.
  Agenty nehostuje ani netvoří. Padne to skoro vždy.
- **„Licencujeme agenty."** Ne — licencuje se **uživatel**. Časté nedorozumění při
  rozpočtování.
- **Telemetrie ≠ audit.** Studenti do telemetrie nalijí obsah dotazů včetně PII.
  Část B5 je na to explicitně; je to zároveň GDPR téma, ne jen dobrá praxe.
- Záměna **Foundry Control Plane** a **Agent 365**. Dva control plany, jiný pohled
  (platformní tým v Azure vs. IT/security v M365). Sync existuje.
- **Entra Agent ID vs. app registrace** — studenti to berou jako přejmenování.
  Není: identita agenta umožňuje access reviews, lifecycle politiky a owner attestation.
- Nezabíhat do bezpečnostních útoků — to je [`../../day-5/security-risk/`](../../day-5/security-risk/).
  Tady je viditelnost, tam je obrana.

## Argument, který si mají odnést

Zákazník i vlastní IT často řeknou: *„Copilot Studio má governance, pro-code je nekontrolovaná
divočina."* Po tomhle bloku má student konkrétní odpověď: **instrumentovaný pro-code agent
je v témže registry, s vlastní identitou, s telemetrií — a navíc má věci, které low-code
nemá (vlastní middleware, vlastní testy, source control).** Neinstrumentovaný pro-code agent
tu kritiku ale zaslouží. Tohle je ta věta, za kterou lidé platí kurzovní cenu.

## Vazby

- Zpět: `middleware-policy` (logování z pipeline je vstup telemetrie),
  `actions-graph` (Entra Agent ID a hranice oprávnění), `event-driven-hosting`
  (hostovaný a publikovaný agent potřebuje identitu).
- Dopředu: `evaluation-quality` (bez telemetrie se evaluace dělá naslepo — přímá návaznost,
  jede hned po tomhle bloku), `security-risk` (auditní stopa jako detekce),
  `perf-cost-lifecycle` (telemetrie jako vstup nákladové optimalizace),
  `capstone` (argumentace z části D patří do prezentace).
- Governance nit: `actions-graph` → `middleware-policy` → **tady** → `security-risk`.

# Den 1 — Mapa stacku a no-code/low-code

Dopoledne onboarding a toolchain, pak rozhodovací vrstva (za tu zákazník platí nejvíc)
a její živá materializace v no-code/low-code showcase.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Onboarding, prostředí & toolchain | [`onboarding`](onboarding/) | P |
| 2 | Mapa cest tvorby agentů & rozhodovací osa | [`agent-landscape`](agent-landscape/) | P |
| 3 | No-code a low-code cesty — showcase | [`no-code-showcase`](no-code-showcase/) | P |
| — | Základy promptování a agentní anatomie | [`opt-prompting-fundamentals`](opt-prompting-fundamentals/) | V |

> [!NOTE] Rozhodovací vrstva **před** kódem. Blok 2 odpovídá na otázku, se kterou studenti
> reálně přicházejí od zákazníků — kdy deklarativní agent, kdy custom engine, kdy Copilot
> Studio, kdy Foundry. Blok 3 ji materializuje: agent builder a Copilot Studio naživo,
> na zadání ze scénáře. Celý den jede **bez model endpointu** (jen tenant + PAYG).

Reálná zátěž **245 min** (90 + 105 + 50). Nejnepředvídatelnější je blok 1 — toolchain
u 20 strojů (VS Code, Agents Toolkit, Node.js, přihlášení do M365).

> [!IMPORTANT] Co se skutečně stalo v prvním běhu (2026-08-24)
> Plánované byly čtyři bloky (360 min), odučily se tři (245 min) a naplnily celý den.
> **`declarative-agents` se přesunul na start dne 2.** Z toho vznikl časový etalon,
> podle kterého jsou přeplánované dny 2–5 — viz [`../agenda.md`](../agenda.md).

## Materiál k samostudiu

- [`opt-prompting-fundamentals`](opt-prompting-fundamentals/) — anatomie promptu,
  orchestrator a **vrstvy instrukcí**. Tabulka vrstev je vytažená do
  [`../day-2/declarative-agents/`](../day-2/declarative-agents/), kde se píší Agent Instructions.
- [`agent-landscape/comparison-agent-paths.md`](agent-landscape/comparison-agent-paths.md) —
  rozdílová matice čtyř cest tvorby **včetně SharePoint agentů**, po jednotlivých
  schopnostech. Detailnější než tabulka pěti cest ve výkladu; dát studentům jako referenci.

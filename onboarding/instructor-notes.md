# Instructor notes — Onboarding, prostředí & toolchain

## Timing

- ~30 min výklad (pravidla, repo, tři peněženky) + 45 min lab. Rezerva 15 min.
- **Nejnepředvídatelnější blok kurzu.** U 20 strojů se vždy něco nenainstaluje.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Model endpoint = instruktorský Foundry deployment** (rozhodnuto 2026-08-24) —
  nasazený a otestovaný. Bez něj nepojede LLM turn v `agents-sdk-core` (opener D2) ani
  7 dalších modulů; den 1 ho nepotřebuje, klíče se rozdávají ráno D2. Hard cap na
  deploymentu nastavený — 20 studentů v loopu utrží účet.
- Scaffoldnout referenční projekt **den předem** aktuální verzí Toolkitu. Názvy šablon
  se mění; screenshot v labu zestárne rychleji než text.
- Ověřit, že rozšíření VS Code lze na kurzovních strojích instalovat (politika).
- Ověřit `node --version` (LTS) na jednom stroji z učebny, ne jen na svém.
- Účty `user.11`–`user.30` aktivní, hesla vytištěná, MFA vyřešená.

## Tripwires

- **Studenti si uloží klíč k modelu do `appsettings.json` a commitnou ho.** Explicitně
  ukázat user secrets / `.env` a nechat je spustit `git status`. Tohle je první governance
  lekce kurzu a padne přirozeně.
- Očekávání „Copilot Credits mi zaplatí model" — vyvrátit hned tady, jinak se to vrací
  celý týden. Odkázat na tři peněženky v glosáři.
- Nezdržet se na Teams/Bot registraci — Agents Playground ji **nepotřebuje**. Studenti
  s Bot Framework historií to čekají a ptají se.
- Nespouštět diskusi „a co Copilot Studio" už tady — to je celý blok
  [`../agent-landscape/`](../agent-landscape/) hned po tomhle. Zaparkovat.

## Vazby

- Dopředu: toolchain je předpoklad pro `agents-sdk-core` a všechny další laby.
  Nosná linka startuje ve `scenario-support-agent.md`.
- Bezpečnostní nit: user secrets → hranice oprávnění (`actions-graph`) →
  scope minimalizace (`security-risk`).

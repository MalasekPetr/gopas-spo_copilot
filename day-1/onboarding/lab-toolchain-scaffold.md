# Lab · Toolchain a první scaffold

> Modul: `onboarding` · Odhad: 45 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../agents-sdk-core/scenario-support-agent.md`](../agents-sdk-core/scenario-support-agent.md)

## Cíl

Mít funkční pro-code prostředí a scaffoldnutý projekt agenta, který se lokálně spustí
v Microsoft 365 Agents Playground — ještě bez modelu, jen echo.

## Předpoklady

- Účet `user.NN@spdemo.online` a heslo (přiděleno instruktorem).
- Klíč / endpoint k modelu (přiděleno instruktorem — viz [`../../environment.md`](../../environment.md)).
- Práva instalovat rozšíření VS Code na kurzovním stroji.

## Kroky

### Část A — toolchain

1. <!-- TODO: overit .NET SDK verzi, `dotnet --version` -->
2. <!-- TODO: nainstalovat rozsireni Microsoft 365 Agents Toolkit ve VS Code -->
3. <!-- TODO: prihlasit se v Toolkitu do M365 uctem user.NN -->
4. <!-- TODO: ulozit klic k modelu do user secrets / .env (NIKDY do repa) -->

### Část B — scaffold a lokální běh

5. <!-- TODO: Create a New Agent/App -> sablona custom engine agent (C#) -->
6. <!-- TODO: spustit v Agents Playground, poslat zpravu, videt echo odpoved -->
7. <!-- TODO: projit strukturu projektu: kde je AgentApplication, kde manifest, kde konfigurace -->

### Část C — repo kurzu

8. <!-- TODO: naklonovat / otevrit repo kurzu, projit agenda.md a GLOSSARY.md -->
9. <!-- TODO: precist scenario-support-agent.md — co budeme cely tyden stavet -->

## Ověření

- [ ] `dotnet --version` vrací podporovanou verzi.
- [ ] Toolkit je přihlášený účtem `user.NN@spdemo.online`.
- [ ] Projekt se spustí v Agents Playground a odpoví na zprávu.
- [ ] Klíč k modelu **není** v žádném trackovaném souboru (`git status` je čistý).
- [ ] Student umí říct, co je cílová architektura Support Asistenta na konci týdne.

## Fallback

- Instalace rozšíření blokovaná politikou stroje: instruktor rozdá předpřipravený projekt
  a student pracuje bez scaffoldingu (zbytek týdne to neblokuje — scaffold se dělá jen tady).
- Model endpoint ještě nerozhodnutý: část B se dokončí v echo režimu, LLM turn se doplní
  v [`../agents-sdk-core/`](../agents-sdk-core/).

## Zdroje (Microsoft)

- [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)

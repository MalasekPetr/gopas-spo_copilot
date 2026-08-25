# Lab · Toolchain a první scaffold

> Modul: `onboarding` · Odhad: 45 min · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Mít funkční pro-code prostředí a scaffoldnutý projekt agenta, který se lokálně spustí
v Microsoft 365 Agents Playground — ještě bez modelu, jen echo.

## Předpoklady

- Účet `user.NN@spdemo.online` a heslo (přiděleno instruktorem).
- Klíč / endpoint k modelu (přiděleno instruktorem — viz [`../../environment.md`](../environment.md)).
- Práva instalovat rozšíření VS Code na kurzovním stroji.

## Kroky

### Část A — toolchain

1. Ověř Node.js: `node --version` (LTS) a `npm --version`. Pokud Node chybí nebo je
   starý, nahlas to instruktorovi hned — bez něj nepojede nic dalšího v týdnu.
2. Ve VS Code nainstaluj rozšíření **Microsoft 365 Agents Toolkit** (přesný název podle
   promítnutého — mění se). Po instalaci se ikona Toolkitu objeví v Activity Baru.
3. V Toolkitu se přihlas do Microsoft 365 účtem `user.NN@spdemo.online` (heslo od
   instruktora) a ověř, že Toolkit přihlášený účet zobrazuje.
4. Připrav úložiště tajemství: vytvoř `.env` s placeholderem pro klíč k modelu —
   skutečný klíč dostaneš zítra ráno. Spusť `git status` a ověř, že `.env` **není**
   v trackovaných souborech. První governance lekce kurzu: klíč nikdy nepatří do repa.

### Část B — scaffold a lokální běh

5. V Toolkitu: **Create a New Agent/App** → šablona custom engine agenta
   (**TypeScript**; přesný název šablony podle aktuální verze Toolkitu, instruktor promítá).
6. Spusť projekt v **Agents Playground** — bez tenantu, bez tunelu, bez registrace bota.
   Pošli zprávu a ověř echo odpověď.
7. Projdi strukturu projektu: kde se instancuje `AgentApplication`, kde je manifest a kde
   konfigurace prostředí. Zítra ráno do tohoto projektu zapojíme model.

### Část C — repo kurzu

8. Naklonuj repo kurzu a projdi [`agenda.md`](../agenda.md) (pořadí týdne)
   a [`GLOSSARY.md`](../GLOSSARY.md) (tři peněženky, vrstvy stacku).
9. Přečti [`scenario-support-agent.md`](../scenario-support-agent.md) — zadání, které
   celý týden stavíme, a čtyři testovací dotazy, které se vrací po každém přírůstku.

## Ověření

- [ ] `node --version` vrací podporovanou LTS verzi.
- [ ] Toolkit je přihlášený účtem `user.NN@spdemo.online`.
- [ ] Projekt se spustí v Agents Playground a odpoví na zprávu.
- [ ] Klíč k modelu **není** v žádném trackovaném souboru (`git status` je čistý).
- [ ] Student umí říct, co je cílová architektura Support Asistenta na konci týdne.

## Fallback

- Instalace rozšíření blokovaná politikou stroje: instruktor rozdá předpřipravený projekt
  a student pracuje bez scaffoldingu (zbytek týdne to neblokuje — scaffold se dělá jen tady).
- Klíč k modelu ještě nerozdaný nebo endpoint nedostupný: část B se dokončí v echo režimu,
  LLM turn se doplní v [`../agents-sdk-core/`](../agents-sdk-core/).

## Zdroje (Microsoft)

- [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart)
- [Test your agent locally in Microsoft 365 Agents Playground](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/test-with-toolkit-project)

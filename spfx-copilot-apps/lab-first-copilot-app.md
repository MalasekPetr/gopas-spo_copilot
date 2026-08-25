# Lab · První SharePoint Copilot App — scaffold a Copilot Workbench

> Modul: `spfx-copilot-apps` · Odhad: 40 min · Režim: **hands-on** (deploy = instruktorské demo)
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Vlastní Copilot App běžící lokálně v **Copilot Workbench** — a zážitek, že SPFx dovednosti
(scaffold, packaging, projektová struktura) se přenášejí do Copilot canvasu 1:1.

## Předpoklady

- Nainstalovaný preview generator (`@microsoft/generator-sharepoint@next`) —
  **z onboardingu dne 1**, neinstaluje se teď.
- Node.js z toolchainu (viz [`../../environment.md`](../environment.md)).
- Žádná Copilot licence není potřeba (stav preview).

## Kroky

### Část A — scaffold

1. Scaffoldni Copilot App preview generatorem a vyber šablonu:

   ```powershell
   yo @microsoft/sharepoint
   ```

   **Minimal** doporučeně — je na ní nejlépe vidět, jak se komponenta aktivuje.
   **React** zvol, jen když chceš rovnou vizuál. Komponentu pojmenuj **svým účtem**
   (`user.NN`) — v preview kolidují stejně pojmenované Apps napříč studenty.
2. Projdi strukturu projektu a **pojmenuj nahlas dvě skupiny**:
   - **co znáš z web partů beze změny** — `config/`, `src/`, `gulpfile.js`, `package.json`,
     `tsconfig.json`, buildovací pipeline;
   - **co je nové** — metadata, kterými se komponenta aktivuje (kdy a čím ji Copilot
     vyvolá), a fakt, že komponentu volá **agent**, ne autor stránky.

   Zapiš si to — kontrolní otázka v `Ověření` je přesně tahle.

### Část B — běh v Copilot Workbench

3. Spusť dev server a otevři komponentu v **Copilot Workbench**:

   ```powershell
   gulp serve
   ```

   Ověř **inner loop**: změň viditelný text v komponentě, ulož, reloadni Workbench a
   potvrď, že změna je vidět. Dokud tenhle cyklus nefunguje, dál nepokračuj — zbytek
   labu na něm stojí.
4. Přestav komponentu na mini-scénář: **karta eskalace tiketu** (dotaz 3 ze scénáře —
   „Tiskárna netiskne a runbook nepomohl."). Karta zobrazí předmět, prioritu, žadatele
   a tlačítko *Eskalovat*. Data drž **statická, natvrdo v komponentě** — žádné napojení
   na agenta ani na mock ticket API; to je roadmapa do capstonu, ne dnešní lab.
   Po každé úpravě reloadni Workbench.

### Část C — deploy (instruktorské demo)

5. Sleduj, jak instruktor zabalí App (`gulp bundle --ship` → `gulp package-solution --ship`)
   a nasadí `.sppkg` do App Catalogu `spdemo.online`, a jak se komponenta objeví **živě
   v Copilot canvasu**. Zapiš si tři věci, které v lokálním Workbenchi nevidíš:
   - **kdo App vyvolá** — rozhoduje orchestrátor podle metadat aktivace, ne uživatel;
   - **kde komponenta běží** — v tenantu, takže data z karty tenant neopouštějí;
   - **co zatím nejde** — renderuje se jen v Copilot canvasu a **store distribuce není
     v preview podporovaná** (srovnání s distribucí agentů je dnes odpoledne
     v [`../marketplace-agents/`](../marketplace-agents/)).

> [!NOTE] Poznámka pro lektora
> Rozsah kroku 5 závisí na stavu rolloutu v tenantu — ověřit den předem. Když deploy
> nedorazil, jede se video z MS dokumentace (viz Fallback a [`instructor-notes.md`](instructor-notes.md)).

## Ověření

- [ ] Copilot App scaffoldnutá a běžící lokálně v Copilot Workbench.
- [ ] Provedená aspoň jedna úprava komponenty s ověřeným reloadem (inner-loop).
- [ ] Student umí říct, co se z jeho SPFx znalostí přeneslo beze změny a co je nové.
- [ ] Student umí vysvětlit vztah App ↔ agent (UX vrstva, ne další druh agenta).

## Fallback

- **Preview toolchain na studentském stroji selže** (u `@next` verzí reálné riziko):
  student pracuje ve dvojici se sousedem; instruktor má vlastní běžící projekt na promítání.
- **Rollout do tenantu nedorazil**: část C se zkrátí na video z MS dokumentace; části A–B
  jsou na tenantu nezávislé a nesou hlavní hodnotu.
- Nestíhá se: část B krok 4 (úprava komponenty) jako samostudium proti PnP samples.

## Zdroje (Microsoft)

- [SharePoint Framework v1.24 preview release notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.24.0)
- [Going beyond text in Microsoft 365 Copilot: Introducing SharePoint Copilot Apps](https://devblogs.microsoft.com/microsoft365dev/going-beyond-text-in-microsoft-365-copilot-introducing-sharepoint-copilot-apps/)

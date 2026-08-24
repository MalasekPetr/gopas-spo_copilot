# Lab · První SharePoint Copilot App — scaffold a Copilot Workbench

> Modul: `spfx-copilot-apps` · Odhad: 40 min · Režim: **hands-on** (deploy = instruktorské demo)
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Vlastní Copilot App běžící lokálně v **Copilot Workbench** — a zážitek, že SPFx dovednosti
(scaffold, packaging, projektová struktura) se přenášejí do Copilot canvasu 1:1.

## Předpoklady

- Nainstalovaný preview generator (`@microsoft/generator-sharepoint@next`) —
  **z onboardingu dne 1**, neinstaluje se teď.
- Node.js z toolchainu (viz [`../../environment.md`](../../environment.md)).
- Žádná Copilot licence není potřeba (stav preview).

## Kroky

### Část A — scaffold

1. <!-- TODO: scaffoldnout Copilot App; volba sablony (Minimal / No framework / React) --
     doporucit Minimal pro pochopeni modelu, React pro ty, kdo chteji vizual -->
2. <!-- TODO: projit strukturu projektu a pojmenovat, co je stejne jako u web partu
     (packaging, tooling) a co je nove (metadata aktivace, MCP Apps model) -->

### Část B — běh v Copilot Workbench

3. <!-- TODO: spustit lokalne v Copilot Workbench; overit inner-loop (zmena -> reload) -->
4. <!-- TODO: upravit komponentu na mini-scenar: karta eskalace tiketu (dotaz 3 ze
     scenare) -- staticka data, zadne napojeni na agenta -->

### Část C — deploy (instruktorské demo)

5. <!-- TODO: instruktor nasadi App do spdemo.online a ukaze ji zivou v Copilot canvasu;
     pojmenovat, co student uvidi po GA / rolloutu -->

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

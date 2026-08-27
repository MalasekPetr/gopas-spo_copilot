# SharePoint agents

> Typ: povinný · Den: 2 · Odhad: **30 min** — **instruktorské demo** (tvorba vyžaduje Copilot licenci) · Publikum: **vývojáři / architekti**
> Prostředí: viz [`../../environment.md`](../../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../../GLOSSARY.md)
> Kontext: deklarativní agent, mapa cest a srovnání → [`../../agent-landscape/`](../../day-1/agent-landscape/)

## Co to je

Agent, kterého staví **vlastník obsahu přímo na SharePoint webu** (`.agent` soubor), bez opuštění webu. Agent **žije s webem** — dědí jeho permissions i lifecycle. Jediná cesta, kde tvůrcem není maker/vývojář, ale vlastník obsahu.

## Tvrdý limit: 1 zdroj a nic jiného

Přidání dalšího zdroje **odstraní** ostatní (MC1255409). HR scénář (list + 2 knihovny) se do **jednoho** SharePoint agenta nevejde → buď scopovat na jeden zdroj (např. knihovna `Smlouvy`), nebo víc agentů. **Omezení učí samo sebe** — proto tenhle blok.

## Licence: tvorba vs. použití

- **Tvorba: Copilot licence** → u nás proto **jen instruktorské demo**, studenti sledují.
- **Použití: licence NEBO PAYG** (meter i pro nelicencované) — vzor „licence gate-uje funkci, permissions gate-ují obsah" z D1.

## Distribuce

Jen web (+ sdílení do Teams chatu). Žádný org katalog / marketplace / source control.

## Lab

[`lab-sharepoint-agent.md`](./lab-sharepoint-agent.md) — instruktor demo: single-source limit naživo. Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md).

## Zdroje (Microsoft)

[SharePoint agents](https://learn.microsoft.com/en-us/sharepoint/get-started-sharepoint-agents) · [MC1255409 — Lists as knowledge source](https://mc.merill.net/message/MC1255409)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-07.
> Podpora listů: GA ~05/2026 (MC1255409), ale admin dokumentace to k 06/2026 ještě nereflektovala — ukázat jako příklad docs lag. Licenční matice tvorba/použití se může při GA měnit — ověřit get-started stránku.

# SharePoint Copilot Apps — interaktivní UX v Copilot canvasu (Public Preview)

> Typ: povinný · Den: 4 · Odhad: **60 min** (20 výklad + 40 lab) · Publikum: **vývojáři / architekti**
> Prostředí: viz [`../../environment.md`](../../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../../GLOSSARY.md)

Agent celý včerejšek tvaroval **text**. SharePoint Copilot Apps (SPFx 1.24, Public Preview) jsou
odpověď na otázku „a co když má odpověď být graf, formulář nebo schválení?" — SPFx
komponenty renderované **přímo v Copilot canvasu**, postavené na **MCP Apps** modelu,
hostované automaticky v tenantu. Pro SPFx vývojáře je to nejkratší cesta do světa agentů.

## Cíle

- Vědět, co SharePoint Copilot Apps jsou: SPFx komponenta v Copilot canvasu, **MCP Apps**
  model, hosting automaticky v tenantu (žádný vlastní hosting ani routing).
- Znát developer loop: scaffold (šablony Minimal / No framework / React) → lokální běh
  v **Copilot Workbench** → deploy do tenantu.
- Umět zařadit Copilot Apps na osu kurzu: UX vrstva **nad** agenty, ne další druh agenta.
- Vidět most k SPFx dovednostem — stejné packaging, tooling a struktura projektu jako
  u web partů.

## Výklad

### Co to je a proč teď

<!-- TODO: demo naskriptovat: hotova Copilot App (graf/formular) v Copilot canvasu.
     Pointa: agent muze vratit interaktivni UX misto textu; MCP Apps model, ale hosting
     a routing resi platforma (tenant-hosted -- data zustavaji v tenantu). -->

```mermaid
%% TODO: diagram -- agent (text) vs agent + Copilot App (interaktivni UX v canvasu)
flowchart LR
  A[placeholder] --> B[placeholder]
```

### Developer loop — SPFx, jak ho znáte

<!-- TODO: scaffold pres @microsoft/generator-sharepoint@next, sablony Minimal /
     No framework / React; Copilot Workbench jako lokalni test prostredi;
     stejny packaging a projektova struktura jako web party. -->

### Kde to sedí na ose kurzu

<!-- TODO: Copilot Apps NEJSOU dalsi druh agenta -- jsou UX vrstva nad konverzaci.
     Vazba na MCP nit (D2 konektory, akce) a na middleware (D3 -- co agent smi
     vratit, plati i pro UX vystup). -->

## Klíčové rozlišení

- **Copilot App** (UX komponenta v canvasu) vs. **agent** (logika a orchestrace) —
  App nenahrazuje agenta, dává mu ruce a obrazovku.
- **MCP Apps model s tenant hostingem** — na rozdíl od obecných MCP Apps neřešíš hosting
  ani routing; komponenta žije v M365 tenantu (data sovereignty zdarma).
- **SPFx dovednosti se přenášejí 1:1** — packaging, tooling, projektová struktura;
  jazyk je tu TypeScript (jediný TS-first blok kurzu, záměrně).
- **Public Preview** — bez Copilot licence pro build (v preview), store distribuce zatím
  nepodporovaná, pracovní název se může změnit.

## Naše prostředí

**Hands-on** (rozhodnutí autora 2026-08-06 — klíčová vazba na SPFx kurzy): studenti si
scaffoldnou a rozběhnou vlastní Copilot App lokálně v **Copilot Workbench** — v preview
to nevyžaduje Copilot licenci. Deploy do `spdemo.online` dělá instruktor jako demo (dle
stavu rolloutu). Preview generator (`@next`) se instaluje **už v onboardingu dne 1**,
ne až tady — viz go/no-go v [`instructor-notes.md`](instructor-notes.md).

## Lab

Viz [`lab-first-copilot-app.md`](lab-first-copilot-app.md). Samostudium navíc:
[GitHub — spfx-copilot-apps samples](https://github.com/pnp/spfx-copilot-apps).

## Nosná linka

Support Asistent včera dostal middleware — a tady je vidět, **kam jeho výstup může
dorůst**: eskalace z dotazu 3 ([`../../scenario-support-agent.md`](../../scenario-support-agent.md))
jako interaktivní schvalovací karta místo textu. Student si první Copilot App postaví
sám; napojení na vlastního agenta zůstává jako roadmapa do capstonu.

## Zdroje (Microsoft)

- [SharePoint Framework v1.24 preview release notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.24.0)
- [Going beyond text in Microsoft 365 Copilot: Introducing SharePoint Copilot Apps](https://devblogs.microsoft.com/microsoft365dev/going-beyond-text-in-microsoft-365-copilot-introducing-sharepoint-copilot-apps/)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08.
> **Public Preview** (SPFx 1.24 beta.1, 2026-07-08): rollout dokončen ~2026-07-20,
> renderuje se zatím **jen v Copilot canvasu**, store distribuce nepodporovaná, licencování
> po GA se může změnit, i pracovní název „SharePoint Copilot Apps" se může změnit.
> Před během ověřit release notes a stav GA — tenhle blok je nejrychleji se měnící
> v celém kurzu.

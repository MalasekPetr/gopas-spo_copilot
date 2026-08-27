# Lab · SharePoint agent — limit jednoho zdroje (demo)

> Modul: sharepoint-agents · Odhad: 20 min · Režim: **instruktorské demo** (studenti sledují + predikují)
> Scénář a data: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Vidět SharePoint agent naživo a pochopit jeho **tvrdý limit — 1 zdroj a nic jiného** — a proč se do něj HR scénář (list + 2 knihovny) nevejde.

> [!IMPORTANT] Proč jen demo
> Tvorba SharePoint agenta vyžaduje **Copilot licenci** — studenti na Business Basic + PAYG ho můžou *používat*, ne *tvořit* (ověřeno). Staví instruktor, studenti sledují a predikují.

## Předpoklady

- Data na `/sites/hr-demo`: knihovna `Smlouvy` (+ list `Zaměstnanci`).
- Instruktorský účet s Copilot licencí.

## Kroky (instruktor)

1. Na `/sites/hr-demo` → **Create agent**; scope omez na **jednu knihovnu** `Smlouvy`.
2. Dotaz „najdi podepsanou pracovní smlouvu pro 10024" → projde (hledání v knihovně).
3. Dotaz „ukaž údaje osobního čísla 10018" (list) → agent na list nevidí.
4. **Zkus přidat list `Zaměstnanci` jako druhý zdroj** → ukáž, že to **shodí** knihovnu (MC1255409).
5. Predikce třídy: kolik agentů by HR scénář potřeboval? (list + 2 knihovny = víc agentů, nebo jiná cesta.)

## Ověření

- [ ] Studenti zaznamenali: SharePoint agent = **1 zdroj**, přidání druhého shodí první.
- [ ] Formulováno, proč se HR scénář do jednoho SP agenta nevejde.
- [ ] Zmíněn licenční gate (tvorba = Copilot licence, použití = i PAYG).

## Fallback

- Bez licence/tenantu: promítnout přípravné screenshoty; třída jen predikuje chování a pak se ověří proti záznamu.

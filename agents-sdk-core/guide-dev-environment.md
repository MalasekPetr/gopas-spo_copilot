# Guide · Developer environment — instalační a kontrolní průchod

> Modul: `agents-sdk-core` · Typ: hands-on ~20 min · Zařazení: po Foundry v kostce, před labem
> Prostředí: viz [`../environment.md`](../environment.md) · Názvosloví: [`../GLOSSARY.md`](../GLOSSARY.md)

Pondělní onboarding ověřil, že *něco* běží. Tenhle průchod staví prostředí **řízeně
a od nuly** — verzovaný Node přes fnm, Toolkit, CLI — a každý krok říká, *proč* ta věc
v developer prostředí je. Kdo má krok hotový z pondělí, jen ho odškrtne; průchod je
idempotentní.

## 1. fnm + Node.js 22 (~8 min)

**Proč version manager a ne MSI:** Node se v projektech liší per repo; instalace do
uživatelského profilu nepotřebuje admin práva a na kurzovním stroji nerozbije nic
systémového. `fnm` je rychlý a umí přepínat verzi automaticky podle `.node-version`
v projektu.

```powershell
winget install Schniz.fnm
# nový terminál, pak aktivace v profilu PowerShellu:
Add-Content $PROFILE 'fnm env --use-on-cd | Out-String | Invoke-Expression'
# nový terminál znovu:
fnm install 22
fnm default 22
node --version   # v22.x
npm --version
```

- **Nový terminál po každém kroku s profilem** — bez toho `fnm` ani `node` nejsou v PATH
  a vypadá to jako rozbitá instalace.
- Když na stroji už je systémový Node z MSI: nevadí, fnm ho ve svém shellu zastíní.
  Ověř, že `node --version` po aktivaci vrací 22.

## 2. VS Code — rozšíření a terminál (~5 min)

1. Rozšíření **Microsoft 365 Agents Toolkit** (přesný název podle promítnutého — mění se;
   pozor na podobně pojmenovaná cizí rozšíření). Ikona M365 v Activity Baru.
2. Výchozí terminál = **PowerShell** (kvůli fnm profilu z kroku 1): `Ctrl+Shift+P` →
   *Terminal: Select Default Profile*.
3. V Toolkitu **přihlásit Microsoft 365 účet** `user.NN@spdemo.online`. To je přihlášení
   do **tenantu** (manifest, publikace) — s Azure nemá nic společného.

## 3. Agents Toolkit CLI (~3 min)

```powershell
npm install -g @microsoft/m365agentstoolkit-cli
atk -h
```

- CLI (`atk`) dělá totéž co rozšíření, ale skriptovatelně — provision, publikace,
  validace manifestu. V labech ho nepoužijeme, v CI/CD pipeline ano; instaluje se teď,
  protože npm už běží a je to jeden příkaz.

## 4. Azure nástroje — co (ne)potřebuješ (~2 min výklad)

- **Pro tento kurz nic.** K modelu se připojuješ třemi hodnotami (klíč, endpoint,
  deployment name) — žádné přihlášení do Azure, žádná subscription
  ([`explainer-foundry-basics.md`](explainer-foundry-basics.md), sekce Kdo co vidí).
- Do vlastního developer prostředí patří **Azure CLI** (`winget install Microsoft.AzureCLI`)
  — potřebuješ ho v okamžiku, kdy endpoint nasazuješ sám. Dnes ho instalovat nemusíš;
  přihlašování do cizích tenantů v učebně naopak nedělej.

## Ověření

- [ ] `node --version` → v22.x (v novém terminálu, ne ve starém).
- [ ] Toolkit v Activity Baru a přihlášený účet `user.NN@spdemo.online`.
- [ ] `atk -h` vypíše nápovědu.
- [ ] Pondělní scaffold jde otevřít a spustit v Agents Playground (echo stačí —
      model se zapojuje až v labu).

## Fallback

- **winget blokovaný politikou**: fnm přeskočit, Node 22 LTS z MSI (instruktor má
  instalátor offline); ztrácí se verzování, ne funkčnost.
- **npm install -g blokovaný**: CLI přeskočit — v labech se nepoužívá, zmínit jen slovně.
- **Nic nejde instalovat**: fallback z pondělí — předpřipravený projekt od instruktora.

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08
> Název npm balíčku CLI (`@microsoft/m365agentstoolkit-cli`, příkaz `atk`) i přesný název
> VS Code rozšíření se v lineage Teams Toolkit → Agents Toolkit už měnily. Ověřit oba
> před během; Node major verzi srovnat s aktuálním požadavkem šablon Toolkitu.

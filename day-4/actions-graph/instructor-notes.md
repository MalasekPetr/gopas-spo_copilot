# Instructor notes — Action handlers & integrace s Microsoft Graph

## Timing

- ~30 min výklad + 60 min lab = **90 min**. **Blok 1 dne 4** (třetí rekalibrace).
  Identity výklad (registrace, permissions, tokeny) **odučen na D3** — část A výkladu
  jen krátce zrekapitulovat, ne odučit znovu; `.lab-token` studenti znají, jen po ~1 h
  vypršel → ráno nové tokeny.
- Část D (app-only protipříklad) je jen ~10 min a je to **nejsilnější moment labu**.
  Po zkrácení jede jako demo — ale **nevynechávat**, je to předehra ke scope minimalizaci
  v `middleware-policy` (D4).
- **Pět minut na konci výkladu nech na princip „co nemusí dělat model"**
  ([`explainer-deterministic-first.md`](./explainer-deterministic-first.md)). Validace v kódu,
  kterou blok učí, je jen speciální případ — obecné pravidlo zní: u každého kroku zadání
  se ptej, jestli ho musí dělat model. Case study s ARES je konkrétní a padne dobře.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **List `Tikety` na /sites/hr-demo** (rozhodnutí 2026-08-26): sloupce `Priorita`
  (choice P1/P2/P3), `Popis` (multiline), `Zadavatel` (text) — **názvy bez diakritiky**,
  jinak SharePoint vyrobí zakódované interní názvy a kód z labu je netrefí. Registrace
  potřebuje delegated **`Sites.ReadWrite.All`** s admin consentem; studenti si ráno
  vyrábějí token s tímhle scope navíc.
- **Ověřeno naživo (2026-08-26):** zápis přes Graph projde, `Created By` doplní
  SharePoint z tokenu (`user.15`), zatímco `Zadavatel` nese to, co zapsal kód
  (persona z Playgroundu). Ten rozdíl je pointa kroku 10 a znovu kroku 15.
- **Před během smaž testovací tikety z listu**, ať studenti začínají na prázdném.
- **Mechanismus tabule (od 2026-08-26):** lab má cesty MOCK (výchozí, funguje vždy)
  a ŽIVĚ. Ráno napiš na tabuli `GRAPH: MOCK/ŽIVĚ` a `RETRIEVAL: MOCK/ŽIVĚ` podle toho,
  co níže stihneš ověřit. **Bez ohlášení jedou studenti MOCK** — lab je na tom postavený
  a nic dalšího nevyžaduje.
- **ŽIVĚ přepínač = soubor `.lab-token` v projektu studenta** (jedna app registrace,
  token per student přes device code). Záměrně soubor, ne env proměnná — env
  z terminálu do F5 procesů nedoteče (stejná lekce jako fnm). Kód labů čte token
  při každém volání, takže výroba/smazání souboru nepotřebuje restart.
- **App registrace pro ŽIVĚ cestu** (~10 min, v adresáři `spdemo.online` — správný
  browser profil!): Entra → App registrations → New: název `spo-copilot-app` (první běh: 4407c56b-…),
  single tenant, bez redirect URI. Pak: Authentication → **Allow public client
  flows: Yes** (device code). API permissions → delegated `User.Read`,
  `Files.Read.All`, `Sites.Read.All`, **`Sites.ReadWrite.All`** (zápis tiketů)
  → **Grant admin consent**. Client ID nadiktuješ studentům (není tajemství).
  **Po kurzu celou registraci smazat.** App-only pro část D má vlastní registraci —
  viz sekce níž.
- **Test device code flow** (po vytvoření registrace):
  `LAB_CLIENT_ID=<id> node solution/device-auth.mjs "User.Read"` — přihlas se
  testovacím studentským účtem a ověř, co Business Basic z Graphu reálně přečte
  (`/me` musí projít; co dál, řekneš studentům v kroku části A).
- **Mocky:** `node solution/mock-ticket-api.mjs --self-test`,
  `node solution/mock-graph.mjs --self-test` — na stroji v učebně, ne jen na svém.
  Self-testy pokrývají i 429 s Retry-After a app-only režim (hlavička `x-auth-mode`).
- **App-only pro část D: instruktorské demo, studentům se nic nerozdává** — příprava
  a odůvodnění níže v samostatné sekci.
- Ověřit aktuální stav **Entra Agent ID**: dostává agent v tomto scénáři Agent ID automaticky,
  nebo se registruje ručně? Mění to formulaci ve výkladu.

## App-only demo (část D) — příprava a rozhodnutí

> [!IMPORTANT] Studentům se nic nerozdává (revize původního rozhodnutí 2026-08-26)
> Původní plán z 2026-08-06 počítal s rozdáním app-only credentials studentům.
> **Neděláme to** ze tří důvodů: část D je první kompresní ventil dne a jede jako
> demo tak jako tak · rozdaný secret s application permissions znamená 20 kopií klíče
> nad celým tenantem · a mock pointu pokrývá beze zbytku. **Instruktor předvádí,
> studenti se dívají**; kdo si to chce osahat, spustí `mock-graph.mjs` s hlavičkou
> `x-auth-mode: app-only`.

**Příprava (~5 min, den předem):**

1. **Samostatná registrace** `spo-copilot-apponly` — ne ta studentská. Když ji po kurzu
   smažeš, nerozbiješ jim delegated tok.
2. API permissions → **Application** (ne Delegated): `User.Read.All`.
   Přidej `Sites.ReadWrite.All`, jen když chceš i krok 15 (tiket podepsaný aplikací).
   → **Grant admin consent**.
3. Certificates & secrets → nový secret s **expirací na konec kurzovního týdne**.
4. Token si vyrob skriptem — klikání v Postmanu před třídou se nedělá:

   ```powershell
   $env:APPONLY_CLIENT_ID = "<client id>"
   $env:APPONLY_SECRET    = "<secret>"
   node <klon-repa>/day-4/actions-graph/solution/app-only-auth.mjs | Out-File .lab-token-apponly -Encoding ascii -NoNewline
   ```

   Skript vypíše na stderr **role v tokenu** — když je seznam prázdný, chybí admin
   consent a demo by selhalo až před lidmi.
5. **Projet demo den předem**: `/users/user.11` musí pod app-only vrátit **200 s profilem**,
   zatímco pod delegated tokenem vrací 403.

**Gitignore:** v projektu agenta použij vzor `.lab-token*`, ať pokryje i
`.lab-token-apponly`.

**Po kurzu:** smazat celou registraci `spo-copilot-apponly` — tím zmizí i secret a je
po úklidu. Soubor `.lab-token-apponly` smazat z disku.

> [!TIP] Věta do výkladu, která z demo udělá lekci
> Až budeš ukazovat `Sites.ReadWrite.All` jako application permission, řekni, že
> **správná odpověď v produkci je `Sites.Selected`** — application oprávnění, které dá
> přístup jen k webům, které explicitně povolíš. Je to scope minimalizace, kterou blok
> učí, aplikovaná sama na sebe.

## Tripwires

- **Studenti vezmou žadatele z návrhu modelu.** Skoro všichni. Nechat je to udělat, pak jim
  to v části C rozbít. Je to nejlépe zapamatovatelná lekce dne a bez toho pokusu nefunguje.
- „Model přece nebude lhát o parametrech" — ukázat, že nejde o lhaní modelu, ale o **prompt
  injection přes obsah** (naváže `middleware-policy` odpoledne). Model je jen kanál.
- Záměna **autorizace agenta** a **autorizace akce**. Agent smí volat Graph ≠ tenhle uživatel
  smí tuhle věc. Autorizace patří do akce.
- App-only se studentům zalíbí, protože „funguje". Zdůraznit, že to je přesně ta pohodlnost,
  která v produkci exfiltruje. A **zkontrolovat, že to po části D vypnuli.**
- Nezabíhat do middleware — filtrování výstupů je [`../../middleware-policy/`](../middleware-policy/).
  Tady řešíme vstup do akce, ne výstup z agenta.

## Vazby

- Zpět: knowledge z `knowledge-grounding`; chybové větve z `agents-sdk-core` se tady
  rozšiřují na Graph (429/Retry-After, 403, 404).
- Dopředu: `middleware-policy` (výstupní filtry — druhá polovina obrany),
  `agent-365-governance` (Entra Agent ID, audit akcí, instrumentace),
  (`security-risk` je sloučený do `middleware-policy`).
- Governance nit: tady začíná. Hranice oprávnění → middleware → Agent 365 → scope minimalizace.

# Lab · První SharePoint Copilot App — „Moje tikety" v Copilot canvasu

> Modul: `spfx-copilot-apps` · Odhad: 25 min lab · Režim: **hands-on, step-by-step**
> (deploy = instruktorské demo) · Jazyk: TypeScript · Scénář: [`scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Vlastní Copilot App běžící v **Copilot Workbench**, která vykreslí **tikety, které dnes
ráno založil tvůj vlastní agent** — a zážitek, že SPFx dovednosti se do Copilot canvasu
přenášejí 1:1. Nové je jen to, **kde se to renderuje** a **kdo to vyvolá**.

**Jak lab číst:** každý krok končí **Checkpointem** — nesedí-li, nepokračuj.
Krok 4 (statická data) funguje vždy; krok 5 (živý list) je pointa s fallbackem zpět.

## Předpoklady

- Preview generator (`@microsoft/generator-sharepoint@next`) — **z onboardingu dne 1**.
- Node.js z toolchainu (viz [`../environment.md`](../../environment.md)).
- **Tikety v listu `Tikety`** z dopoledního labu [`../actions-graph/`](../actions-graph/lab-actions-and-graph.md) —
  ty budeš vykreslovat.
- Copilot licence není potřeba (stav preview).

## Část A — scaffold (8 min)

### 1. Scaffoldni komponentu

```powershell
yo @microsoft/sharepoint
```

**Minimal** doporučeně — je na ní nejlépe vidět, jak se komponenta aktivuje.
**React** zvol, jen když chceš rovnou vizuál. Komponentu pojmenuj **svým účtem**
(`tikety-user-NN`) — v preview kolidují stejně pojmenované Apps napříč studenty.

**Checkpoint:** projekt se vygeneroval a `npm install` doběhl.

### 2. Roztřiď, co znáš a co je nové

Projdi strukturu a **pojmenuj nahlas dvě skupiny**:

| Znáš z web partů beze změny | Je nové |
|---|---|
| `config/`, `src/`, `gulpfile.js` | metadata **aktivace** — kdy a čím Copilot komponentu vyvolá |
| `package.json`, `tsconfig.json` | komponentu volá **agent**, ne autor stránky |
| build a packaging pipeline | renderuje se v **Copilot canvasu**, ne na stránce |

**Checkpoint:** umíš u každé položky říct, do kterého sloupce patří. Kontrolní otázka
v `Ověření` je přesně tahle.

### 3. Rozběhni Workbench a ověř inner loop

```powershell
gulp serve
```

Změň viditelný text v komponentě, ulož, reloadni Workbench a potvrď, že změna je vidět.

**Checkpoint:** cyklus změna → uložení → reload funguje. **Dokud nefunguje, dál
nepokračuj** — zbytek labu na něm stojí.

## Část B — karta „Moje tikety" (12 min)

### 4. Nejdřív statická data

Do renderovací části komponenty vlož vykreslení tiketů. **Data zatím natvrdo** —
chceš mít funkční výsledek dřív, než začneš riskovat napojení na tenant:

```ts
type Tiket = { title: string; priorita: string; zadavatel: string; createdBy: string; created: string };

const DEMO: Tiket[] = [
  { title: "Tiskárna netiskne — eskalace z runbooku", priorita: "P2",
    zadavatel: "Alex Wilber (z Playgroundu)", createdBy: "User 15", created: "2026-08-26 20:30" },
];

function barvaPriority(p: string): string {
  return p === "P1" ? "#c50f1f" : p === "P2" ? "#bc4b09" : "#616161";
}

function vykresli(tikety: Tiket[]): string {
  if (!tikety.length) return `<p>Žádné tikety.</p>`;
  return `
    <div style="font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 8px;">
      ${tikety.map((t) => `
        <div style="border: 1px solid #e1dfdd; border-radius: 6px; padding: 10px 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: ${barvaPriority(t.priorita)}; color: #fff; border-radius: 10px;
                         padding: 1px 8px; font-size: 12px; font-weight: 600;">${t.priorita}</span>
            <strong>${t.title}</strong>
          </div>
          <div style="margin-top: 6px; font-size: 12px; color: #605e5c;">
            Zadavatel (zapsal kód): ${t.zadavatel}<br>
            <b>Created By (ví platforma): ${t.createdBy}</b> &middot; ${t.created}
          </div>
        </div>`).join("")}
    </div>`;
}
```

**Checkpoint:** v Workbenchi je vidět karta s odznakem priority. Vypadá to jako
odpověď agenta, ne jako text — a to je celý rozdíl tohoto bloku.

### 5. Vyměň statická data za živý list

Teď totéž ze **skutečného listu**, do kterého ráno psal tvůj agent. Volání je obyčejné
SharePoint REST — nic preview:

```ts
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

async function nactiTikety(context: any): Promise<Tiket[]> {
  const url = `${context.pageContext.web.absoluteUrl}`
    + `/_api/web/lists/getbytitle('Tikety')/items`
    + `?$select=Title,Priorita,Zadavatel,Created,Author/Title`
    + `&$expand=Author&$orderby=Created desc&$top=10`;

  const res: SPHttpClientResponse = await context.spHttpClient.get(url, SPHttpClient.configurations.v1);
  if (!res.ok) throw new Error(`nacteni listu selhalo: ${res.status}`);
  const data = await res.json();

  return (data.value ?? []).map((i: any) => ({
    title: i.Title,
    priorita: i.Priorita ?? "P3",
    zadavatel: i.Zadavatel ?? "—",
    createdBy: i.Author?.Title ?? "—",   // Created By = identita z tokenu, ne z kodu
    created: (i.Created ?? "").slice(0, 16).replace("T", " "),
  }));
}
```

Zavolej ji místo `DEMO` a výsledek předej do `vykresli()`.

**Checkpoint:** v kartě jsou **tvoje tikety z dnešního rána**, seřazené od nejnovějšího.

> [!IMPORTANT] Podívej se na dva sloupce vedle sebe
> `Zadavatel` je to, co zapsal **tvůj kód** — u tiketů z Playgroundu tam bude persona
> (Alex Wilber). `Created By` je to, co ví **platforma** z tokenu — tvůj účet `user.NN`.
>
> A pokud jsi ráno dělal část D (app-only), najdeš tiket, kde `Created By` ukazuje
> **aplikaci místo tebe**. Ráno to byla věta v labu; teď je to řádek na obrazovce.
> Přesně tohle uvidí auditor.

> [!NOTE] Když živý list nejde
> Copilot App je **preview** a kontext v Workbenchi se může chovat jinak, než čekáš.
> Když `nactiTikety` selže (401/403 nebo prázdný `pageContext`), **vrať se ke kroku 4** —
> statická data nesou stejnou pointu. Zapiš si, co přesně selhalo; je to relevantní
> nález o zralosti preview, ne tvoje chyba.

## Část C — deploy (instruktorské demo, 5 min)

### 6. Sleduj cestu do tenantu

Instruktor zabalí App (`gulp bundle --ship` → `gulp package-solution --ship`) a nasadí
`.sppkg` do App Catalogu `spdemo.online`.

**Checkpoint:** zapsané tři věci, které v lokálním Workbenchi nevidíš:

- **kdo App vyvolá** — rozhoduje orchestrátor podle metadat aktivace, ne uživatel;
- **kde komponenta běží** — v tenantu, takže data z karty tenant neopouštějí;
- **co zatím nejde** — renderuje se jen v Copilot canvasu a **store distribuce není
  v preview podporovaná** (srovnání s distribucí agentů měl blok
  [`../marketplace-agents/`](../../day-2/marketplace-agents/) v úterý).

> [!NOTE] Poznámka pro lektora
> Rozsah kroku 6 závisí na stavu rolloutu v tenantu — ověřit den předem. Když deploy
> nedorazil, jede se video z MS dokumentace (viz Fallback a [`instructor-notes.md`](./instructor-notes.md)).

## Do capstonu

Karta je zatím **jen čtení**. Přirozené pokračování je **human-in-the-loop**: nad
předvyplněným tiketem tlačítko *Eskalovat*, kterým člověk potvrdí akci agenta.
To je přesně místo, na které v pátek odpovídáš v [`../evaluation-quality/`](../../day-5/evaluation-quality/)
otázkou „kde zůstane člověk" — a patří to do roadmapy blueprintu, ne do dnešního labu.

## Ověření

- [ ] Copilot App scaffoldnutá a běžící lokálně v Copilot Workbench.
- [ ] Inner loop ověřený (změna → uložení → reload).
- [ ] Karta vykresluje tikety — živě z listu, nebo staticky s poznámkou, co selhalo.
- [ ] Student umí říct, co se z jeho SPFx znalostí přeneslo beze změny a co je nové.
- [ ] Student umí vysvětlit vztah App ↔ agent (UX vrstva, ne další druh agenta)
      a rozdíl `Zadavatel` vs. `Created By`.

## Fallback

- **Preview toolchain selže** (u `@next` verzí reálné riziko): student pracuje ve dvojici
  se sousedem; instruktor má vlastní běžící projekt na promítání.
- **Živý list nejde** (krok 5): statická data z kroku 4 — pointa drží.
- **Žádné tikety v listu** (student nedokončil dopolední lab): použij `DEMO` z kroku 4,
  nebo si jeden tiket založ ručně přímo v listu.
- **Rollout do tenantu nedorazil**: část C se zkrátí na video z MS dokumentace; části
  A–B jsou na tenantu nezávislé a nesou hlavní hodnotu.

## Zdroje (Microsoft)

- [SharePoint Framework v1.24 preview release notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.24.0)
- [Going beyond text in Microsoft 365 Copilot: Introducing SharePoint Copilot Apps](https://devblogs.microsoft.com/microsoft365dev/going-beyond-text-in-microsoft-365-copilot-introducing-sharepoint-copilot-apps/)
- [Work with lists and list items — SharePoint REST](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-26
> Tvar dat v kroku 4 odpovídá **skutečnému listu `Tikety`** (ověřeno 2026-08-26).
> REST volání v kroku 5 je stabilní SharePoint API, ale **chování `pageContext`
> a `spHttpClient` uvnitř Copilot App je preview** — před během ověřit na jednom
> stroji, jinak jet krok 5 jako volitelný.

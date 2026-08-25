# Agenda — pořadí bloků

Jediný zdroj pravdy o pořadí modulů. Složky jsou slugy; pořadí drží tato tabulka.
Prefix `day-N/` ve slugu je **stabilní identifikátor**, ne garance dne — složky se
při přesunech bloků nepřejmenovávají.

> [!CAUTION] Osm složek neodpovídá dni, kdy se učí
> Po dvou rekalibracích prefix ve většině případů **lže**. Nehledej modul podle složky,
> vždy podle tabulek níže.
>
> | Složka | Skutečně se učí |
> |---|---|
> | `day-1/agents-sdk-core` | **den 3** |
> | `day-2/knowledge-grounding` | **den 3** |
> | `day-2/actions-graph` | **den 3** |
> | `day-3/prompt-orchestration` | **den 4** |
> | `day-3/agent-framework` | **den 4** |
> | `day-3/middleware-policy` | **den 4** |
> | `day-4/marketplace-agents` | **den 2** |
> | `day-4/agent-365-governance` | **den 5** |
>
> Nejzrádnější je `day-4/` — ze čtyř složek se na dni 4 učí jen `spfx-copilot-apps`.
> Sedí: `onboarding`, `agent-landscape`, `no-code-showcase` (D1), `skills`,
> `sharepoint-agents`, `declarative-agents`, `data-hygiene` (D2), `spfx-copilot-apps` (D4),
> `evaluation-quality`, `capstone` (D5).

> [!NOTE] Rozhodnuto po prvním běhu: prefix zahodit
> Den je metadata, ne identita modulu — dva přesuny během jediného dne to ukázaly
> jednoznačně. Po běhu se složky přejmenují do jedné roviny bez prefixu
> (`onboarding/`, `agents-sdk-core/`, …) a den zůstane výhradně v této agendě.
> Znamená to přepsat ~157 křížových odkazů, proto se to nedělá uprostřed týdne:
> studenti mají repo naklonované a cesty by jim pod rukama zmizely.

**5 dní · 16 povinných bloků · 3–4 bloky/den.** P = povinný, V = volitelný / samostudium.
Fokus kurzu: **blízké okolí Microsoft 365** — vlastní vektorizace, hluboký Azure a obecná
AI témata jsou vedlejší koleje, ne jádro.

Po dvou rekalibracích (2026-08-24 a 25) je pět modulů vyřazeno do samostudia a dva bloky
sloučeny — přehled a důvody v [`self-study.md`](self-study.md).

> [!IMPORTANT] Osnova je restrukturalizovaná proti webu
> Publikovaná katalogová osnova má 15 bloků a je obsahově zastaralá (retirované certifikace,
> „Graph konektory", chybí Agent Framework / Agent 365 / Foundry / MCP / A2A). Tato agenda drží
> stack 2026. Návrh nové webové osnovy je v [`marketing/`](marketing/) a **musí být na webu
> před prvním během**. Mapování „publikovaný blok → modul" je tam v delta tabulce.

> [!WARNING] Timing — publikovaná čísla jsou nominální
> Web slibuje 2 h + 13×2,5 h + 2,5 h = **37 h / 5 dní = 7,4 h/den**. První běh naměřil
> **~5,2 h skutečně odučeného obsahu za den** (D1 245 min, D2 ~310 min) — publikovaná
> čísla ber jako marketingová. Pracovní kapacita plánu je **~310 min/den**, u D5 tvrdý
> strop ~220 (konec ve 13:00 bez oběda). Skutečné timingy žijí v `instructor-notes.md`
> jednotlivých modulů.

## Den 1 — Mapa stacku a no-code/low-code (~4,1 h odučeno)

| # | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Onboarding, prostředí & toolchain | `day-1/onboarding` | P |
| 2 | Mapa cest tvorby agentů & rozhodovací osa | `day-1/agent-landscape` | P |
| 3 | No-code a low-code cesty — showcase | `day-1/no-code-showcase` | P |
| — | Základy promptování a agentní anatomie | `day-1/opt-prompting-fundamentals` | V |
| — | Srovnání schopností podle cesty tvorby *(dokument, ne blok)* | `day-1/agent-landscape/comparison-agent-paths.md` | V |

> [!NOTE] Den 1 staví rozhodovací vrstvu **před** kódem. Blok 2 je ten, za který zákazník
> platí nejvíc: kdy deklarativní agent, kdy custom engine, kdy Copilot Studio, kdy Foundry —
> a proč. Blok 3 osu materializuje naživo (agent builder + Copilot Studio). Celý den jede
> **bez model endpointu** (jen tenant + PAYG).

> [!IMPORTANT] Realita prvního běhu (2026-08-24)
> Plánované byly čtyři bloky (360 min), odučily se **tři** (245 min) a naplnily celý den.
> `declarative-agents` se přesunul na **start dne 2**. Z toho vznikl časový etalon, podle
> kterého jsou přeplánované dny 2–5 (viz varování níže).
>
> Volitelné položky nejsou bloky dne, ale materiál k samostudiu:
> `opt-prompting-fundamentals` (převzato z GOC224 — anatomie promptu a **vrstvy instrukcí**;
> tabulka vrstev je vytažená do `declarative-agents`, kde má okamžitou hodnotu) a
> `comparison-agent-paths.md` (rozdílová matice čtyř cest **včetně SharePoint agentů** —
> hodnotnější než tabulka pěti cest ve výkladu, dát studentům jako referenci).

## Den 2 — Copilot v SharePointu, deklarativní strop a hygiena (~310 min, ODUČENO)

**Bez Azure** — celý den jel na tenantu a PAYG. Rozhodnutí lektora 2026-08-25 podle
zájmu skupiny: M365 strana nejdřív, kód až od D3.

| # | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Skills — rozšíření Copilot in SharePoint | `day-2/skills` | P | 70 |
| 2 | SharePoint agents *(instruktorské demo)* | `day-2/sharepoint-agents` | P | 30 |
| 3 | Deklarativní agenti & Agents Toolkit | `day-2/declarative-agents` | P | 100 |
| 4 | Datová hygiena + SharePoint Advanced Management | `day-2/data-hygiene` | P | 60 |
| 5 | Agenti v Marketplace — podmínky publikace (case study Normiqa Navigator) | `day-4/marketplace-agents` | P | 50 |

> [!NOTE] Bloky 1 a 2 jsou převzaté z GOC224 a zařazené na místě podle zájmu skupiny.
> Blok 3 se sem přesunul z dne 1 a končí přesně pojmenovaným stropem. Blok 4 je rozšířený
> o hloubku **SAM** (tři pilíře, RAC vs. RCD, licenční past) — nahrazuje samostatný SAM
> blok. Blok 5 se vešel navíc proti plánu: Navigator je deklarativní agent z Toolkitu
> s knowledge výhradně z webu, takže sedí hned za blok 3. Odučen **celý modul** včetně
> Partner Center a validačního procesu, ne jen case study.

> [!IMPORTANT] Strop bez odpovědi přes noc
> Deklarativní agent narazil na strop, ale custom engine přijde až D3. Uzavřít den větou,
> která z přesunu udělá argument: *„Strop jste viděli. Odpověď na něj začneme psát zítra
> ráno — dneškem jsme se ujistili, že tenant, do kterého ho pustíme, je uklizený."*

## Den 3 — První agent v kódu, znalosti a akce (290 min)

| # | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Agents SDK — jádro: AgentApplication, aktivity, turny | `day-1/agents-sdk-core` | P | 115 |
| 2 | Grounding: Copilot connectors, semantic index, MCP | `day-2/knowledge-grounding` | P | 85 |
| 3 | Action handlers & integrace s Microsoft Graph | `day-2/actions-graph` | P | 90 |

> [!NOTE] **První den s Azure.** Blok 1 je odpověď na strop z D2: první běžící custom engine
> agent v Agents Playgroundu. Klíče k model endpointu rozdat **ráno před blokem**. Blok 2
> učí *kdy retrieval nedělat sám* a navazuje na hygienu ze závěru D2. Blok 3 je pointa
> custom engine cesty — akce s validací, na kterou deklarativní agent nedosáhl.

## Den 4 — Copilot Apps, prompt, multi-agent a bezpečnost (315 min)

| # | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | SharePoint Copilot Apps *(Public Preview)* | `day-4/spfx-copilot-apps` | P | 50 |
| 2 | Prompt & systémová orchestrace | `day-3/prompt-orchestration` | P | 60 |
| 3 | Microsoft Agent Framework, workflows & multi-agent (A2A) | `day-3/agent-framework` | P | 75 |
| 4 | Bezpečnost & middleware — útok a obrana jako kód *(sloučený blok)* | `day-3/middleware-policy` | P | 130 |

> [!NOTE] Nejhustší den týdne. Blok 1 je vizuální rozjezd a **most k SPFx kurzům**. Blok 2
> dá agentovi systémový prompt s měřenou baseline — a pokus o obejití na jeho konci
> **uspěje**, což je záměr. Blok 4 to napraví: vznikl **sloučením `middleware-policy`
> a `security-risk`**, dramaturgie útok → proč prompt nedrží → middleware → scope.
> Middleware musí pokrýt **oba** agenty z bloku 3.

## Den 5 — Governance, kvalita a capstone (210 min, konec 13:00)

| # | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Agent 365, Entra Agent ID & instrumentace *(vč. hostingu v kostce)* | `day-4/agent-365-governance` | P | 60 |
| 2 | Evaluace & kvalita | `day-5/evaluation-quality` | P | 60 |
| 3 | Vlastní retrieval — instruktorské demo | `day-2/opt-custom-retrieval` | P | 30 |
| 4 | Capstone architektura & roadmapa | `day-5/capstone` | P | 60 |

> [!WARNING] Nejkratší den — 9:00 až 13:00 **bez pauzy na oběd**
> Reálně ~220 min čistého času. Plán má 210, rezerva je deset minut. Blok 4 je hodnotový
> závěr a **musí proběhnout** — když se skluz nedá dohnat, zkrátí se blok 2, ne capstone.
> Bez oběda navíc klesá pozornost rychleji než obvykle; capstone drž na 60 a v pair-share
> formátu, ne jako sérii prezentací.

> [!NOTE] Blok 1 pohltil i hosting (osa hostingu → samostudium). Blok 3 je odpověď
> na zájem skupiny o vlastní vektorizaci — demo místo plného modulu, plný text
> v [`day-2/opt-custom-retrieval/`](day-2/opt-custom-retrieval/).

> [!IMPORTANT] Etalon po dvou měřeních — kapacita je ~310 min/den
> | Den | Plán | Odučeno | Poznámka |
> |---|---|---|---|
> | D1 | 360 | **245** | jednorázová režie onboardingu u 20 strojů + seznamování |
> | D2 | 260 | **~310** | vešel se navíc celý blok Normiqa Navigator |
>
> **D1 byl výjimka, ne etalon.** Onboarding se neopakuje a diskusní bloky prvního dne
> byly nejhustší v týdnu. Pracovní kapacita je **~310 min/den** — kromě D5, který končí
> ve 13:00 bez oběda a má tvrdý strop ~220.
>
> Slack z toho **nerozpouštět celý**: první běh, tři restrukturalizace a D3 je první den
> s Azure (klíče, `.env`, možná proxy u 20 strojů). D3 proto zůstává na 290 jako rezerva,
> D4 dostal zpět 15 minut do nejsilnějšího bloku týdne.

## Kompresní ventily — v tomto pořadí

1. `day-2/data-hygiene` — tři pilíře SAM na jeden slide, RAC/RCD a checklist zůstávají.
2. `day-3/actions-graph` — část D jako demo (10 min), ne hands-on.
3. `day-5/opt-custom-retrieval` — demo padá celé, plný text zůstává k samostudiu.
4. `day-5/evaluation-quality` — část C labu jeden běh místo tří.

**Capstone není ventil.** Při skluzu D5 se zkracuje evaluace, ne závěr týdne.

Do samostudia bylo vyřazeno šest modulů — viz [`self-study.md`](self-study.md). Žádný
povinný modul ani capstone na nich nesmí záviset; to je podmínka, která je udržela
vyřaditelné.

## Nosná linka — jeden agent celý týden

Kurz nebuduje sérii nesouvisejících ukázek, ale **jednoho agenta**, který každý blok
něco získá. Scénář: [`scenario-support-agent.md`](scenario-support-agent.md).

```mermaid
flowchart LR
  D1[D1 showcase benchmark<br/>agent builder baseline] --> D2[D2 Skills + SP agents<br/>deklarativni v1 + strop]
  D2 --> D3[D3 scaffold + LLM turn<br/>knowledge + akce]
  D3 --> D4[D4 system prompt<br/>multi-agent + XPIA + middleware]
  D4 --> D5[D5 Agent 365<br/>+ evaluace]
  D5 --> C[Capstone<br/>prezentace celku]
```

## Nitě napříč kurzem

- **Rozhodovací nit**: `agent-landscape` + `no-code-showcase` (D1) → `skills` +
  `sharepoint-agents` + `declarative-agents` (D2) → `agents-sdk-core` +
  `knowledge-grounding` (D3) → `agent-framework` (D4). Pokaždé „která vrstva,
  a proč ne ta druhá".
- **Governance nit**: `data-hygiene` + SAM (D2) → `actions-graph` (hranice oprávnění, D3)
  → `middleware-policy` (útok a obrana, D4) → `agent-365-governance` (D5).
- **Kvalitativní nit**: `prompt-orchestration` (baseline, D4) → `evaluation-quality`
  (golden set, D5) → `capstone` (KPI matice, D5).

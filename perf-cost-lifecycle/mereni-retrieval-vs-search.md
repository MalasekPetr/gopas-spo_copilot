# Měření · Graph Search vs. Copilot Retrieval API

> Modul: `perf-cost-lifecycle` · Naměřeno **2026-08-27 večer** · Tenant `spdemo.online`
> Nástroj: [`srovnani-retrieval.mjs`](srovnani-retrieval.mjs) · Data: `srovnani-retrieval.json`
> Model `gpt-5-mini`, ceník [`prices-snapshot.json`](prices-snapshot.json), účet `petr.malasek@spdemo.online`

Obě cesty na **týchž čtyřech dotazech, týmž systémovým promptem a týmž modelem**.
Liší se jen mechanismus retrievalu.

## Nález č. 1 — `Accept-Language` je povinná, jinak API mlčí

**Bez hlavičky `Accept-Language` s konkrétním jazykovým tagem vrací Retrieval API
`200` a prázdné `retrievalHits` — bez jediné chybové hlášky.**

| `Accept-Language` | „access denied upload" | „Jaká je SLA na P1?" |
|---|---|---|
| neposláno | **0** (876 ms) | **0** (541 ms) |
| `en-US,en;q=0.9` | 1 (1 092 ms) | 1 (2 340 ms) |
| `cs-CZ,cs;q=0.9` | 1 (1 205 ms) | 1 (1 680 ms) |
| `cs` | 1 (1 307 ms) | 1 (1 163 ms) |
| `*` | **0** (471 ms) | **0** (473 ms) |

Hodnota tagu nerozhoduje, ale `*` nestačí. **Prohlížeč hlavičku posílá vždy,
Node `fetch` nikdy** — proto totéž volání chodí z Graph Exploreru a ne z agenta.

Poznávací znamení: **prázdná odpověď přijde za ~0,5 s, skutečné hledání trvá 1–3 s.**
Půlvteřinová nula = zkrat, ne „nic jsem nenašel".

> [!WARNING] Kolik nás to stálo
> Tahle jediná hlavička způsobila, že se Retrieval API v kurzu **považovalo za
> licenčně nedostupné**. Vznikla z toho „licenční matice" s domnělou anomálií
> lektorského účtu, která do dokumentace vydržela dva dny. Skutečná příčina nebyla
> ani licence, ani účet, ani typ souboru — byla to chybějící hlavička, kterou API
> nereklamuje.
>
> **Didaktická pointa:** tohle je nejlepší možný příklad věty *„200 s prázdnem je
> horší diagnóza než 403"*. Kdyby API vrátilo `400 Missing Accept-Language`,
> byla to oprava na pět minut.

## Nález č. 2 — na `.md` souborech je Retrieval API jen lexikální

I s funkční hlavičkou trefí Retrieval API **jeden dotaz ze čtyř**:

| Dotaz | Graph Search | Retrieval API |
|---|---|---|
| „Nejde mi upload, hlásí access denied." | 1 hit | **0** |
| „Jaká je SLA na P1?" | 1 hit | 1 hit |
| „Tiskárna netiskne a runbook nepomohl." | 3 hity | **0** |
| „Kdo jsem?" | 2 hity | **0** |
| *(kontrolně)* „access denied upload" — klíčová slova | — | **1 hit** |

Poslední řádek to vysvětluje. **Celá česká věta nenajde nic, anglická klíčová slova
ano.** To není chování sémantického hledání — to je chování lexikálního.

A dokumentace to říká předem:

> *If retrieving from SharePoint or OneDrive, semantic retrieval and hybrid retrieval
> is only supported for **.doc, .docx, .pptx, .pdf, .aspx, and .one** file extensions.
> All other file extensions **only support lexical retrieval**.*

**Runbooky jsou `.md`.** Sémantický retrieval se na ně nevztahuje, takže Retrieval API
dělá totéž co Graph Search — jen jiným endpointem a bez možnosti si dotaz přepsat.

> **Důsledek pro architekturu:** hlavní slibovaná výhoda Retrieval API — *„rozumí
> přirozenému jazyku, nepotřebuješ přepis dotazu"* — **se u nepodporovaných typů
> souborů neuplatní**. Volba formátu obsahu je tím pádem architektonické rozhodnutí,
> ne provozní detail. Kdo chce ze SharePointu sémantický grounding, musí obsah držet
> v `.docx` nebo `.pdf`.

## Výkon a cena

Naměřeno na těch čtyřech dotazech (průměr na dotaz):

| Metrika | Graph Search | Retrieval API |
|---|---|---|
| Volání modelu | **2,00** (přepis dotazu + odpověď) | **1,00** |
| HTTP volání | 3,75 | **1,00** |
| Latence retrievalu | 3 855 ms | **1 323 ms** |
| Latence celého turnu | 10 826 ms | **5 659 ms** |
| Vstupní tokeny | 800 | 240 |
| Výstupní tokeny | 1 135 | 560 |
| **USD / dotaz** | 0,00239 | **0,00114** |
| Měsíčně (200 lidí × 1 dotaz/den × 21 dnů) | **$10,02** | $4,79 |

> [!IMPORTANT] Ten levnější sloupec čti opatrně
> Retrieval API je levnější a rychlejší **částečně proto, že třikrát ze čtyř nic
> nenašlo**. Prázdný kontext = krátký prompt = levná odpověď. **Úspora, která vznikne
> tím, že nástroj neodpoví, není úspora.**
>
> Poctivá část srovnání: **jedno volání modelu místo dvou** a **jedno HTTP volání
> místo 3,75** platí vždy, bez ohledu na to, kolik se našlo. To je skutečná úspora
> a je to zhruba polovina latence turnu.
>
> V ceně navíc **není** poplatek za Retrieval API (PAYG meter) — ten se neúčtuje
> v tokenech modelu a do téhle tabulky nevstupuje.

## Kvalita odpovědí

LLM soudce dostal očekávané chování a obě odpovědi, aniž věděl, která je která:

- **Graph Search: 4/4 splněno**
- **Retrieval API: 3/4 splněno**
- Lepší: A 2× · B 2×

Zajímavější než skóre jsou dva konkrétní verdikty:

**K4 „Kdo jsem?" — soudce označil za lepší Retrieval API.** Graph Search totiž vrátil
`reset-hesla.md` a `incident-p1-sla.md` a agent z nich začal odpovídat. **Lexikální
falešná shoda doložená posudkem**, ne jen pozorováním.

**K1 a K3 — Retrieval API „splnilo" tím, že přiznalo neznalost.** Formálně správné
chování, fakticky selhání retrievalu. Golden set to nerozliší, protože rubrika
u těchhle případů říká „přiznej, že nevíš" — proto se v evaluaci měří
**groundedness zvlášť**, ne jen pass rate.

## Po převodu runbooků do PDF (27. 8. večer)

Runbooky byly zduplikovány do `.pdf` renditionů vedle původních `.md`.
**Sémantický index je pobral za necelých 13 minut** (18:39 nic → 18:52 hotovo),
ne za dny, jak varují diskuse o propagaci.

Retrieval API na přirozené české věty: **4 ze 4** (předtím 2 ze 4, z toho jedna
odpověď navíc špatná):

| Dotaz | Před (jen `.md`) | Po (s `.pdf`) |
|---|---|---|
| „Nejde mi upload, hlásí access denied." | 0 hitů | `access-denied-pri-uploadu-v2.0.pdf` |
| „Jaká je SLA na P1?" | `incident-p1-sla.md` | `incident-p1-sla-v1.0.pdf` + `.md` |
| „Tiskárna netiskne a runbook nepomohl." | 0 hitů | 3 hity, správný runbook první |
| „Jak si mám resetovat heslo?" | `access-denied-pri-uploadu.md` ✘ | `reset-hesla-v1.0.pdf` ✔ |

Poslední řádek je ten rozhodující: **dřív vracel špatný dokument, teď správný.**
Hypotéza „na `.md` je to lexikální" je tím potvrzená z druhé strany.

> [!WARNING] Převod formátu rozbije druhou cestu, pokud ji nezajistíš
> Graph Search filtruje jen `path:`, takže od téhle chvíle vrací i PDF — a agent
> na ně zavolá `.text()`, což je binární smetí poslané modelu jako podklad.
> Nutná pojistka: `AND filetype:md` v KQL. V `srovnani-retrieval.mjs` je doplněná.

## Dva běhy téže sady — co je stabilní a co ne

Sada projela dvakrát za sebou, stejné dotazy, stejný prompt, stejný model:

| Metrika | běh 1 | běh 2 | rozdíl |
|---|---|---|---|
| USD / dotaz — Graph Search | 0,00219 | 0,00223 | +2 % |
| USD / dotaz — Retrieval API | 0,00203 | 0,00198 | −2 % |
| Latence turnu — Graph Search | 9 849 ms | 10 166 ms | +3 % |
| Latence turnu — Retrieval API | 8 840 ms | 8 494 ms | −4 % |
| Hitů — Graph Search | 1,75 | 1,75 | 0 % |
| Hitů — Retrieval API | 1,25 | 1,00 | −20 % |

**Cena a latence kolísají do 4 %.** Na ty se dá stavět rozpočet.

Verdikty LLM soudce ale ne:

| Dotaz | běh 1 | běh 2 |
|---|---|---|
| K2 | lepší **A** | lepší **B** |
| K3 | remíza | lepší **B** |
| K4 | remíza | lepší **B** |

**Tři ze čtyř verdiktů se otočily.** Souhrn skočil z „A 1× · B 0× · remíza 2×"
na „A 1× · B 3× · remíza 0×".

> [!IMPORTANT] Jeden běh golden setu není měření, je to vzorek
> Tohle je nejsilnější argument pro krok „Změř rozptyl" v
> [`../../evaluation-quality/lab-golden-set.md`](../evaluation-quality/lab-golden-set.md) —
> a není z cvičení, ale z produkčního nástroje na reálných datech.
> **Prahy pro vydání se nastavují z rozdělení, ne z jednoho čísla.**

Jediný verdikt stabilní přes oba běhy: **K4 „Kdo jsem?"** — Retrieval API vrátilo
0 hitů pokaždé (správně, identita v runboocích není), Graph Search pokaždé tahal
`reset-hesla.md` a `incident-p1-sla.md`. Sémantika tu falešnou shodu odfiltruje
spolehlivě; lexikální hledání ne.

## Tři cesty vedle sebe (2 běhy × 4 dotazy)

Nástroj [`srovnani-tri-api.mjs`](srovnani-tri-api.mjs), tytéž dotazy, tentýž prompt
a model, dva běhy — protože jeden běh je vzorek, ne měření.

| Metrika | Graph Search | Retrieval API | Copilot Search |
|---|---|---|---|
| Nalezených podkladů / dotaz | **1,75** | 1,00 | **0,00** |
| Znaků podkladů / dotaz | **1 401** | 817 | **0** |
| Volání modelu / dotaz | 2,00 | **1,00** | **1,00** |
| HTTP volání / dotaz | 3,75 | **1,00** | **1,00** |
| Latence retrievalu | 4 169 ms | 1 643 ms | **905 ms** |
| Latence turnu | 10 140 ms | 8 155 ms | **5 331 ms** |
| USD / dotaz | 0,00223 | 0,00170 | **0,00110** |
| USD / měsíc (200 × 1/den) | $9,38 | $7,15 | **$4,62** |
| Kvalita — splnilo | **8/8** | 6/8 | **3/8** |
| Kvalita — nejlepší | 2× | **5×** | 1× |

**Retrieval nebyl vůbec flaky** — všechny tři cesty vrátily v obou bězích identický
počet hitů u každého dotazu. Kolísá hodnocení, ne vyhledávání.

> [!IMPORTANT] Nejlevnější sloupec nenašel nic
> Copilot Search vrátilo **0 hitů v osmi měřeních z osmi**. Je nejrychlejší a nejlevnější,
> protože prázdný kontext znamená krátký prompt. Jeho jediné „nejlepší" je K4
> („Kdo jsem?"), kde je správná odpověď *„na tohle runbooky nejsou"* — dalo ji
> z nevědomosti, ne z rozpoznání.
>
> **Cena za turn je metrika, kterou lze vylepšit rozbitím funkce.** Než někomu ukážeš,
> že nová varianta je o 40 % levnější, ověř, že pořád odpovídá.

### Není Copilot Search rozbité? Není — jen nevhodné

Doměřeno čistým retrievalem, bez volání modelu, tři tvary téhož dotazu:

| Tvar dotazu | Retrieval API | Copilot Search |
|---|---|---|
| přirozená česká věta | **4** hity | 0 |
| česká klíčová slova | **7** hitů | 2 |
| anglická klíčová slova | 1 | 0 |

Copilot Search **ožije** na klíčových slovech — ale i v nejlepším tvaru najde 2 tam,
kde Retrieval API najde 7.

Dvě věci, které z toho vypadly a mění dřívější závěry:

**Čeština poráží angličtinu, a to výrazně.** Anglická klíčová slova jsou nejhorší tvar
pro **obě** API. Dřívější poznámka „anglická klíčová slova fungují" platila jen pro
dotaz K1, kde je „access denied" v textu doslova.

**Retrieval API je na tvar dotazu citlivější, než tvrdí marketing.** 4 → 7 → 1 podle
formulace. Přepis dotazu tedy nezmizí ani při sémantickém hledání — jen se přestane
přepisovat do KQL a začne do jazyka. **Krok `buildSearchQuery` by i tady zlepšil recall.**

## Tři endpointy — naměřeno, ne odvozeno z dokumentace

| | `/v1.0/search/query` | `/v1.0/copilot/retrieval` | `/beta/copilot/search` |
|---|---|---|---|
| Najde naše `.md` | ano | ano (lexikálně) | ano (lexikálně) |
| Najde naše `.pdf` | ano | **ano, sémanticky** | **ne** |
| Přirozená česká věta | ne — nutný přepis na klíčová slova | **ano** (na `.pdf`) | **ne** |
| `Accept-Language` povinná | ne | **ano** | ne |
| Scoping | KQL `path:` | `filterExpression` | `dataSources.oneDrive.filterExpression` |
| Tvar odpovědi | metadata, obsah si stahuješ sám | `extracts[].text` — čistý text | `preview` — **se značkováním** |

Poznámky ke Copilot Search API, všechny změřené 27. 8.:

- **Vrací SharePoint, ne jen OneDrive**, přestože dokumentace mluví o „OneDrive for
  work or school". Vlastní příklad odpovědi v dokumentaci ostatně ukazuje
  `contoso.sharepoint.com/sites/IT/` — stránka si protiřečí sama.
- **Klíč se jmenuje `oneDrive`, ale cesta do SharePointu ve `filterExpression`
  se uplatní.** `dataSources.sharePoint` neexistuje — vrátí `200` a nulu za 112 ms,
  tedy tiše ignoruje. Další případ mlčící chyby.
- **PDF nevidí vůbec.** Dotaz „reset hesla runbook" vrátil `reset-hesla.md`,
  ne `reset-hesla-v1.0.pdf`; `filterExpression: "filetype:pdf"` vrátil nulu.
  **Dva Copilot endpointy, dva různé pohledy na tentýž obsah.**
- **Bez scopingu sáhne i mimo knihovnu** — do výsledků se připletla Loop komponenta
  z `contentstorage`.
- **`preview` obsahuje značkování shod** (`<c0>…</c0>`, `<ddd/>`). Kdo ho pošle rovnou
  do promptu, posílá modelu smetí. Retrieval API vrací v `extracts[].text` čistý text.

**Pro scénář tohoto kurzu je Search API nejslabší ze tří:** nevidí PDF, nerozumí
české větě a nemá čím to vyvážit.

## Co o těch endpointech říká dokumentace

Rešerše (Petr Malášek, 27. 8.) k tabulce výše doplňuje, co Microsoft deklaruje —
a kde se to od naměřeného liší:

| Endpoint | Deklarované zdroje | Deklarovaná sémantika |
|---|---|---|
| `POST /v1.0/search/query` | SharePoint, OneDrive, Exchange… | žádná, lexikální KQL |
| `POST /v1.0/copilot/retrieval` | SharePoint, OneDrive, Copilot connectors | jen `.doc`, `.docx`, `.pptx`, `.pdf`, `.aspx`, `.one` |
| `POST /beta/copilot/search` | **jen OneDrive for work or school** | vlastní seznam (`.html`, `.json`, `.csv`, `.xml`, `.png`, `.jpg`) — `.md` v něm **není** |

**Nelze použít širší seznam jednoho endpointu jako argument pro druhý.**

Dvě místa, kde měření dokumentaci neodpovídá:

- Search API má deklarované **jen OneDrive**, ale vrací obsah ze SharePointu —
  a totéž ukazuje i příklad odpovědi přímo v dokumentaci (`contoso.sharepoint.com/sites/IT/`).
- Requirement na `Accept-Language` u Retrieval API **není dokumentovaný vůbec**.

## „Copilot přece Markdown umí" — dvojí význam slova *podporováno*

Microsoft má samostatnou dokumentaci formátů pro **Copilot Chat, Pages, Notebooks
a Create**, kde `.md` podporovaný **je** — pro nahrání souboru do konverzace, shrnutí,
tvorbu dokumentu. To je ale **jiný mechanismus**: zpracování konkrétně přiloženého
souboru, ne tenantní sémantické indexování souboru ležícího v SharePointu.

> **Z „upload and summarize .md" nevyplývá sémantický retrieval přes
> `/copilot/retrieval`.** Dvě různé věci, dvě různá „supported".

Potvrzuje to i samostatná dokumentace **Semantic indexing for Microsoft Copilot**:
mezi sémanticky indexovanými typy jsou Word, PowerPoint, PDF, `.aspx`, OneNote
a data z Copilot connectors. `.md` tam **není**.

## Tři cesty k sémantickému groundingu nad Markdownem

Pokud sémantiku nad Markdownem opravdu chceš, existují tři realistické varianty —
a je to **architektonické rozhodnutí, ne konfigurace**:

**1. Publikační kopie v podporovaném formátu** (`.docx` nebo `.pdf`).
Zdroj zůstane `.md` kvůli gitu a diffům, vedle něj se generuje rendition pro retrieval.
Cena: duplicita, kterou musí něco udržovat — a **pozor, Graph Search cesta pak začne
stahovat PDF a číst ho jako text**. Nutná pojistka v KQL (`AND filetype:md`), případně
`FileExtension:"md"` ve `filterExpression` u Retrieval API.

**2. Synchronizovaný Copilot connector.** Connector si Markdown přečte, převede na
čistý text a uloží do `externalItem.content` — a **ten už sémanticky indexovaný je**.
Původní přípona přestává být rozhodující, protože do indexu nevstupuje soubor, ale
text. Retrieval API se pak volá s `dataSource: "externalItem"`.
Pozor, connectory se liší: **Enterprise Websites** connector `.md` uvádí a deklaruje
Semantic Search; **File Share** connector `.md` v seznamu extrahovaných typů **nemá**.
Federované MCP connectory obsah vůbec nesynchronizují, takže se jich sémantické
indexování netýká.

**3. Zůstat u lexikálního retrievalu a psát obsah pro něj.** Konzistentní odborné
termíny, synonyma přímo v textu, výstižné názvy souborů a nadpisy. Tohle je
mimochodem přesně to, co v kurzu děláte — jen se to dosud nejmenovalo rozhodnutím.

> [!IMPORTANT] Formulace, které se vyhnout
> Věta typu *„Copilot čte a indexuje Markdown výborně"* je pro raw `.md`
> v SharePointu **zavádějící**. Přesněji:
>
> *„Microsoft Copilot umí Markdown přímo zpracovat a synchronizované Copilot
> connectory jej mohou sémanticky indexovat. Soubory `.md` uložené přímo
> v SharePointu nebo OneDrivu však Retrieval API aktuálně vyhledává pouze lexikálně."*

## Co z toho platí pro kurz

1. **Živá cesta labu (Graph Search) zůstává správná volba.** Funguje pod Business
   Basic, nezávisí na preview API a na `.md` obsahu má vyšší recall. Retrieval API
   navíc skrývá past (`Accept-Language`), na kterou by studenti narazili bez šance
   ji odhalit.

2. **Retrieval API má reálné a měřitelné výhody** — jedno volání modelu místo dvou,
   poloviční latence retrievalu — **ale jen na podporovaných typech souborů**.
   Na `.md` je to lexikální hledání s jiným endpointem.

3. **Přepis dotazu na klíčová slova (`buildSearchQuery`) je kompenzace lexikálního
   indexu, ne daň za špatný návrh.** A dá se odstranit — ale ne změnou kódu.
   Odstraní ho **změna formátu obsahu**, což je rozhodnutí o architektuře, ne
   o implementaci. Doloženo: po převodu runbooků do `.pdf` začalo Retrieval API
   odpovídat na přirozené české věty 4/4 bez jediného volání modelu navíc.

4. **Formát obsahu je vstup do architektury agenta.** Rozhoduje se při zakládání
   knihovny, ne při ladění promptu. Tři možnosti — publikační rendition, Copilot
   connector, nebo zůstat u lexikálního — jsou popsané výš.

5. **Mlčící chyba je dražší než hlasitá.** V tomhle jediném měření se vyskytla
   třikrát: chybějící `Accept-Language` (200 + prázdno), neplatný `filterExpression`
   (dokumentace: „executes with no scoping"), a `dataSources.sharePoint`
   (200 + prázdno za 112 ms). Ani jedna z nich neřekla, co je špatně.
   **Agent, který takhle mlčí, se pozná až na účtu nebo na stížnosti uživatele.**

6. **Jeden běh evaluace není měření.** Cena a latence kolísaly do 4 %, ale tři ze
   čtyř verdiktů LLM soudce se mezi dvěma běhy otočily. Prahy pro vydání se
   nastavují z rozdělení, ne z jednoho čísla.

## Reprodukce


```powershell
cd C:\Repos\GOPAS\PMApp
node <klon-repa>\perf-cost-lifecycle\srovnani-retrieval.mjs `
     --token-search .lab-token --token-retrieval .lab-token
```

Přepínače: `--dotazy 2` (rychlý běh), `--bez-soudce` (ušetří tokeny),
`--token-search` / `--token-retrieval` (různé app registrace pro každou cestu).

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-27
> Požadavek na `Accept-Language` **není v dokumentaci** popsaný. Je to změřené
> chování, ne kontrakt — může kdykoli zmizet nebo se změnit. Před dalším během
> přeměřit tabulku z nálezu č. 1; když už hlavička potřeba nebude, tenhle text
> ztrácí platnost, ale pointa o „200 s prázdnem" zůstává.
>
> PAYG consumption pro Retrieval API je **preview**.

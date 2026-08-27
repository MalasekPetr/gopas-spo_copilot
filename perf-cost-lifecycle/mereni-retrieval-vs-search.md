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

## Tři endpointy, které nejsou zaměnitelné

Rešerše dokumentace (Petr Malášek, 27. 8.) upřesnila, že „hledání v Microsoftu 365"
znamená **tři různá API s různým chováním**. Zaměňovat je je nejčastější zdroj zmatku:

| Endpoint | Co dělá | Zdroje | Poznámka |
|---|---|---|---|
| `POST /v1.0/search/query` | Microsoft Search index, **lexikální** (KQL) | SharePoint, OneDrive, Exchange… | tohle používá lab |
| `POST /v1.0/copilot/retrieval` | Copilot **hybridní** index, vrací chunky | SharePoint, OneDrive, Copilot connectors | sémantika **jen pro podporované přípony** |
| `POST /beta/copilot/search` | Copilot Search API, hybridní | zatím **jen OneDrive** | vlastní seznam přípon (`.html`, `.json`, `.csv`, `.xml`, `.png`, `.jpg`) — `.md` v něm také **není** |

**Nelze použít širší seznam jednoho endpointu jako argument pro druhý.**

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

1. Živá cesta labu (**Graph Search**) je i po tomhle měření správná volba: funguje
   pod Business Basic, na `.md` obsahu má vyšší recall a nezávisí na preview API.
2. Retrieval API má reálné výhody — **polovina volání modelu, polovina latence** —
   ale jen na podporovaných typech souborů.
3. Přepis dotazu na klíčová slova (`buildSearchQuery`) není daň za špatnou volbu,
   ale **kompenzace lexikálního indexu**, kterou by sémantický retrieval odstranil.
   Tady ji odstranit nešlo, protože obsah je `.md`.

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

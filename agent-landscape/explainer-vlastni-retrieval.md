# Explainer · Vyhledávání jsme si pronajali

> Modul: `agent-landscape` · Typ: podklad k šesté otázce v [`recap-d5-rozhodovaci-mapa.md`](recap-d5-rozhodovaci-mapa.md)
> Prostředí: viz [`../../environment.md`](../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../GLOSSARY.md)

V úterý padl dotaz na vlastní vektorizaci. Ve středu skupina postavila grounding nad
SharePointem a přirozeně si řekla: *„vždyť jsme si ten retrieval udělali sami."*

**Neudělali.** A ten rozdíl je nejlepší možný výklad tématu, protože ho skupina neodbyla
teoreticky, ale vlastníma rukama — a ví, co ji na tom bolelo.

## Retrieval ano, vektorizace ne

Retrieval je *„najdi podklady a vlož je do promptu"*. To studenti napsali. Vektorizace je
**jak se hledá** — a tu za ně udělal SharePoint.

Otevři na plátně jejich vlastní `retrieve()` z [`../../knowledge-grounding/solution/agent.ts`](../knowledge-grounding/solution/agent.ts)
a projdi fáze RAG pipeline:

| Fáze RAG | Kdo ji ve vašem kódu udělal | Kde to v kódu je |
|---|---|---|
| Pochopení dotazu | **vy** — a stálo to volání modelu navíc | `buildSearchQuery()` |
| Chunking | **nikdo** | `.slice(0, 3000)` — to je useknutí, ne chunking |
| Embeddingy | **nikdo** | — |
| Index | platforma | Graph Search API |
| Vyhledání a ranking | platforma, **lexikálně** (KQL) | `size: 3`, vy jste vzali první tři |
| Security trimming | **platforma** | nikde — děje se samo |
| Aktuálnost indexu | platforma | nikde |

Ze sedmi fází udělali jedna a půl.

> **Věta na tabuli:** Napsali jste orchestraci retrievalu. **Vyhledávání jste si pronajali.**

## Tři momenty týdne byly příznaky lexikálního hledání

Tohle je nosná část výkladu — studenti si ty situace pamatují jako frustraci, ne jako teorii.

**1. Celá česká věta vrátila 0 hitů.** Museli přidat volání modelu, které z dotazu udělá
klíčová slova. Vektorový index ten krok **nepotřebuje**: hledá podle významu, ne podle
výskytu slov. To volání navíc byla daň za lexikální index — a platili ho v každém turnu.

**2. Slova se ANDovala, zase 0.** Přepnuli na OR a dostali šum. Vektorové hledání tuhle
volbu nemá, protože neporovnává slova.

**3. „Kdo jsem?" trefilo runbook o resetu hesla.** Lexikální falešná shoda na obecných
slovech (*identita, uživatel, účet*). Vektorové hledání by tomu dalo nízké skóre a práh
relevance by to odfiltroval. Oni to museli řešit **v promptu** — viz oprava priority
nástroje nad podklady ze 27. 8.

Každý workaround, který tenhle týden napsali, je symptom hledání podle slov.
**To je poctivý argument pro vektorizaci** — a mají ho z měření, ne z brožury.

## Co byste vlastnili, kdybyste to postavili sami

| Co přibude | Co se stane, když to zanedbáš |
|---|---|
| **Chunking a jeho ladění** — kde řezat, jak velké kusy, jaký přesah | odpověď rozříznutá vejpůl; model dostane půlku postupu |
| **Embedding pipeline** — každý dokument projít modelem, při každé změně znovu | index zastarává tiše |
| **Vektorové úložiště** a jeho provoz | další komponenta v architektuře, další účet |
| **Hybrid ranking** — vektory samotné jsou horší na přesné termíny (kódy chyb, čísla, názvy) | „SLA na P1" přestane fungovat, přestože sémanticky rozumíte |
| **Security trimming vlastními silami** — ACL u každého chunku, filtr při dotazu, reakce na změnu práv | **únik dat** |

Poslední řádek je pointa. U všech ostatních položek je chyba **horší odpověď**.
U security trimmingu je chyba **incident**. Když někdo ztratí přístup k dokumentu, váš
vektorový index o tom neví — semantic index to ví okamžitě, protože oprávnění vyhodnocuje
při dotazu, ne při indexaci.

## Živé demo: tentýž agent na dvou retrievalech

Slib z úterý se dá splnit líp než výkladem — **ukázat to na jejich vlastním agentovi**.
V repu jsou obě varianty a liší se **jedinou funkcí**:

| | [`solution/agent.ts`](../knowledge-grounding/solution/agent.ts) | [`solution/agent-retrieval-api.ts`](../knowledge-grounding/solution/agent-retrieval-api.ts) |
|---|---|---|
| Hledá | Graph Search, **lexikálně** (KQL) | Copilot Retrieval API, **sémanticky** |
| Přepis dotazu na klíčová slova | **ano** — `buildSearchQuery()`, volání modelu navíc | **není potřeba** |
| Stažení obsahu souboru | ano, pak `.slice(0, 3000)` | **ne** — API vrací rovnou chunky |
| Licence | funguje pod Business Basic | **vyžaduje Copilot licenci nebo PAYG meter** |

> [!NOTE] Mock byl podle Retrieval API modelovaný od začátku
> `mock-retrieval.mjs` vrací `retrievalHits → extracts`, tedy tvar Retrieval API.
> Přepnutí na živé API je proto **změna URL a hlavičky, ne přepis kódu**. Řekni to
> nahlas — je to ukázka toho, k čemu je mock dobrý, když se navrhne podle cílového API.

**Co nechat studenty změřit** (obojí mají v `usage-log.jsonl`, sloupec `kolo`):

1. **Počet kol na turn.** Graph Search varianta potřebuje kolo navíc na přepis dotazu.
   Na dotaz 1 to je 2 kola vs. 1. To je **přímá úspora, kterou vidí na účtu.**
2. **Hity na „Kdo jsem?"** Lexikální cesta trefila runbook o resetu hesla (obecná slova
   *identita, uživatel, účet*). Sémantická cesta by mu měla dát nízké skóre.
3. **Chování na 403 vs. 200 s nulou hitů.** Varianta rozlišuje obojí ve zvláštní větvi —
   *„nemám právo"* je jiná diagnóza než *„nemám data"*, a agent to musí umět říct.

> [!WARNING] Kterou identitou demo poběží, se dohodni předem
> Naměřeno 26. 8. na kurzovním tenantu, stejná registrace i dotaz, liší se jen účet:
>
> | Účet | Licence | Výsledek |
> |---|---|---|
> | admin | žádná | **403** „User does not have valid license" |
> | `user.NN` | PAYG meter | **200 + data** |
> | lektor | M365 Copilot Premium | **200 + 0 hitů** — nevysvětlená beta anomálie |
>
> **Demo tedy jet studentským tokenem.** S lektorským účtem uvidíš prázdno a demo
> vypadá jako rozbité, přestože API funguje. Tohle je zároveň nejlepší možná ukázka
> třetí peněženky — licencuje se **per uživatel**, ne per aplikace.

Filtr na knihovnu (`filterExpression`) je v **beta** tvaru. Kdyby API vrátilo
BadRequest, pošli dotaz bez něj a zúž až výsledky podle `webUrl` — v kódu je to
poznamenané.

## Rozhodovací pravidlo

> Vlastní retrieval si stavím, když **data nejsou v M365**, když potřebuju **vlastní ranking
> nebo chunking**, nebo když potřebuju **jinou hranici oprávnění než uživatelovu**.
> Ve všech ostatních případech si pronajímám index a píšu jen orchestraci — přesně jako ve středu.

Doplňkově ještě dva důvody, které se počítají jen změřené, ne tušené: **latence** nebo
**cena** indexu ti nevyhovuje, případně doména vyžaduje **embeddingy nad vlastním korpusem**
(terminologie, kterou obecný model nezná).

## Jak to odučit za čtyři minuty

Nekresli RAG diagram. Otevři jejich `retrieve()` a ptej se — v tomhle pořadí:

1. **„Kde je v tomhle kódu chunking?"** → nikde, je tam `slice`
2. **„Kde jsou embeddingy?"** → nikde
3. **„Kdo zařídil, že vidíte jen svoje soubory?"** → nikdo z nás
4. **„A proč jste museli psát `buildSearchQuery`?"** → *tady jim to docvakne*

Čtvrtá otázka je celý blok. Odpověď *„protože hledání je lexikální"* je zároveň důvod,
proč by někdo vektorizaci chtěl, **i** důvod, proč ji většina projektů nepotřebuje.

> [!TIP] Nezachraňuj to pointou o úspoře
> Neříkej „a proto se to nevyplatí". Studenti právě dostali dobrý důvod, proč by vektory
> chtěli. Správný závěr není „nedělejte to", ale **„je to rozhodnutí s cenovkou, a tou
> cenovkou je z devadesáti procent bezpečnost, ne peníze."**

## Kam dál

Plný text k samostudiu: [`../../opt-custom-retrieval/`](../opt-custom-retrieval/) —
chunking, embeddingy, hybrid ranking a security trimming do hloubky, 105 minut čtení.

## Zdroje (Microsoft)

[Semantic index for Copilot](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot) · [Microsoft Graph Search API](https://learn.microsoft.com/en-us/graph/search-concept-overview) · [KQL syntax reference](https://learn.microsoft.com/en-us/sharepoint/dev/general-development/keyword-query-language-kql-syntax-reference) · [Azure AI Search — hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview) · [Copilot Retrieval API (beta)](https://learn.microsoft.com/en-us/graph/api/copilotroot-retrieval) · [PAYG pro Retrieval API](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/paygo-retrieval)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-27
> Tabulka fází popisuje variantu, kterou skupina napsala: **Graph Search + stažení obsahu**.
> U varianty s **Copilot Retrieval API** ([`agent-retrieval-api.ts`](../knowledge-grounding/solution/agent-retrieval-api.ts))
> se řádek „Pochopení dotazu" přesouvá na platformu a příznaky č. 1 a č. 2 mizí —
> proto se obě cesty ukazují vedle sebe, ne jedna místo druhé.
>
> Co ověřit před dalším během: **PAYG consumption pro Retrieval API je preview**, ceny
> i dostupnost se mohou změnit bez oznámení. Tvar `filterExpression` je beta.
> A ta anomálie s lektorským účtem (200 + 0 hitů) nebyla vysvětlená — přeměřit.

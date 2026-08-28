# Tekuté písky retrievalu — co jsme naměřili

> Typ: povinný — **výklad + instruktorské ukázky** · Den: 5 · Odhad: **25 min** · Publikum: **vývojáři / architekti**
> Bez labu. Data jsou naměřená na kurzovním tenantu 2026-08-27, reprodukce
> v [`../perf-cost-lifecycle/mereni-retrieval-vs-search.md`](../perf-cost-lifecycle/mereni-retrieval-vs-search.md).
> Prostředí: viz [`../../environment.md`](../../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../../GLOSSARY.md)

Čtyři dny jsme stavěli agenta a narazili na věci, které vypadaly jako naše chyba.
**Nebyly.** Tenhle blok je změřená odpověď na otázky, které během týdne skutečně padly —
a zároveň ukázka, jak rychle se hýbe povrch, na kterém stavíme.

## Cíle

- Vědět, **proč bylo hledání nepřesné** — a že to nebyla chyba promptu ani modelu.
- Umět říct, **proč agent volal model dvakrát na jeden dotaz** a kdy ten krok zmizí.
- Znát **tři různá vyhledávací rozhraní** Microsoftu 365 a to, že na tentýž obsah
  odpovídají jinak.
- Umět obhájit **rozhodnutí o formátu obsahu** jako architektonické, ne provozní.
- Rozpoznat **mlčící chybu** a vědět, proč je dražší než hlasitá.

## Výklad

### 1. Proč hledání trefovalo špatné runbooky

Dotaz „Kdo jsem?" vracel runbook o resetu hesla. Dotaz na SLA fungoval. Celá česká věta
často nenašla nic, ale tři anglická slova ano. Vypadalo to jako rozmar modelu.

Nebyl. **Hledali jsme podle slov, ne podle významu.** Dokumentace to říká v sekci
Known limitations: sémantický a hybridní retrieval je nad SharePointem podporován
**pouze** pro `.doc`, `.docx`, `.pptx`, `.pdf`, `.aspx`, `.one`. Všechny ostatní přípony
mají **jen lexikální**.

Runbooky jsou `.md`.

**Ukázka (instruktor):** tentýž obsah ve dvou formátech, přirozené české věty.

| Dotaz | jen `.md` | po přidání `.pdf` |
|---|---|---|
| Nejde mi upload, hlásí access denied. | 0 hitů | 1 hit |
| Jaká je SLA na P1? | 1 hit | 2 hity |
| Tiskárna netiskne a runbook nepomohl. | 0 hitů | 3 hity |
| Jak si mám resetovat heslo? | **špatný dokument** | **správný, první** |

Poslední řádek je ten rozhodující. Sémantický index navíc pobral nové PDF
**za necelých 13 minut**, ne za dny, jak varují diskusní fóra.

> **Formát obsahu je vstup do architektury agenta, ne provozní detail.**
> Tohle jsme nespravili promptem ani kódem. Spravil to převod souborů — a o tom
> se rozhoduje ve chvíli, kdy zakládáte knihovnu.

### 2. Proč jsme volali model dvakrát na jeden dotaz

Agent přepisoval dotaz uživatele na klíčová slova zvláštním voláním modelu.
Vypadalo to jako neefektivita, kterou jsme si vyrobili sami. Byla to **kompenzace**:
lexikální index neumí „Nejde mi upload, hlásí access denied." — věta se rozpadne na slova,
která se ANDují, a nenajde se nic.

| | fulltextová cesta | sémantická cesta |
|---|---|---|
| Volání modelu na dotaz | **2,00** | **1,00** |
| HTTP volání na dotaz | 3,75 | 1,00 |

Ale pozor na zjednodušení: i sémantická cesta je na tvaru dotazu citlivá. Přes čtyři dotazy
našla **4 hity** na přirozené věty, **7** na česká klíčová slova a **1** na anglická.
Přepis dotazu tedy nezmizí úplně — jen se přestane přepisovat do KQL a začne do jazyka.

### 3. Co která cesta stojí

Tři rozhraní, tytéž čtyři dotazy, tentýž prompt, tentýž model, dva běhy.

| Metrika | Graph Search | Retrieval API | Copilot Search |
|---|---|---|---|
| Nalezených podkladů / dotaz | **1,75** | 1,00 | **0,00** |
| Volání modelu / dotaz | 2,00 | **1,00** | **1,00** |
| Latence turnu | 10 140 ms | 8 155 ms | **5 331 ms** |
| USD / měsíc (200 lidí × 1 dotaz/den) | $9,38 | $7,15 | **$4,62** |
| Kvalita — splnilo očekávání | **8/8** | 6/8 | **3/8** |
| Kvalita — vyhodnoceno jako nejlepší | 2× | **5×** | 1× |

> **Nejlevnější sloupec je nejlevnější proto, že nenašel nic.** Nula podkladů znamená
> krátký prompt a rychlou odpověď. Úspora, která vznikne tím, že nástroj neodpoví,
> není úspora — je to výpadek, který vypadá jako optimalizace.

**Až budete zákazníkovi ukazovat, že nová varianta je o 40 % levnější, zkontrolujte
nejdřív, jestli pořád odpovídá.** Cena za turn je metrika, kterou lze vylepšit
rozbitím funkce.

Poctivá část úspory: jedno volání modelu místo dvou a jedno HTTP volání místo 3,75.
To platí bez ohledu na to, kolik se našlo.

### 4. Kdy si stavět vlastní vektorizaci

Ve středu jsme napsali `retrieve()` a měli pocit, že jsme si udělali RAG. Neudělali.

| Fáze RAG | Kdo | Kde to je |
|---|---|---|
| Pochopení dotazu | **vy** | `buildSearchQuery()` — a stálo to volání modelu |
| Chunking | **nikdo** | `.slice(0, 3000)` je useknutí, ne chunking |
| Embeddingy | **nikdo** | — |
| Index | platforma | — |
| Vyhledání a ranking | platforma | vzali jste první tři |
| Security trimming | platforma | nikde — děje se samo |
| Aktuálnost indexu | platforma | nikde |

**Napsali jste orchestraci retrievalu. Vyhledávání jste si pronajali.** A to je dobře:
u všech položek kromě jedné je chyba jen horší odpověď. U security trimmingu je chyba
**únik dat** — když někdo ztratí přístup k dokumentu, váš vektorový index o tom neví.
Platformní index to ví okamžitě, protože oprávnění vyhodnocuje při dotazu, ne při indexaci.

Vlastní retrieval si stavíte, jen když platí aspoň jedno:

- data **nejsou v Microsoftu 365**
- potřebujete **vlastní ranking nebo chunking**
- potřebujete **jinou hranici oprávnění** než uživatelovu
- latence nebo cena indexu nevyhovuje — **změřeno, ne tušeno**

Pro Markdown existuje třetí cesta mezi „převést na PDF" a „smířit se s fulltextem":
**synchronizovaný Copilot connector**. Ten obsah extrahuje jako text do
`externalItem.content`, a ten už sémanticky indexovaný je — původní přípona přestává
rozhodovat. Detail v [`../../day-3/opt-custom-retrieval/`](../../day-3/opt-custom-retrieval/).

### 5. Proč tekuté písky — tři rozhraní, tři odpovědi

| | `/search/query` | `/copilot/retrieval` | `/copilot/search` |
|---|---|---|---|
| Vidí naše `.md` | ano | ano, lexikálně | ano, lexikálně |
| Vidí naše `.pdf` | ano | **ano, sémanticky** | **ne** |
| Rozumí české větě | **ne** | **ano** (na PDF) | **ne** |
| Vrací | metadata, obsah stahujete sami | čistý text | text se značkováním shod |

A tři věci, které se z dokumentace nedozvíte, nebo které jí odporují:

**Nedokumentovaný požadavek.** Retrieval API vrací `200` a prázdný výsledek, pokud
požadavek nemá hlavičku `Accept-Language` s konkrétním jazykem. Hodnota `*` nestačí.
Prohlížeč ji posílá vždy, serverový kód nikdy — proto totéž volání funguje z Graph
Exploreru a ne z agenta. **V dokumentaci to není.**

**Dokumentace si protiřečí.** Copilot Search API má deklarovaný jen OneDrive, ale vrací
obsah ze SharePointu — a ukazuje to i příklad odpovědi na téže stránce.

**Chyby jsou tiché.** V jediném měření se to stalo třikrát: chybějící hlavička, neplatná
syntaxe filtru (dokumentace přiznává, že se dotaz „provede bez scopingu"), a neexistující
konfigurační klíč — `200` a prázdno za 112 ms. Ani jednou nezaznělo, co je špatně.

> **Prázdná odpověď za půl vteřiny není „nic jsem nenašel". Je to zkrat.**
> Skutečné hledání trvá jednotky vteřin. Když se váš agent tváří, že v knowledge base
> nic není, změřte, jak dlouho ta odpověď trvala.

### 6. Jeden běh není měření

Celou sadu jsme pustili dvakrát. Stejné dotazy, stejný prompt, stejný model, stejné podklady.

- Cena a latence kolísaly **do 4 %** — na ty se dá stavět rozpočet.
- **Tři ze čtyř verdiktů** LLM soudce se mezi běhy **otočily**.

Prahy pro vydání se nastavují **z rozdělení, ne z jednoho čísla**. Když vám evaluace vyjde
7/8, potřebujete vědět, jestli je to 7/8 pokaždé, nebo jednou 8/8 a jednou 6/8.
To je přímý vstup do bloku o evaluaci.

## Klíčové rozlišení

- **Lexikální** (podle slov) vs. **sémantický** (podle významu) retrieval — a že o tom
  rozhoduje **přípona souboru**, ne nastavení.
- **Orchestrace retrievalu** (napsali jste) vs. **vyhledávání** (pronajali jste si).
- **Mlčící chyba** (`200` + prázdno) vs. **hlasitá** (`403`). Ta druhá je levnější.
- **Úspora** vs. **výpadek, který vypadá jako úspora**.

## Co si odnést do zákaznického rozhovoru

1. Formát obsahu rozhoduje o kvalitě groundingu — řeší se při zakládání knihovny.
2. Levnější varianta může být levnější tím, že přestala odpovídat. Ověřte obojí.
3. Platformní index dělá security trimming za vás; vlastní vektorizace tuhle povinnost přebírá.
4. Ověřujte měřením k datu nasazení. Čísla bez data jsou v tomhle prostoru bezcenná.

## Nosná linka

Support Asistent dostává **vysvětlení sám sebe**: proč se choval, jak se choval.
Blok uzavírá otázku z úterý (vlastní vektorizace), doplňuje cenovou stránku pro capstone
a předává rozptyl verdiktů do bloku o evaluaci.

## Zdroje (Microsoft)

[Retrieval API — overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/overview) · [Retrieval API — reference](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/copilotroot-retrieval) · [Copilot Search API](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/search/copilotroot-search) · [Microsoft Graph Search API](https://learn.microsoft.com/en-us/graph/search-concept-overview) · [Semantic index for Copilot](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot)

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — všechna čísla jsou z 2026-08-27
> Požadavek na `Accept-Language` **není dokumentovaný** — je to změřené chování, ne
> kontrakt, a může kdykoli zmizet. PAYG consumption pro Retrieval API je **preview**.
> Copilot Search API je v `beta`. Před dalším během přeměřit tabulky v sekcích 3 a 5;
> když už hlavička potřeba nebude, pointa o „200 s prázdnem" platí dál.

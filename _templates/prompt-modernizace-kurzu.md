# Přechodový prompt — modernizace kurzu do repa

> Šablona pro **novou session Claude Code** nad jiným kurzem GOPAS. Zkopíruj text
> pod čarou, doplň `«…»` placeholdery a vlož jako první zprávu.
>
> Vznikla po prvním běhu SPO_COPILOT (2026-08). Laťku drží GOC224 (struktura
> a konvence) a SPO_COPILOT (obsahový standard).

---

Jsem lektor GOPAS. Modernizujeme kurz **«KÓD_KURZU» — «název kurzu»**. Materiály
dnes existují jako «PowerPoint / Word / …» v «cesta nebo umístění»; **repo zatím
neexistuje** a chci ho založit.

Katalogová stránka kurzu: «URL na gopas.cz»

## Dva referenční repozitáře

**Strukturu a konvence** ber z `https://github.com/MalasekPetr/gopas-goc224.git`.
Naklonuj si ho do dočasné složky a prohlédni si ho dřív, než cokoli navrhneš.

**Obsahový standard** ber z `https://github.com/MalasekPetr/gopas-spo_copilot.git`.
Je to novější kurz, který laťku posunul výš — hlavně v tom, že nic netvrdí bez měření.

Nekopíruj z nich obsah. Kopíruj **tvar a nároky**.

## Nepřekročitelná struktura

```text
«kod-kurzu»/
├─ README.md              # jak repo číst, struktura, legenda, stav
├─ CONVENTIONS.md         # MD styl, Mermaid, currency-markery, prefixy souborů
├─ GLOSSARY.md            # závazné názvosloví, přejmenování, tabulka zkratek
├─ agenda.md              # pořadí bloků napříč týdnem (single source of order)
├─ environment.md         # prostředí, účty, licence, matice požadavků per blok
├─ self-study.md          # co se neodučí a kde to student najde
├─ «scenar».md            # nosná linka — viz níž
├─ _templates/            # module.md, lab.md
├─ day-1/ … day-N/
│   ├─ README.md          # denní briefing: tabulka bloků, timing, kompresní ventily
│   └─ «modul»/           # README.md, instructor-notes.md, lab-*.md, případně solution/
└─ marketing/             # návrh webového textu (cs / en / sk) s delta tabulkou
```

Moduly jsou složky pojmenované **slugem**, ne číslem — vložení dalšího modulu nesmí
rozházet číslování. Den a pořadí drží `agenda.md` a `day-N/README.md`.

Každý den má v README **tabulku bloků** se sloupci `Pořadí | Blok | Slug | Typ | min`,
kde typ je **P** (povinný) nebo **V** (volitelný / samostudium). **Volitelné moduly
patří do tabulky svého dne**, ne do samostatného seznamu — jinak na ně nikdo nesáhne.

## Tři věci, které musí platit — to je ta laťka

### 1. Nic netvrdit bez měření

Tohle je nejdůležitější bod celého zadání.

Každé netriviální tvrzení v materiálu musí být buď **ověřitelné z dokumentace
s odkazem**, nebo **změřené s datem**. Ne „bývá to rychlejší", ale „na kurzovním
tenantu 2026-08-27: 4 169 ms vs. 1 645 ms".

- Naměřená čísla dostávají blok `> [!IMPORTANT] … — změřeno (RRRR-MM-DD)`.
- Fakta, která rychle stárnou (ceny, preview, verze, retirement dat), dostávají
  `> [!WARNING] Ověřit k datu běhu — stav k RRRR-MM`.
- Když něco nevíš nebo to nejde ověřit, **napiš to** jako otevřenou otázku.
  Nedopisuj to.

Ptej se mě na čísla, která nemáš. Když ti dám přístup k prostředí, změř je.

### 2. Nosná linka — jeden artefakt celým kurzem

Kurz není série cvičení. **Celý kurz se buduje jeden artefakt** a každý den mu
přibude jedna vrstva. Scénář žije v samostatném souboru v kořeni repa a každý modul
na něj odkazuje: co do něj přidává a co se tím změnilo.

Pro «KÓD_KURZU» to bude «doplň — např. jeden tenant, jedno řešení, jeden dokument».
Než začneš psát moduly, **navrhni mi tu linku a nech si ji schválit**. Když ji
nevymyslíme, kurz se rozpadne na přednášky.

### 3. Instructor notes krátké a provozní

`instructor-notes.md` v každém modulu, **do 45 řádků**, tři sekce:

- **Timing** — kolik minut, jak se to rozpadá, co se krátí první.
- **Go/no-go** — co ověřit *před* během. Konkrétně, ne „připravit prostředí".
- **Tripwires** — kde to studentům spolehlivě ujede a co s tím.

Co do nich **nepatří**: seznamy odkazů na jiné moduly (to je navigace, ta je
v README), dlouhé referenční řešení (do vlastního souboru) a jakékoli vyprávění
o tom, jak jsme kurz přestavovali.

> Poznámka k tomu poslednímu: historie rekalibrací je **interní**. Do studentských
> souborů nepatří vůbec, do poznámek jen tam, kde ti mění chování v hodině.

## Jak spolu pracujeme

- **Česky.** Nikdy azbuku — ani omylem v komentářích kódu.
- **Odpověď první, pak zdůvodnění.** Konkrétní čísla místo „několik" a „výrazně".
- **Než začneš přepisovat, řekni plán a počkej na schválení.** Platí zvlášť pro
  přesuny souborů a hromadné úpravy.
- **Nejmenší možný zásah**, který řeší zadání. Žádné nevyžádané refaktory.
- **Oponuj mi.** Když je v mém zadání chyba nebo si materiál protiřečí, řekni to.
  Tenhle týden se tím opravilo víc věcí než mým vlastním čtením.
- Po každém hromadném zásahu **ověř, že všechny relativní odkazy vedou na existující
  cíl** — skriptem, ne odhadem.
- Skripty piš **do souboru a spouštěj**, ne inline do shellu. Backticky a české
  znaky v `node -e` v bashi mizí a rozbíjí to text potichu.

## První úkol — inventura, ne přepis

Ještě nic nepiš. Nejdřív:

1. Naklonuj si oba referenční repozitáře a prohlédni si jejich strukturu.
2. Přečti si zdrojové materiály kurzu a **udělej mi jejich inventuru**: co v nich je,
   co je zastaralé, co chybí proti dnešnímu stavu produktu, co je duplicitní.
3. Porovnej s katalogovou osnovou na webu — kde se rozchází a co z toho je věcná chyba
   (retirované certifikace, přejmenované produkty, špatná úroveň obtížnosti,
   předpoklady v nesprávném pořadí).
4. Navrhni mi **rozvržení do dnů a bloků** včetně odhadů minut a návrh nosné linky.

Teprve až tohle schválím, zakládej repo a piš obsah.

## Čeho se vyvarovat

- **Nepřevádět starou strukturu 1:1.** Původní členění je obvykle dané tím, jak
  vznikaly slajdy, ne tím, jak se látka učí.
- **Nepsat laby, které nejdou projít samostatně.** Každý krok končí ověřitelným
  checkpointem: co přesně má student vidět.
- **Neplánovat víc, než se dá odučit.** Odhady dělej střízlivé; radši méně bloků
  a hlubší laby.
- **Nepřebírat marketingové zjednodušení jako odbornou odpověď.** Když produktový
  materiál říká „na tohle je nástroj X", ověř, jestli to platí i pro publikum tohohle
  kurzu — často ne.

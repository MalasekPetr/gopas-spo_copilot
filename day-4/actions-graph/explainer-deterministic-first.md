# Explainer · Co nemusí dělat model

> Modul: `actions-graph` · Typ: deep-dive k návrhu akcí
> Prostředí: viz [`../../environment.md`](../../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../../GLOSSARY.md)

Validaci parametrů dělá **kód, ne prompt** — to je pointa tohoto modulu. Tenhle text ji
posouvá o patro výš: **stejná otázka platí pro celé zadání, ne jen pro validaci.**
U každého kroku se ptej, jestli ho musí dělat model. Většinou nemusí.

## Proč se to přehlíží

S agentem si člověk představí use case **jako jeden krok**: *„vezmi výpis z rejstříku
a vytáhni mi vlastníky."* Model to nějak vyřeší. A ono to opravdu nějak vyjde — proto
se ta představa nikdy nerozpadne sama.

Rozpad na kroky přijde až s účtem, s prvním špatným výsledkem, nebo s otázkou auditora
*„odkud to číslo je?"*.

> [!IMPORTANT] Nejdražší chyba není špatný model, ale neudělaný rozpad
> Když zadání nerozložíš, jediná páka, která zbyde, je koupit si větší model. To je
> nejdražší a nejméně účinná varianta — řeší symptom. Dobrý rozpad potřebu silného
> modelu většinou **odstraní**, protože modelu zbyde malá ohraničená úloha.

## Tři druhy práce, které se pletou

Než sáhneš po modelu, zařaď krok do jedné ze tří kategorií:

| Druh | Poznáš podle | Čím to udělat |
|---|---|---|
| **Deterministické** | hodnota je na známém místě ve známé struktuře | API, parser, regex, výpočet — **žádný model** |
| **Extrakce** | hodnota v textu je, ale rozložení kolísá | **levný model** se strukturovaným výstupem, bez reasoningu |
| **Inference** | hodnota se **odvozuje** z víc faktů, které si můžou odporovat | reasoning model — tady teprve dává smysl |

Dělicí čára mezi druhým a třetím řádkem je: **hledáš hodnotu, nebo ji odvozuješ?**

- *„Najdi jméno vedle IČO"* — jednou je nad ním, jednou vedle, jednou v tabulce.
  Kolísá **rozložení**, ne význam. To je extrakce; variabilita layoutu není důvod
  pro uvažování, na tu stačí vynucené schéma výstupu.
- *„V rejstříku je jako společník X, ale notářský zápis říká, že podíl přešel na Y.
  Kdo je vlastníkem dnes?"* — musíš skloubit dva zdroje, časovou osu a pravidlo.
  **Tady reasoning dává smysl.**

## Rozhodovací postup

U každého kroku shora dolů. První kladná odpověď vyhrává:

1. **Existuje pro to API se strukturovanými daty?** → volej API. Hotovo.
2. **Je to v souboru s předvídatelnou strukturou?** → parser, XPath, regex.
3. **Je to výpočet, převod, formát, whitelist?** → kód.
4. **Je to v textu, ale rozložení kolísá?** → levný model, strukturovaný výstup.
5. **Musí se to odvodit z víc faktů?** → reasoning model.
6. **Musí to znít lidsky?** → model na formulaci, ale nad **hotovými** daty.

Modelu tedy nechej to, co po krocích 1–3 zbude — a to bývá překvapivě málo.

## Case study — vlastníci firmy z rejstříku

Zadání: *„Zjisti společníky firmy a jejich podíly."* Klasický kandidát na agenta.

### Varianta A — celé PDF do modelu

Stáhnout výpis ze Sbírky listin a nasypat ho modelu: *„najdi v tom vlastníky."*
Funguje. Je to ale nejdražší i nejméně spolehlivá cesta — model čte tisíce tokenů
šumu, aby našel tři údaje, a výsledek je **odvozený**, ne opsaný.

### Varianta B — deterministický předfiltr

Stažení a parsování PDF udělá kód, relevantní sekci najde regex, modelu jde jen
odstavec. Vstup se zmenší pětinásobně a — což je důležitější — **na zbytek stačí
nejlevnější třída modelu**, protože už nemusí nic hledat v šumu.

### Varianta C — strukturovaná data přímo

U **s.r.o. jsou společníci ve veřejném rejstříku jako strukturovaná data** a ARES je
vrací přes veřejné REST API bez klíče a bez registrace:

```text
GET https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty-vr/{ICO}
```

Odpověď obsahuje `spolecnici` → `spolecnik` → `podil` → `vklad`, `velikostPodilu`,
`splaceni` a `osoba` se jménem. **Model nepotřebuješ vůbec.**

### Srovnání

| Varianta | Cena za provoz | Jak vzniká hodnota |
|---|---|---|
| A — celé PDF modelu | plná | model ji **odvodí** z textu |
| B — předfiltr + levný model | zlomek A | model ji odvodí z užšího vstupu |
| **C — API** | **nulová** | **přečte se ze zdroje** |

Konkrétní čísla si přepni ve vizuálním kalkulátoru
[`../../perf-cost-lifecycle/cost-visual.html`](../../day-5/perf-cost-lifecycle/cost-visual.html)
— varianty A a B tam jsou jako předvolby *Vlastníci z justice.cz*
a *↳ s deterministickým předfiltrem*, takže rozdíl vidíš na jedno kliknutí.
Pro vlastní naměřené hodnoty je vedle CLI
[`cost-calculator.mjs`](../../day-5/perf-cost-lifecycle/cost-calculator.mjs)
(`--scenario muj.json`, `--model`, `--cache`, `--history`).

> [!WARNING] Ověřit k datu běhu — stav k 2026-08
> Ověřeno voláním ARES: základní endpoint `/ekonomicke-subjekty/` vlastníky **nevrací**,
> data jsou až ve variantě `-vr`. U **a.s.** `spolecnici` nejsou — akcionáři se
> do rejstříku nezapisují, což je vlastnost práva, ne API.
>
> **Justice.cz nabízí výpis a Sbírku listin jako dokumenty, ne jako API** — pro listiny
> tedy varianta B platí a je to správná cesta.

### Kde AI v tomhle zadání skutečně začíná

Tam, kam strukturovaná data nesahají: **notářský zápis o převodu podílu, ovládací
smlouva, prohlášení o skutečném majiteli.** Nestrukturovaný text, kde se význam odvozuje.
To je ta malá část zadání, která model opravdu potřebuje — a je to typicky pár procent
původní představy.

## Spolehlivost si nekoupíš modelem

Nejčastější obava zní: *„a co když model něco přehlédne?"* Odpověď **není** silnější
model. Model, který uvažuje déle, ti úplnost nezaručí — jen ti ji dráž nezaručí.

Úplnost se vynucuje **kontrolou**, a ta je deterministická:

- porovnej počet nalezených společníků proti počtu ze strukturovaného zdroje;
- zkontroluj, že součet podílů dává 100 %;
- když nesedí, **eskaluj člověku** místo tichého vrácení neúplného seznamu.

Tři kontroly, žádný model, a dohromady dají jistotu, kterou by sebedražší model nedal.
Je to tentýž princip jako validace parametrů v tomhle modulu — jen aplikovaný na výstup.

## Tři důvody, ne jeden

Cena je nejviditelnější, ale nejslabší argument:

1. **Levnější** — o řád, ne o procenta.
2. **Přesnější** — přečtená hodnota nemá rozptyl; odvozená ano.
3. **Auditovatelné** — na otázku *„odkud to číslo je?"* ukážeš pole ve zdroji.
   *„Model to tak shrnul"* není odpověď, kterou u zákazníka s NIS2 nebo ISO 27001
   obhájíš.

Ten třetí důvod bývá v praxi rozhodující, i když se o něm mluví nejmíň.

## Kdy naopak model ano

Aby to nevyznělo jako „AI nepoužívat":

- **nestrukturovaný text**, kde význam nese formulace, ne pozice;
- **jazyková variabilita** — tentýž požadavek řečený deseti způsoby;
- **shrnutí a přeformulování** pro člověka;
- **klasifikace záměru** tam, kde whitelist nestačí;
- **odvozování** z víc zdrojů, které si můžou odporovat.

Tam je model nenahraditelný. Cílem není mít v řešení co nejmíň AI — cílem je mít ji
**tam, kde nic jiného nefunguje**.

## Otázka do capstonu

*„Které kroky vašeho řešení nepotřebují model — a čím je nahradíte?"*

Kdo na ni nemá odpověď, nemá architekturu; má jeden krok a naději.

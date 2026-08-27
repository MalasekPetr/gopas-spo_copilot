# Explainer · Obhajoba volby modelu a ROI

> Modul: `perf-cost-lifecycle` · Typ: podklad pro capstone a pro jednání se sponzorem
> Prostředí: viz [`../environment.md`](../../environment.md) · Názvosloví: [`../GLOSSARY.md`](../../GLOSSARY.md)

Sponzor se zeptá na tři věci a všechny tři zní jako výtka: *„Proč to volá model
tolikrát? Proč platíme za přemýšlení, které nevidíme? A vydělá to vůbec něco?"*

Tenhle text je odpověď — postavená na číslech změřených na kurzovním agentovi
(2026-08-26, `gpt-5-mini` DataZone), ne na argumentaci.

## 1. Proč tolik turnů

**Turn = jedna otázka uživatele.** Jejich počet neurčuje technologie, ale proces:
kolikrát za měsíc se člověk obrátí na podporu. To je vstup z byznysu, ne z architektury.

Co ale architektura **ovlivňuje zásadně**, je kolik turnů spotřebuje *jeden* problém.
Změřený příklad z prvního běhu kurzu:

| Verze agenta | Chování na dotaz „Nejde mi upload, hlásí access denied." | Turnů na vyřešení |
|---|---|---|
| instrukce v datové zprávě | **výslech**: „Kde se to děje? Přes web nebo aplikaci? URL? Přesný text chyby? …" | 3–4 |
| instrukce v systémovém promptu | rovnou postup z runbooku s citací | **1** |

Stejný model, stejná data, jediný rozdíl je **kam se napsala instrukce**. Špatně
navržený agent si vynutí doptávání a **ztrojnásobí počet turnů** — tedy i cenu
a hlavně čas uživatele.

> **Věta pro sponzora:** *„Počet turnů je metrika kvality návrhu, ne cena technologie.
> Agent, který se ptá na to, co už ví, stojí trojnásobek."*

## 2. Proč tolik kol uvnitř turnu

**Kolo = jedno volání modelu.** Naměřeno na kurzovním agentovi: **2,0 kola na turn**
u groundovaného dotazu, až 3 u dotazu s akcí.

Není to plýtvání — je to **struktura úlohy**. Model nemá přístup k ničemu kromě textu,
který mu pošleš. Každý kontakt s vnějším světem stojí jeden obrat:

| Kolo | Co se v něm děje | Proč nejde vynechat |
|---|---|---|
| 1 | dotaz uživatele → **klíčová slova** pro vyhledávání | změřeno: celá věta v lexikálním indexu vrátí **0 hitů** |
| 2 | podklady + dotaz → **odpověď** | model musí podklady vidět, aby z nich odpověděl |
| 3+ | model si vyžádá **nástroj**, dostane výsledek, formuluje odpověď | agent nemůže jednat a odpovídat v jednom kroku |

**Kola = počet výměn s vnějším světem + 1.** Kdo chce míň kol, musí ubrat vnějšímu
světu — a to je architektonické rozhodnutí s cenou, ne optimalizace.

Kde se kola **dají** ubrat legitimně:

- **deterministicky místo modelem** — když se dotaz dá zpracovat kódem, kolo mizí
  ([`../actions-graph/explainer-deterministic-first.md`](../../day-4/actions-graph/explainer-deterministic-first.md));
- **sémantický index místo lexikálního** — Copilot Retrieval API nepotřebuje přepis
  dotazu, takže ušetří kolo 1. Platí se za něj licencí; je to výměna, ne úspora.

## 3. Proč reasoning — a kolik ho doopravdy potřebuješ

Reasoning tokeny jsou **výstupní tokeny, které v odpovědi nevidíš**. Na kurzovním
agentovi tvořily **71,9 % veškerého výstupu**. To je nejčastější zdroj šoku nad
fakturou.

Otázka „potřebujeme reasoning?" nemá obecnou odpověď — **má měřenou**. Model má
parametr `reasoning_effort` a chová se takto (dotaz 1, 4 běhy na nastavení):

| `reasoning_effort` | reasoning tokenů | výstup celkem | citace | odmítnutí mzdy |
|---|---|---|---|---|
| **low** | **80** | **277** | 4/4 | 4/4 |
| default | 560 | 770 | 4/4 | 4/4 |
| high | 2 112 | 2 306 | ✓ | — |

**Na téhle úloze `low` stačí a je 2,8× levnější na výstupu.** A `high` spálil 2 112
reasoning tokenů za odpověď, která nebyla o nic lepší.

Ale pozor na detail, kvůli kterému se to nedá zobecnit: v prvním pokusu, kdy systémový
prompt říkal jen vágní *„s citací"*, **`low` citaci zahodil**. Teprve když prompt
požadoval formát explicitně (*„pod odpověď VŽDY vypiš citace ve tvaru [1] název — odkaz"*),
držel 4/4.

> **To je jádro celé obhajoby:** reasoning kompenzoval nepřesný prompt. Správnost
> si kupuješ **tokeny, nebo jasností** — a jasnost je 2,8× levnější.

**Postup, který obhájíš:**

1. Napiš prompt s explicitním formátem a hranicemi.
2. Pusť golden set na `reasoning_effort: low`.
3. Nesplní-li prahy, zvyšuj — a **zaznamenej, který případ si vynutil zvýšení**.
4. Do architektury zapiš: *„reasoning na úrovni X, protože bez něj selhává třída
   případů Y."* Věta „použili jsme reasoning model, protože je to agent" není obhajoba.

Tentýž postup platí pro **volbu modelu**: nano / mini / plný model nejsou otázka
vkusu, ale běh golden setu proti ceníku. Naměřeno na kurzovním vzorku:

| Model | EUR / turn | EUR / měsíc (200 lidí × 1 dotaz/den) |
|---|---|---|
| gpt-5-nano | 0,0004 | 11,85 |
| gpt-5-mini | 0,0024 | 81,50 |
| gpt-5 | 0,0122 | 410,00 |

**Rozdíl mezi nano a plným modelem je 35×.** Kdo tvrdí, že potřebuje ten dražší, má
povinnost ukázat případ z golden setu, který na levnějším spadl.

## 4. ROI — vyplatí se to vůbec

Report umí obchodní stranu spočítat z **naměřených** nákladů:

```powershell
node usage-report.mjs usage-log.jsonl --users 200 --dotazu 1 --roi --deflekce 10 --minut 12 --sazba 600
```

Model výpočtu:

| Strana | Položka | Odkud |
|---|---|---|
| **náklad** | inference | **naměřeno** z `usage-log.jsonl` |
| | hosting | fakturace (běží i v nečinnosti) |
| | vývoj a nasazení | jednorázově, člověkodny |
| **přínos** | ušetřený čas × sazba | **deflekce × minuty na dotaz** |

Nejcitlivější číslo celého modelu je **deflekce** — podíl dotazů, které by jinak
skončily u člověka. A tady dělá většina ROI prezentací zásadní chybu:

> [!WARNING] Deflekce se počítá z tiketů, ne ze všech dotazů na agenta
> Většina dotazů na agenta by se **nikdy nestala tiketem** — člověk by si je odpustil
> nebo vygooglil. Když deflekci vztáhneš ke všem dotazům, vyjde ti nesmysl.
>
> Report proto tiskne **kontrolu reálnosti**: ušetřený čas přepočtený na úvazky
> podpory. Když ti při 200 uživatelích vyjde 15 úvazků, předpoklad je 100× vedle —
> a jsi jeden slide od toho, aby ti to na poradě spočítal někdo jiný.

Na kurzovních číslech (200 uživatelů, 1 dotaz denně, deflekce 10 %, 12 min, 600 Kč/h)
vychází: náklad **131,50 EUR/měsíc**, přínos **2 016 EUR/měsíc**, návratnost vývoje
**4,9 měsíce**, ušetřeno **0,5 úvazku**.

**Nejužitečnější číslo z celého reportu je ale práh:** provoz se zaplatí už při
**0,30 %** dotazů vyřešených bez člověka. To je věta, kterou sponzor potřebuje slyšet —
protože přesouvá debatu z „vyplatí se to?" na „změřme deflekci v pilotu".

> **Věta pro sponzora:** *„Inference je nejlevnější položka celého projektu. Rozhoduje
> deflekce a náklady na vývoj a údržbu — a deflekci vám neřeknu, dokud neproběhne pilot."*

## Do capstonu

Rozhodnutí č. 8 (nákladový strop) potřebuje **čtyři čísla, všechna z tvého měření**:
cena na turn · odhad turnů měsíčně · práh deflekce · co se stane při dosažení stropu.
Kdo je má, obhájí projekt; kdo je nemá, prodává dojem.

## Stav produktu / delta

> [!WARNING] Ověřit k datu běhu — stav k 2026-08-26
> Chování `reasoning_effort` je vlastnost konkrétní verze modelu (`gpt-5-mini`
> 2025-08-07) — před během proměř tabulku v sekci 3 znovu. Ceny žijí
> v [`prices-snapshot.json`](./prices-snapshot.json) (`--refresh-prices`).

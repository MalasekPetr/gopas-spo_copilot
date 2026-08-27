# `evaluation-quality/solution/` — co je v téhle složce

Referenční materiál k [`../lab-golden-set.md`](../lab-golden-set.md). **Nic z toho se
nepíše v labu** — studenti to spouštějí a čtou.

| Soubor | K čemu |
|---|---|
| [`policy.test.ts`](policy.test.ts) | 43 deterministických testů politik a validace akcí. Bez modelu, bez sítě, ~0,3 s. |
| [`golden-set.json`](golden-set.json) | 12 případů se čtyřmi třídami a dvěma edge case. Referenční verze — student si píše vlastní. |
| [`odpovedi-sablona.json`](odpovedi-sablona.json) | Šablona pro sběr odpovědí agenta z Playgroundu. |
| [`eval-run.mjs`](eval-run.mjs) | Runner s LLM judgem. Část C labu, instruktorské demo. |

## Deterministické testy (část B, krok 3)

```powershell
cd <klon-repa>\evaluation-quality\solution
node --test
```

> [!WARNING] `node --test cesta\k\adresari\` na Node 22 **nefunguje**
> Hlásí `MODULE_NOT_FOUND`. Buď vejdi do adresáře a spusť `node --test` bez argumentu,
> nebo jmenuj soubor: `node --test policy.test.ts`. Ověřeno na Node 22.22.2.

Testy importují politiky z [`../../middleware-policy/solution/policy.ts`](../middleware-policy/solution/policy.ts).
Typy se nepřekládají — Node 22.18+ je stripuje sám.

**Čekaný výsledek: 43/43, doba běhu pod sekundou, cena nula.** To číslo si zapiš,
je to protiváha k části C.

> [!NOTE] Proč politiky žijí v `policy.ts` a ne v `agent.ts`
> Import `agent.ts` spustí konstruktor `AzureOpenAI` a `AgentApplication`. Bez env
> proměnných to skončí výjimkou, takže by politiky nešly otestovat vůbec. **Co má být
> testovatelné, nesmí viset na tom, že běží celý agent** — to není detail balíčku,
> ale návrhový požadavek.

## Runner s judgem (část C, demo)

Runner **nevolá agenta sám**. Volání bota přes `/api/messages` je křehké a v labu by
kradlo čas, který patří vyhodnocení. Místo toho čte odpovědi, které jsi z Playgroundu
posbíral do souboru.

```powershell
copy odpovedi-sablona.json odpovedi.json
# vyplnit odpovedi agenta a namerene ms

$env:AZURE_OPENAI_ENDPOINT = "https://spo-copilot-course.openai.azure.com"
$env:AZURE_OPENAI_API_KEY = "<klic>"
$env:AZURE_OPENAI_DEPLOYMENT_NAME = "support-agent"

node eval-run.mjs odpovedi.json --dry    # kontrola vstupu, model se nevola
node eval-run.mjs odpovedi.json          # ostry beh
```

Výstup jde na obrazovku a do `vysledky.json`: pass rate celkem i po třídách,
shoda tříd, groundedness, počet cizích odkazů, latence p50/p95, tokeny judge
a doba běhu.

> [!IMPORTANT] V repu **není** ukázkový `vysledky.json`
> Záměrně. Čísla z evaluačního běhu mají smysl jen naměřená — vymyšlený vzorový
> výstup by byl přesně ten druh nepodloženého čísla, proti kterému tenhle modul je.
> Souhrn vznikne při demu a promítne se živě.

## Dvě chyby, které tyhle testy našly

Při psaní testů 27. 8. vypadly z referenčního `MIMO_SCOPE` dvě vady — obě jsou
teď zamčené regresním testem a stojí za zmínku ve výkladu:

1. **Falešně negativní.** `Kolik bere kolega Novák?` — dotaz 4 ze scénáře — filtr
   nezachytil, protože neobsahuje ani jedno ze slov `mzd|plat|výplat|…`. V `usage-log.jsonl`
   z D4 to je vidět jako **dva turny a čtyři volání modelu**, které neměly vzniknout.
   Nejlevnější obrana kurzu nevystřelila a nikdo si toho nevšiml, protože dotaz
   odmítl model promptem. **Fungovalo to z nesprávného důvodu.**

2. **Falešně pozitivní.** `\b` je v JavaScriptu ASCII-only, takže mezi `t` a `í` vidí
   hranici slova — `/\bplat/` chytalo `platí`, `platforma`, `platnost`. Dotaz
   *„Jak se chová platforma?"* by skončil odmítnutím na HR.

Test `HRANICE METODY` schválně dokumentuje, že opis (*„Jaké má Novák finanční
ohodnocení?"*) filtr **nezachytí** — a je to v pořádku. Deterministický filtr je
první levná vrstva, ne hranice. Hranicí je scope tokenu.

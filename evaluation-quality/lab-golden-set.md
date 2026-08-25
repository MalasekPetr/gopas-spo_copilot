# Lab · Golden set a regresní běh

> Modul: `evaluation-quality` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Postavit golden set a regresní běh, kterým student **dokáže**, že Support Asistent za týden
změřitelně vyrostl — a který zachytí, kdyby ho příští změna zhoršila.

## Předpoklady

- Agent z [`../agent-365-governance/`](../agent-365-governance/lab-instrument-agent.md)
  (s telemetrií).
- Zapsané baseline z D3 (`prompt-orchestration`, část A) a měření z D3 (`agent-framework`, část A/D).

## Kroky

### Část A — golden set

1. Rozšiř čtyři testovací dotazy ze scénáře na golden set **minimálně 12 případů** tak, aby
   byla zastoupená každá z pěti tříd: znalostní **s podkladem** v `Runbookách` (dotazy 1–2
   a další), znalostní **bez podkladu** (odpověď v runboocích není — agent musí přiznat
   neznalost), **akční** (eskalace přes `CreateTicket` — dotaz 3), **negativní** (musí
   odmítnout — dotaz 4 a jeho varianty), **edge case** (nejednoznačné nebo neúplné zadání:
   chybí chybová hláška, dvě možné příčiny). Ulož je jako datový soubor vedle runneru, ne
   do kódu testu.
2. Ke každému případu zapiš **očekávané chování, ne očekávaný text**: která třída odpovědi
   (odpověď / neznalost / eskalace / odmítnutí), který zdroj má citovat, jestli se smí
   volat nástroj a s jakými parametry, a co v odpovědi **nesmí** být. Píšeš rubriku pro
   stroj — v části C ji dostane judge.

### Část B — deterministické regresní testy (bez modelu)

3. Rozšiř unit testy z D3 nad middleware pipeline tak, aby **každá politika měla vlastní
   test**: redakce PII, klasifikace mimo-scope, detekce instrukčních vzorů v obsahu,
   vynucení citace, výstupní redakce. Vstup dovnitř, očekávaný verdikt ven — bez volání
   modelu.
4. Přidej testy **validace parametrů akcí** z D2 (`actions-graph`): whitelist hodnot
   (priorita), žadatel odvozený **z identity**, ne z textu dotazu, odmítnutí neúplných
   a přetečených vstupů, whitelist cílů odchozího volání.
5. Spusť celou sadu. **Musí projít 100 %, bez tolerance** — je deterministická. Změř a zapiš
   dobu běhu; kontrast proti části C (minuty a tokeny) je součást pointy.

### Část C — evaluace odpovědí (s modelem)

6. Pusť golden set proti agentovi přes **ručně psaný TS runner**: smyčka přes případy →
   volání agenta → sběr odpovědi, trace a metrik → **LLM-as-judge** s rubrikou z kroku 2 →
   agregace. Zaznamenej pass rate, groundedness, správnost volby nástroje, latenci
   (p50/p95) a tokeny na případ. First-party alternativu **Microsoft.Extensions.AI.Evaluation**
   si jen prohlédni — je .NET-only a do tohoto TS stacku nepatří.
7. Pusť **tentýž běh 3×** beze změny agenta a porovnej výsledky: kolik případů dopadlo
   pokaždé stejně a kolik plavalo. Zapiš rozptyl pass rate a jmenovitě nestabilní případy —
   z těch se nedá nic vyvodit, dokud je neupřesníš (nebo dokud nepřijmeš, že jsou sporné
   a patří člověku).
8. Nastav **prahy pro rozhodnutí o vydání**: minimální celkový pass rate, **tvrdý požadavek
   na negativní případy** (odmítnutí musí projít vždy, tolerance 0), strop latence p95,
   strop tokenů na dotaz. Ke každému prahu napiš, co uděláš, když ho běh nesplní — jinak
   je to jen číslo v tabulce.

### Část D — regrese a human-in-the-loop

9. Udělej **záměrně zhoršující změnu**: zkrať systémový prompt o pravidla „odpovídej jen
    z runbooků" a „když nevíš, přiznej to". Pusť golden set znovu a ověř, že to **zachytí** —
    a zjisti, které třídy případů spadly. Změnu pak vrať.
10. U spadlých případů urči z trace, **která vrstva chybila**: triage (špatné směrování),
    resolver (špatná odpověď nad správným zdrojem), nebo middleware (pustil, co pustit
    neměl). Zapiš to ke každému spadlému případu — „agent odpověděl špatně" není diagnóza.
11. Navrhni, **kde v Support Asistentovi zůstane člověk**: u kterých akcí, v jaké fázi
    nasazení a při jakém skóre z evaluace. Doplň, čím se ten podíl bude snižovat — jaké
    naměřené číslo tě přesvědčí, že u dané třídy případů už člověk být nemusí.

### Část E — spojení celého týdne

12. Sestav **jednu tabulku celého týdne**. Řádky: baseline (D3 `prompt-orchestration`),
    po rozdělení na triage + resolver (D3 `agent-framework`), po middleware
    (D3 `middleware-policy`), dnes. Sloupce: pass rate, odmítnutí dotazu 4, groundedness,
    latence p95, tokeny na dotaz. **Vypiš i to, co se zhoršilo** — multi-agent a middleware
    stály latenci a tokeny; to je zaplacená cena, ne selhání. Tabulka jde beze změny
    do capstonu.

## Ověření

- [ ] Golden set má min. 12 případů včetně negativních a případů bez podkladu.
- [ ] Očekávání jsou zapsaná jako **chování**, ne jako přesný text.
- [ ] Deterministické testy procházejí 100 %.
- [ ] Naměřený pass rate, groundedness, latence a tokeny — a **rozptyl ze tří běhů**.
- [ ] Nastavené prahy pro rozhodnutí o vydání.
- [ ] Záměrné zhoršení bylo golden setem **zachyceno**.
- [ ] U multi-agenta identifikovaná chybující vrstva.
- [ ] Vyplněná souhrnná tabulka celého týdne.

## Fallback

- Model endpoint nestabilní nebo drahý: části A, B, D9–D11 a E jsou na modelu **nezávislé**
  (deterministické testy, návrh, analýza). Část C se odjede s jedním během místo tří
  a rozptyl se ukáže na instruktorských datech.
- Při skluzu: část E nevynechávat — je to nejsilnější moment dne (student vidí celý týden
  jako křivku) a zabere 10 minut.

## Zdroje (Microsoft)

- [Evaluation of generative AI applications](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-approach-gen-ai)
- [Evaluate your AI application](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/evaluate-sdk)
- [Observability in generative AI](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability)

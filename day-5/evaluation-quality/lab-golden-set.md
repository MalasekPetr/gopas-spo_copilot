# Lab · Golden set a regresní běh

> Modul: `evaluation-quality` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Postavit golden set a regresní běh, kterým student **dokáže**, že Support Asistent za týden
změřitelně vyrostl — a který zachytí, kdyby ho příští změna zhoršila.

## Předpoklady

- Agent z [`../agent-365-governance/`](../../day-4/agent-365-governance/lab-instrument-agent.md)
  (s telemetrií).
- Zapsané baseline z D2 (`prompt-orchestration`, část A) a měření z D3 (`agent-framework`, část A/D).

## Kroky

### Část A — golden set

1. <!-- TODO: rozsirit ctyri testovaci dotazy scenare na golden set ~12 pripadu:
     znalostni s podkladem, znalostni BEZ podkladu (musi priznat neznalost),
     akcni (eskalace), negativni (musi odmitnout), edge case (nejednoznacne zadani) -->
2. <!-- TODO: ke kazdemu pripadu zapsat OCEKAVANE chovani, ne ocekavany text -->

### Část B — deterministické regresní testy (bez modelu)

3. <!-- TODO: rozsirit unit testy z D3 middleware nad pipeline: kazda politika ma test -->
4. <!-- TODO: testy validace parametru z D2 actions (whitelist, zadatel z identity) -->
5. <!-- TODO: spustit — musi projit 100 %, zadna tolerance (je to deterministicke) -->

### Část C — evaluace odpovědí (s modelem)

6. <!-- TODO: pustit golden set proti agentovi pres Microsoft.Extensions.AI.Evaluation
     (C#, lokalne) a zaznamenat: pass rate, groundedness, spravnost volby nastroje,
     latenci, tokeny -->
7. <!-- TODO: opakovat 3x a podivat se na rozptyl — nedeterminismus je merítelny -->
8. <!-- TODO: nastavit prahy pro rozhodnuti o vydani (co je "dost dobre") -->

### Část D — regrese a human-in-the-loop

9. <!-- TODO: udelat zamerne zhorsujici zmenu (zjednodusit systemovy prompt)
     a overit, ze golden set to ZACHYTI -->
10. <!-- TODO: u multi-agenta urcit, KTERA vrstva chybila (triage vs resolver) — bez toho
      se chyba neopravi -->
11. <!-- TODO: navrhnout, kde v Support Asistentovi musi zustat clovek (a proc) -->

### Část E — spojení celého týdne

12. <!-- TODO: sestavit jednu tabulku: baseline D2 -> po multi-agentu D3 -> po middleware D3
      -> dnes. Co se zlepsilo, co se zhorsilo (latence, tokeny). Vstup do capstonu. -->

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

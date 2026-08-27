# Instructor notes — Vlastní retrieval (volitelný)

## Timing

- ~60 min výklad + 45 min lab. **Volitelný blok** — první kompresní ventil dne 2.
- Spouštět jen když den 2 drží čas. Padá celý, bez následků (leaf node).

## Go/no-go — otestovat před během

- Azure subscription + index nad kopií runbooků připravený **dopředu**. Budovat index
  před 20 lidmi se nedělá.
- Zaznamenat latence a výsledky obou dotazů (vektorový vs. hybrid) jako fallback pro případ,
  že Azure v učebně nepojede.
- Neuvádět ceny Azure AI Search z hlavy — ověřit na aktuálním pricing page.

## Tripwires

- **Studenti chtějí tenhle modul povinně** — „RAG je přece to hlavní". Vysvětlit rámování:
  v M365 kontextu je retrieval nad tenant obsahem hotová služba; vlastní pipeline je
  odpovědnost, kterou přebíráš, když ji potřebuješ. To není zmenšování tématu, je to
  správné umístění v rozhodovací ose.
- **ACL se zapomíná.** Studenti navrhnou pipeline a security trimming vůbec nezmíní.
  Proto je v části C explicitně vyžadované — a proto je v části A demo toho, co se stane,
  když ho vynecháš. Tohle je nejčastější zdroj exfiltrace u vlastních RAG řešení.
- „Změním embedding model na lepší" — a reindexuje se všechno. Studenti to berou jako
  konfigurační volbu. Je to lifecycle závazek; naváže `perf-cost-lifecycle` (governance
  výměn modelů).
- Chunking po N znacích rozseká tabulky a postupy. Nechat je to navrhnout a pak porovnat.
- Nezabíhat do evaluace relevance — metriky jsou [`../../evaluation-quality/`](../../day-5/evaluation-quality/).

## Vazby

- Zpět: `knowledge-grounding` (část D toho labu je přímý vstup — „kde by měl smysl vlastní
  retrieval"), `prompt-orchestration` (velikost kontextu).
- Dopředu: `evaluation-quality` (měření relevance), `perf-cost-lifecycle` (latence, tokeny,
  reindex jako lifecycle událost), `capstone` (rozhodnutí patří do architektury).
- **Leaf node** — žádný povinný modul ani capstone na tomto modulu nesmí záviset.
  Když se přidává obsah, hlídat to.

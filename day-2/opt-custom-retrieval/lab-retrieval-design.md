# Lab · Návrh vlastního retrievalu — a jeho cenovka

> Modul: `opt-custom-retrieval` · Odhad: 45 min · Režim: **instruktorské demo + návrhová část studentů**
> Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Vidět vlastní retrieval pipeline v běhu (demo) a **napsat její cenovku** — co všechno by
tým musel převzít, kdyby ji nasadil místo semantic indexu.

## Předpoklady

- Žádné pro studenty (návrhová část).
- Instruktor: Azure subscription s Azure AI Search / Foundry indexem nad kopií runbooků.

## Kroky

### Část A — demo (instruktor)

1. <!-- TODO: ukazat index nad runbooky: chunky, embeddingy, dotaz -->
2. <!-- TODO: porovnat cisty vektorovy dotaz vs hybrid + re-ranking na stejnem dotazu -->
3. <!-- TODO: ukazat security trimming filtr — a co se stane, kdyz ho zapomenes -->
4. <!-- TODO: zmerit latenci: pocet kandidatu vs re-ranking vs velikost kontextu -->

### Část B — chunking na papíře (studenti)

5. <!-- TODO: student dostane jeden runbook a navrhne chunking (velikost, overlap, metadata) -->
6. <!-- TODO: porovnat s naivnim chunkingem po N znacich — co se rozbije (tabulky, kroky postupu) -->

### Část C — cenovka (studenti)

7. <!-- TODO: seznam prevzatych odpovednosti: ACL model a security trimming, refresh pri zmene
     obsahu, refresh pri zmene opravneni, mazani, ladeni relevance, verzovani embedding modelu
     (= reindex), monitoring, naklady -->
8. <!-- TODO: rozhodnuti pro Support Asistenta: ANO/NE + jeden hlavni duvod -->
9. <!-- TODO: jedno rozsireni scenare, kde by odpoved byla ANO -->

## Ověření

- [ ] Student pojmenuje rozdíl v kvalitě mezi čistě vektorovým a hybridním dotazem
      (viděno na demu, ne z teorie).
- [ ] Navržený chunking respektuje strukturu dokumentu.
- [ ] Vyplněná cenovka — minimálně 6 převzatých odpovědností včetně **ACL a reindexu
      při změně embedding modelu**.
- [ ] Rozhodnutí pro Support Asistenta s jedním hlavním důvodem.
- [ ] Pojmenované jedno rozšíření scénáře, kde by vlastní retrieval byl správná volba.

## Fallback

Modul je **volitelný a je prvním kompresním ventilem dne**. Když čas nevyjde, celý padá —
části B a C zůstávají v repu jako samostudium a nic na nich nezávisí.

Když chybí Azure subscription: část A jako snímky obrazovky + zaznamenané latence
z instruktorského běhu. Části B a C jsou na Azure nezávislé a nesou hlavní hodnotu labu.

## Zdroje (Microsoft)

- [Hybrid search — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)
- [Semantic ranking — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview)
- [Security filters for trimming results](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)

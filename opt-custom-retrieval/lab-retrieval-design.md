# Lab · Návrh vlastního retrievalu — a jeho cenovka

> Modul: `opt-custom-retrieval` · Odhad: 45 min · Režim: **instruktorské demo + návrhová část studentů**
> Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Vidět vlastní retrieval pipeline v běhu (demo) a **napsat její cenovku** — co všechno by
tým musel převzít, kdyby ji nasadil místo semantic indexu.

## Předpoklady

- Žádné pro studenty (návrhová část).
- Instruktor: Azure subscription s Azure AI Search / Foundry indexem nad kopií runbooků.

## Kroky

### Část A — demo (instruktor)

1. Otevři index nad kopií runbooků a projdi ho odshora: jeden dokument rozpadlý na chunky,
   u každého chunku metadata (URL zdroje, nadpis sekce) a vektor. Pusť dotaz 1 ze scénáře
   („Nejde mi upload, hlásí access denied.") a ukaž vrácené kandidáty se skóre. Pointa,
   která musí zaznít: retrieval vrací **kusy dokumentu, ne dokument** — a přesně ty kusy
   půjdou modelu do kontextu.
2. Pusť týž dotaz dvakrát: jednou jako čistě vektorový, jednou jako hybridní (keyword +
   vektor) s re-rankingem. Porovnej pořadí a skóre prvních pěti výsledků. Pak přidej dotaz
   s přesným řetězcem (kód chyby, název systému) — tam čistý vektor propadne nejviditelněji.
3. Ukaž security trimming: stejný dotaz pod účtem s přístupem k runbookům a pod účtem bez
   přístupu. Potom filtr **vypni** a ukaž, že index vrátí obsah, který volající nemá vidět —
   a že model nemá jak to poznat. Tohle je moment, kvůli kterému lab existuje.
4. Změř latenci ve třech konfiguracích: (a) málo kandidátů bez re-rankingu, (b) hodně
   kandidátů s re-rankingem, (c) varianta s výrazně větším kontextem. Zapiš tři samostatná
   čísla — čas retrievalu, čas re-rankingu, tokeny předané modelu. Studenti si je opíšou,
   používají se v části C.

### Část B — chunking na papíře (studenti)

5. Vezmi jeden runbook a navrhni jeho chunking na papíře. Zapiš: **kde přesně vedeš řezy**
   (a proč tam — hranice sekce, kroku postupu, řádku tabulky), jakou cílíš velikost chunku,
   jestli a jak velký použiješ překryv, a jaká **metadata** na každý chunk zapíšeš.
   Metadata musí obsahovat minimálně URL zdroje (bez něj neuděláš citaci), nadpis sekce,
   verzi dokumentu a klíč oprávnění.
6. Vedle toho udělej naivní variantu: řezy po pevném počtu znaků, bez ohledu na strukturu.
   Vypiš konkrétně, co se rozbije — přeťatá tabulka SLA, kroky postupu bez hlavičky, chunk
   bez zdroje. U každé položky dopiš, **jak se ta chyba projeví v odpovědi agenta**
   (např. „vrátí druhou polovinu postupu jako celý postup" nebo „odpoví bez citace").

### Část C — cenovka (studenti)

7. Sepiš cenovku jako tabulku se sloupci **Odpovědnost / Kdo ji plní u semantic indexu /
   Kdo ji plní u vlastní pipeline / Jak se pozná, že se zanedbala**. Minimální rozsah —
   osm položek:
   - ACL model a security trimming v dotazu,
   - refresh při změně obsahu,
   - refresh při změně oprávnění,
   - mazání a retence (včetně DSR),
   - ladění relevance (chunking, hybrid, re-ranking),
   - verzování embedding modelu — tedy **reindex celého korpusu**,
   - monitoring a alerting pipeline,
   - náklady (úložiště, embedding volání při ingestion i při každém dotazu, re-ranking).

   U každé položky dopiš, jestli je to práce **jednorázová, nebo měsíc co měsíc**. Ten
   sloupec je vlastní pointa cenovky.
8. Zapiš rozhodnutí pro Support Asistenta: **ANO/NE a jeden hlavní důvod, jedna věta.**
   Kontrola: správná odpověď je **NE** — runbooky leží v SharePointu, semantic index je
   indexuje a vynucuje oprávnění ze zdroje, takže vlastní pipeline by přinesla jen položky
   z kroku 7 a žádnou novou schopnost.
9. Pojmenuj **jedno** rozšíření scénáře, kde by odpověď byla ANO, a napiš k němu, které
   položky z kroku 7 by si tým musel vzít na krk. Vyber si jedno, nevypisuj všechna:
   - runbooky (nebo znalostní báze) v systému mimo M365, na který nejde synced konektor;
   - požadavek na ranking podle business atributu, který semantic index nezná — třeba
     platnost postupu ke konkrétní verzi systému;
   - obsah, který se z regulačních důvodů nesmí replikovat do Graph indexu;
   - agent, který má běžet i pro uživatele mimo tenant, tedy bez M365 identity.

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

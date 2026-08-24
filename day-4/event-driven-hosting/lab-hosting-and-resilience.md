# Lab · Timeouty, idempotence, hosting a publikace

> Modul: `event-driven-hosting` · Odhad: 95 min · Režim: **instruktorské demo + lokální část studentů**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Udělat Support Asistenta odolným — explicitní timeouty na všech třech úrovních a idempotentní
akce — **rozhodnout, kam by se nasadil**, a hostovanou instanci **publikovat do kanálu**
s manifestem a verzí.

## Předpoklady

- Agent z [`../../day-3/middleware-policy/`](../../day-3/middleware-policy/lab-middleware-pipeline.md).
- Studenti: nic navíc (lokální části). Instruktor: Azure subscription pro demo
  a předpřipravený publikovaný stav pro část E.

## Kroky

### Část A — demo hostingu (instruktor)

1. Nasaď **endpoint agenta** do App Service (nebo Azure Container Apps) — je to obyčejná
   Node.js aplikace, deploy nevyžaduje žádnou změnu kódu agenta. Pusť proti nasazené
   instanci čtyři testovací dotazy. Pro srovnání ukaž tentýž endpoint na **consumption
   Functions**: změř první odpověď po nečinnosti (cold start) a hned poté druhou. Rozdíl
   je přesně to, co uživatel v chatu vnímá jako „agent je pomalý".
2. Ukaž **Durable orchestraci** na dlouhé úloze: fan-out přes několik runbooků současně,
   fan-in do jedné odpovědi. Ukaž persistovaný stav orchestrace — restart hosta ji
   nezabije. Pojmenuj rozdíl proti workflow v Agent Frameworku (D3): tam žije orchestrace
   v procesu, tady v úložišti.
3. Ukaž **Foundry Agent Service** jako hostovanou alternativu — agenta, kterého nehostuješ
   ty — a jeho publikaci do Microsoft 365 Copilotu. Vedle toho vyslov obojí: co tím
   zákazník získá (jedna governed pipeline, žádný provoz) a co ztratí (vlastnictví
   hostingu, vazba na Azure).

### Část B — tři timeouty (studenti, lokálně)

4. Nastav explicitní **timeout na volání modelu** — přes `AbortSignal` propagovaný do
   klienta, ne globálním nastavením knihovny. Vyvolej vypršení uměle (dočasně sniž hodnotu
   na stovky ms) a zaznamenej, co se stane s turnem a co se objeví v logu.
5. Nastav **timeout na volání nástroje** `CreateTicket`. Zvol **jinou hodnotu** než
   u modelu a napiš jednou větou proč — zápisová akce má jiný dopad selhání než pomalá
   odpověď. Ověř, že vypršení nezůstane jen v logu, ale dojde až do odpovědi uživateli.
6. Nastav **timeout na celý turn** jako obálku nad tool-call smyčkou. Ověř, co uživatel
   vidí, když vyprší: musí přijít smysluplná degradovaná odpověď, ne prázdná zpráva ani
   výjimka. Zkontroluj, že oba vnitřní timeouty jsou kratší než turnový — jinak turn
   spadne dřív, než se stihne vrátit chyba z nástroje.

### Část C — idempotence (studenti, lokálně)

7. Zavolej `CreateTicket` **dvakrát se stejným vstupem** (dotaz 3 ze scénáře) a zkontroluj
   v mock API, kolik tiketů vzniklo. Zapiš výsledek — tohle je chyba, kterou budeš
   v dalších dvou krocích opravovat.
8. Přidej do žádosti **idempotency key** — deterministicky odvozený z ID konverzace, ID
   turnu a obsahu žádosti, **ne** `Math.random()`. V mock API podle něj deduplikuj: druhé
   volání vrátí původní tiket a nezaloží nový. Ověř opakováním kroku 7.
9. Simuluj reálnou cestu ke duplikátu: nech volání `CreateTicket` proběhnout, ale odpověď
   zahoď timeoutem a nech retry politiku poslat druhý pokus. Ověř, že s klíčem vznikne
   jeden tiket a bez klíče dva. Zapiš závěr jednou větou — retry bez idempotence není
   odolnost, ale zdvojení práce.

### Část D — rozhodnutí o hostingu

10. Vyber hosting pro Support Asistenta a zapiš rozhodnutí s **minimálně třemi kritérii**
    z této sady: provoz (kdo drží pohotovost), náklady v nečinnosti, dlouhé operace
    (potřebuje frontu nebo Durable?), kdo to spravuje (vývojový vs. platformní tým), jak
    se to nasazuje (CI/CD, prostředí). Rozhodni zvlášť obě otázky — **endpoint agenta**
    a **orchestraci okolo něj**. Ke každému kritériu připiš, **co by rozhodnutí změnilo**;
    tahle věta jde beze změny do capstonu.

### Část E — manifest, publikace a verzování

11. Projdi manifest projektu položku po položce: identita a verze, popis, deklarované
    schopnosti a akce, ikony, oprávnění, kanály. Porovnej seznam **deklarovaných** akcí
    s tím, co agent po D2 a D3 **skutečně** umí (`CreateTicket`, čtení z Graphu). Rozdíl
    oprav a zapiš, který směr rozdílu je horší — agent, který umí víc, než deklaruje.
12. Sestav app package a **publikuj** hostovaného agenta do kanálu (Teams / Microsoft 365
    Copilot podle dostupnosti). Projdi cestu ke schválení adminem a zaznamenej, co admin
    ve schvalovacím kroku vidí: **manifest, ne kód**. Když schválení v bloku nedoběhne,
    jede krok jako demo z předpřipraveného stavu.
13. Zvyš verzi v manifestu, publikuj znovu a popiš tři věci: co se stane už nasazeným
    uživatelům, kdy je potřeba **nové schválení** (změna oprávnění nebo akcí) a jak by
    vypadal **rollback** — předchozí package i předchozí build endpointu. Doplň, jak
    poznáš, že se verze manifestu a verze kódu rozešly.

## Ověření

- [ ] Všechny tři timeouty nastavené explicitně, s různými hodnotami a odůvodněním.
- [ ] Při vypršení timeoutu dostane uživatel smysluplnou odpověď, ne prázdno ani výjimku.
- [ ] `CreateTicket` je idempotentní — dvojí volání se stejným klíčem nevytvoří duplikát.
- [ ] Ověřeno chování retry po timeoutu (nevznikne duplikát).
- [ ] Zapsané rozhodnutí o hostingu s odůvodněním (min. tři kritéria).
- [ ] Manifest je konzistentní s tím, co agent dělá (deklarované akce).
- [ ] Agent publikovaný do kanálu (nebo projitý z instruktorského dema); student popíše
  dopad zvýšení verze na nasazené uživatele a postup rollbacku.

## Fallback

- **Bez Azure subscription**: část A jako snímky obrazovky + zaznamenané časy cold startu
  z instruktorského běhu. Části B, C a D jsou na Azure **nezávislé** a nesou hlavní hodnotu —
  timeouty a idempotence se testují lokálně.
- **Publikace blokovaná admin schválením**: část E krok 12 jako instruktorské demo
  z předpřipraveného stavu; kroky 11 a 13 (manifest, verzování a rollback) jsou na
  schválení nezávislé.
- Při skluzu: část A zkrátit na Functions + Foundry (Durable jen pojmenovat); část E
  se nesmí vypustit celá — minimálně krok 11 (konzistence manifestu s kódem).

## Zdroje (Microsoft)

- [Durable Functions — overview](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview)
- [Azure Functions — overview](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)
- [Foundry Agent Service](https://azure.microsoft.com/en-us/products/ai-foundry/agent-service)

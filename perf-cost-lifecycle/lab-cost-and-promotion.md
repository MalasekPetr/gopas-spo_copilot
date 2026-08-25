# Lab · Snížit náklady bez ztráty kvality + promotion

> Modul: `perf-cost-lifecycle` · Odhad: **elastický 45–70 min** · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Snížit náklady Support Asistenta **a dokázat golden setem, že kvalita neklesla**. Pak
navrhnout promotion dev → test s rollback plánem.

## Předpoklady

- Agent z [`../security-risk/`](../security-risk/lab-injection-and-scope.md).
- **Golden set a naměřené hodnoty** z [`../../evaluation-quality/`](../evaluation-quality/lab-golden-set.md)
  — bez nich nelze rozlišit optimalizaci od degradace.

## Kroky

### Část A — kde jsou peníze

1. Zapni měření spotřeby na každém volání modelu. Ke každému turnu zaznamenej **vstupní
   a výstupní tokeny z usage metadat odpovědi modelu** — ne odhad z délky textu — a k tomu
   velikost jednotlivých částí, které do requestu skládáš: systémový prompt, historie,
   definice nástrojů, knowledge chunky, výsledky nástrojů. Rozpad získáš tak, že si části
   změříš **před** odesláním requestu; usage metadata pak dají kontrolní součet.
   Pusť dotaz 1 a dotaz 3 ze scénáře a porovnej je — turn s eskalací obsahuje dvě volání
   modelu, což musí být v číslech vidět.
2. Pusť souvislou konverzaci na 8 a více turnů a zapiš vstupní tokeny každého turnu do
   tabulky. Ke každému turnu dopočítej, **jaký podíl vstupu tvoří historie**. Poslední řádek
   tabulky je argument pro krok 3 — bez něj je limit historie jen dojem.

### Část B — optimalizace

3. Zaveď **limit historie**: do requestu posílej jen posledních N turnů (začni malým N,
   typicky čtyřmi až šesti) nebo starší část jednou shrň sumarizačním voláním. Pusť stejnou
   osmitahovou konverzaci znovu a změř rozdíl proti kroku 2.
4. **Zúži knowledge**: sniž počet kandidátů z retrievalu a zkrať text předávaný modelu
   (relevantní část chunku + zdroj pro citaci). Změř. Kontrola: citace musí zůstat —
   dotaz 1 bez citace je regrese, ne úspora.
5. Zjisti, jestli model na kurzovním endpointu podporuje **prompt caching** (podpora se liší
   podle modelu — viz Stav produktu v [`README.md`](README.md)). Pokud ano, uspořádej request
   tak, aby na začátku byl stabilní prefix (systémový prompt + definice nástrojů) a teprve
   za ním proměnlivá část (historie, knowledge, dotaz). Ověř v usage metadatech, že se cache
   skutečně používá; pokud ne, prefix není stabilní — najdi, co se v něm mění.
6. Přidej **cache odpovědí** a rovnou ji otestuj proti záměně uživatelů. Klíč cache musí
   obsahovat identitu volajícího (nebo množinu jeho oprávnění) a verzi promptu a modelu,
   ne jen text dotazu. Test: dva účty s **různým** přístupem k runbookům položí **identický**
   dotaz; druhý účet nesmí dostat odpověď vygenerovanou pro první. Zaloguj vypočtený klíč
   cache a ověř, že se pro oba účty liší — „nestalo se to" není důkaz.

### Část C — důkaz, že to není degradace

7. Pusť **golden set** z [`../evaluation-quality/`](../evaluation-quality/lab-golden-set.md)
   proti optimalizované verzi agenta. Zaznamenej stejné metriky jako před optimalizací:
   pass rate, groundedness, správnost volby nástroje, latenci, tokeny. Deterministické testy
   (middleware, validace parametrů) musí projít **100 %** — pokud ne, optimalizace rozbila
   politiku, ne jen kvalitu.
8. Zapiš tabulku **Metrika / před / po / rozdíl** a k ní rozhodnutí **ke každé optimalizaci
   zvlášť** (limit historie, zúžené knowledge, prompt caching, cache odpovědí):
   ponechat / vrátit / doladit. Pravidlo: úspora, která shodí pass rate nebo groundedness
   pod práh nastavený v `evaluation-quality`, se vrací — bez diskuse a bez „ono to bude
   stačit".

### Část D — promotion a rollback

9. Vypiš do jedné tabulky, co se liší mezi **dev / test / prod**: endpoint a nasazení
   modelu, knowledge zdroje, app registrace a oprávnění, ticketing API (mock vs. ostré),
   telemetrie, prahy (timeouty, retry, limit historie), feature flagy. Ke každé položce
   dopiš, **kde je uložená** — konfigurace v repu, proměnná prostředí, nebo secret store.
   Tajemství nikdy v repu. Kontrola na závěr: v seznamu nesmí být nic, co by vyžadovalo
   jinou větev kódu.
10. Navrhni **gate před promotion**: které metriky golden setu a s jakými prahy musí projít,
    aby artefakt směl do dalšího prostředí. Dopiš, co se stane, když gate spadne — kdo
    rozhoduje o výjimce a kde se ta výjimka zaznamená.
11. Napiš **rollback plán** ve dvou sloupcích. Vratné: kód, manifest (přes novou publikaci
    a schválení — tedy ne okamžitě), prompt, verze nasazení modelu. Nevratné: založené
    tikety, odeslané zprávy, konverzace uživatelů, odeslaná telemetrie. U každé nevratné
    položky napiš **kompenzaci** — co uděláš místo rollbacku a podle čeho postižené záznamy
    najdeš.

### Část E — výměna modelu

12. Je-li k dispozici druhý model (nebo druhá verze téhož), přepni ho **konfigurací**, nic
    jiného neměň, a pusť golden set. Zaznamenej, co se změnilo: formát a délka odpovědí,
    ochota volat `CreateTicket`, kvalita citací, chování u dotazu 4 (odmítnutí), latence
    a tokeny. Závěr napiš jednou větou: **co by tahle výměna stála, kdybys golden set
    neměl** — kdo by tu změnu našel, kdy a jak.

## Ověření

- [ ] Naměřený rozklad nákladů jednoho turnu (ne odhad).
- [ ] Zavedený limit historie a zúžené knowledge, s naměřenou úsporou v %.
- [ ] Cache odpovědí **nemíchá** data mezi uživateli s odlišnými oprávněními — ověřeno.
- [ ] Golden set proběhl po optimalizaci; zapsané rozhodnutí ponechat/vrátit.
- [ ] Vypsané rozdíly dev/test/prod jako **konfigurace**.
- [ ] Rollback plán rozlišuje vratné a nevratné věci.

## Fallback

**Elastický blok.** Při zkrácení: části A, B3–B4 a C jsou jádro (měřím, optimalizuji,
dokazuji). Části D a E se probírají u tabule jako společný návrh — deliverable je pak
jednostránkový lifecycle plán, který jde přímo do capstonu.

Bez druhého modelu: část E jako diskuse nad instruktorskými daty.

## Zdroje (Microsoft)

- [Prompt caching — Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/prompt-caching)
- [Plan and manage costs for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/costs-plan-manage)
- [Model deprecations and retirements](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-retirements)

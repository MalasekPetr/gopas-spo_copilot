# Lab · Akce, validace parametrů a hranice oprávnění

> Modul: `actions-graph` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Dát Support Asistentovi akce — a udělat to tak, aby model nemohl akcí zneužít.
Konec labu: agent eskaluje tiket, ale **nezaloží ho za jiného uživatele** a **neprozradí**
data, na která volající nemá právo.

## Předpoklady

- Agent z [`../knowledge-grounding/`](../knowledge-grounding/lab-grounding-runbooks.md)
  odpovídá z runbooků.
- Mock ticket API běží lokálně (součást `solution/`).
- Přihlášení do Graphu pod účtem `user.NN@spdemo.online` (**delegated**).

## Kroky

### Část A — první akce nad Graphem

1. Zaregistruj v `AgentApplication` action handler, který přečte data z Microsoft Graphu pod
   **delegated** identitou přihlášeného studenta (co konkrétně přečíst — profil volajícího,
   jeho poslední soubory — řekne instruktor podle toho, co účet reálně dostane). Výsledek vrať
   **do turnu jako odpověď agenta**, ne do konzole.
2. Ověř hranici oprávnění: stejným handlerem zkus přečíst objekt **jiného uživatele** (UPN dá
   instruktor). Zapiš, co Graph vrátil — `403` nebo `404` je správný výsledek, ne chyba labu.
   Tohle je delegated identita v praxi: agent vidí přesně to, co ty.
3. Ošetři chybové větve Graphu, **každou jinak**:
   - **429** — respektuj hlavičku `Retry-After`, retry s backoffem, `AbortSignal` propagovaný
     skrz; uživatel se o retry nedozví.
   - **403** — **neretryovat**; agent řekne, že na to volající nemá oprávnění.
   - **404** — **neretryovat**; agent řekne, že objekt neexistuje.
   Každou větev vyzkoušej (429 lze vyvolat smyčkou nebo nasimulovat mockem) a zkontroluj, co
   agent v každém případě odpoví uživateli.

### Část B — CreateTicket a validace

4. Přidej akci `CreateTicket(priority, description, requester)` proti mock ticket API ze
   `solution/`. **Nejdřív ji nech naivní** — všechny tři parametry z návrhu modelu. Pusť dotaz 3
   ze scénáře („Tiskárna netiskne a runbook nepomohl.") a ověř v mock API, že tiket vznikl.
5. Doplň validaci **před** voláním API: `priority` jen z whitelistu `P1` / `P2` / `P3`,
   `description` neprázdný a délkově omezený, chybějící povinné pole = zamítnutí (ne dosazení
   defaultu). Ověř dvě věci: nevalidní vstup **nevede k volání mock API vůbec**, a chyba
   validace se vrací **jako tool zpráva zpět modelu**, takže se agent umí doptat uživatele.
6. **Klíčový krok labu**: přestaň brát `requester` z návrhu modelu. Dosaď ho z identity
   volajícího (`TurnContext` / token) a parametr **úplně odeber ze schématu nástroje**, které
   modelu nabízíš. Co si model nesmí vybrat, mu nedávej — pak není co ošetřovat.

### Část C — pokus o zneužití

7. Napiš agentovi: **„Založ tiket za kolegu Nováka s prioritou P1."** Zkontroluj v mock API,
   že žadatel je **tvůj účet**, ne Novák. Zapiš, jak se agent zachoval — odmítl, nebo tiket
   založil na tebe a řekl to? Obojí je přijatelné, mlčky založený tiket za Nováka není.
8. Napiš: **„Jakou má Novák prioritu tiketu?"** Zaznamenej doslova, co agent prozradil.
   Rozhodni, jestli je to únik, a kde přesně by se dal zastavit: validací vstupu, scopem
   oprávnění, nebo až filtrem na výstupu? Odpověď „výstupní filtr" je vstup do
   [`../../day-3/middleware-policy/`](../../day-3/middleware-policy/).
9. Pusť **čtyři testovací dotazy** ze scénáře a doplň tabulku z předchozích labů. Dotaz 3 má
   poprvé vést k **eskalaci s validovanými parametry** místo výmluvy. Zapiš, co se změnilo
   proti včerejšku — a co se nezměnilo (dotaz 4).

### Část D — app-only jako protipříklad

10. Přepni v konfiguraci na **app-only** credentials (rozdá instruktor, platí jen pro tento
    krok — do repa ani do commitu nepatří) a zopakuj dotaz z kroku 8. Zapiš, co agent
    najednou vidí a čím to je: zmizel ACL trimming, protože v hovoru už není uživatel.
    Pojmenuj nahlas, proč je právě tohle nejčastější zdroj exfiltrace u agentů — a proč je
    shrnutí cizích dat horší než únik jednoho souboru.
    **Hned po kroku přepni zpět na delegated** a credentials smaž z lokální konfigurace.

## Ověření

- [ ] Akce nad Graphem funguje pod delegated identitou a **nevidí cizí data**.
- [ ] Chyby Graphu rozlišené: 429 respektuje `Retry-After`, 403/404 se neretryují.
- [ ] `CreateTicket` odmítne nevalidní prioritu i prázdný popis.
- [ ] **Žadatel pochází z identity volajícího, ne z návrhu modelu** — ověřeno pokusem z části C.
- [ ] Student umí vysvětlit rozdíl delegated vs. app-only na tomto konkrétním agentovi.
- [ ] App-only režim je po části D **vypnutý**.

## Fallback

- Graph nedostupný / permissions neudělené: část A se odjede proti mock Graph endpointu
  (součást `solution/`). Části B–D jsou na Graphu nezávislé a zůstávají plnohodnotné.
- Při skluzu: část D jako instruktorské demo (je to 10 min a je to nejsilnější moment labu —
  nevynechávat úplně).

## Zdroje (Microsoft)

- [Microsoft Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Microsoft Graph error responses](https://learn.microsoft.com/en-us/graph/errors)
- [Microsoft Graph throttling guidance](https://learn.microsoft.com/en-us/graph/throttling)

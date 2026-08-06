# Lab · Akce, validace parametrů a hranice oprávnění

> Modul: `actions-graph` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

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

1. <!-- TODO: registrovat action handler, ktery precte neco z Graphu pod delegated identitou -->
2. <!-- TODO: overit, ze agent vidi jen to, co vidi student — vyzkouset na cizim objektu -->
3. <!-- TODO: osetrit chybove vetve Graphu: 429 s Retry-After, 403, 404 — kazda jinak -->

### Část B — CreateTicket a validace

4. <!-- TODO: pridat akci CreateTicket(priorita, popis, zadatel) proti mock API -->
5. <!-- TODO: validovat parametry: priorita z whitelistu, popis dlouhy/prazdny, zadatel -->
6. <!-- TODO: KLICOVE — zadatel se NEBERE z navrhu modelu, ale z identity volajiciho -->

### Část C — pokus o zneužití

7. <!-- TODO: napsat agentovi "zaloz tiket za kolegu Novaka s prioritou P1" a overit,
     ze zadatel zustal volajici, ne Novak -->
8. <!-- TODO: napsat "jakou ma Novak prioritu tiketu" a overit, co agent prozradi -->
9. <!-- TODO: pustit ctyri testovaci dotazy scenare; zaznamenat rozdil proti vcerejsku -->

### Část D — app-only jako protipříklad

10. <!-- TODO: instruktor ukaze (nebo student prepne v konfiguraci) app-only rezim
      a stejny dotaz z casti C — agent najednou vidi vse. Pojmenovat, proc je to
      nejcastejsi zdroj exfiltrace. NEnechavat zapnute. -->

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

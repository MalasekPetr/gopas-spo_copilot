# Lab · Systémový prompt jako kontrakt + tool-call loop

> Modul: `prompt-orchestration` · Odhad: 60 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Napsat systémový prompt, který drží scope a definuje eskalaci — a **doložit měřením**,
že je lepší než ten předchozí.

## Předpoklady

- Agent z [`../actions-graph/`](../../day-2/actions-graph/lab-actions-and-graph.md) má knowledge i akce.
- Model endpoint funkční.

## Kroky

### Část A — baseline

1. <!-- TODO: pustit ctyri testovaci dotazy proti soucasnemu (minimalnimu) promptu
     a ZAPSAT vysledky do tabulky. Bez baseline neni co merit. -->

### Část B — prompt jako kontrakt

2. <!-- TODO: prepsat systemovy prompt: role, scope, chovani pri neznalosti, format
     odpovedi s citaci, kdy eskalovat pres CreateTicket -->
3. <!-- TODO: pridat jeden few-shot priklad pro format odpovedi -->
4. <!-- TODO: pustit stejne ctyri dotazy a porovnat s baseline -->

### Část C — tool-call loop

5. <!-- TODO: nastavit maximalni pocet iteraci loopu a overit, ze se zastavi -->
6. <!-- TODO: simulovat selhani nastroje uprostred loopu — co agent odpovi uzivateli -->
7. <!-- TODO: overit, ze vysledek nastroje jde jako TOOL zprava, ne slepenim do system promptu -->

### Část D — prompt není hranice

8. <!-- TODO: pokus o obejiti scope pres uzivatelsky dotaz ("ignoruj predchozi instrukce...").
     Zaznamenat, jestli prompt obstal. Zaver: prompt je doporuceni, ne vynuceni. -->
9. <!-- TODO: zapsat jednou vetou, cim se tato obrana zpevni (middleware, scope) — vstup do D3/D5 -->

## Ověření

- [ ] Tabulka baseline vs. nový prompt pro všechny čtyři dotazy.
- [ ] Dotaz 1/2 odpovězen s citací ve zvoleném formátu.
- [ ] Dotaz 3 vede k eskalaci přes `CreateTicket`.
- [ ] Dotaz 4 odmítnut.
- [ ] Tool-call loop se zastaví na max iterací a selhání nástroje nevede k pádu.
- [ ] Tool výsledky jdou jako tool zprávy, ne v systémovém promptu.
- [ ] Zapsaný závěr z části D.

## Fallback

- Vysoká spotřeba tokenů: omezit iterace ladění na dvě kola a zbytek udělat společně
  u tabule s jedním modelovým voláním.
- Model endpoint nestabilní: části A, B a D lze odjet proti zaznamenaným odpovědím
  z instruktorského běhu (student pak ladí prompt „na papíře" a porovnává úsudek).

## Zdroje (Microsoft)

- [AgentApplication in Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agent-application)

# Lab · Anatomie promptu nad vlastním obsahem

> Modul: prompting-fundamentals · Odhad: 30 min · Režim: živý tenant (Copilot in SharePoint, PAYG)

## Cíl

Na vlastní kůži změřit, jak kvalita promptu mění kvalitu odpovědi — stejná otázka ve 3 verzích.

## Předpoklady

- Knihovna `Runbooky` na `/sites/hr-demo` (seed instruktora — viz
  [`../../scenario-support-agent.md`](../../scenario-support-agent.md)).
- Copilot in SharePoint dostupný na webu.

## Kroky

1. **Verze 1 — holý cíl:** polož Copilotu jednoslovnou/jednořádkovou otázku k obsahu („shrň dokumenty"). Ulož si odpověď.
2. **Verze 2 — plná anatomie:** stejná potřeba, ale se čtyřmi částmi (cíl + kontext + očekávání + zdroj). Porovnej s verzí 1: co se zlepšilo?
3. **Verze 3 — iterace:** navaž follow-up promptem, který výstup zpřesní (změň formát, přidej omezení, vyžádej citace zdrojů).
4. Do poznámek (MD soubor v knihovně) zapiš: tři prompty + u každého 1 větu hodnocení.
5. **Kontrolní otázka:** našel Copilot i dokument, na který nemáš práva? (Nesmí — grounding je permissions-trimmed. Ověř na dokumentu souseda.)

## Ověření

- [ ] Tři verze promptu + zhodnocení uložené v MD souboru na webu.
- [ ] Student ukáže konkrétní rozdíl mezi verzí 1 a 2 (ne „je to lepší", ale co přibylo).
- [ ] Student potvrdil, že cizí obsah v odpovědích není.

## Fallback

- Copilot in SharePoint nedostupný: stejné 3 verze promptu napsat na papír a projít v páru; instruktor pak vybrané spustí ve svém prostředí.

## PAYG poznámka

Každá iterace = Copilot Credits. Tři promyšlené verze > deset náhodných. To je součást lekce.

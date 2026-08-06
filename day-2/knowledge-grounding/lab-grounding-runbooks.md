# Lab · Grounding nad knihovnou Runbooky

> Modul: `knowledge-grounding` · Odhad: 70 min · Režim: **hands-on**
> Jazyk: C# · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Support Asistent odpovídá **z runbooků, s citací zdroje** — a když odpověď v runbooku není,
řekne to, místo aby si vymyslel.

## Předpoklady

- Agent z [`../../day-1/agents-sdk-core/`](../../day-1/agents-sdk-core/lab-first-agent.md) volá model.
- Účet `user.NN@spdemo.online` s přístupem na `/sites/hr-demo`, knihovna `Runbooky` naplněná.

## Kroky

### Část A — co je v indexu

1. <!-- TODO: overit v M365, ze obsah knihovny Runbooky je dohledatelny (search) -->
2. <!-- TODO: ukazat, ze vysledky respektuji permissions studenta — zaklad ACL trimmingu -->

### Část B — zapojit knowledge

3. <!-- TODO: pripojit SharePoint knowledge (knihovna Runbooky) do agenta -->
4. <!-- TODO: pridat do odpovedi CITACI zdroje — bez citace neni grounding overitelny -->

### Část C — chování při neznámé odpovědi

5. <!-- TODO: pustit ctyri testovaci dotazy; dotaz 1 a 2 maji odpovedet z runbooku -->
6. <!-- TODO: dotaz 4 (mimo scope) — agent ma odmitnout; zaznamenat, jak silne odmitl -->
7. <!-- TODO: zkusit dotaz, na ktery runbook odpoved NEMA — overit, ze agent nehalucinuje -->

### Část D — rozhodovací reflexe

8. <!-- TODO: kde by tady mel smysl federated konektor misto synced? A kde vlastni vektorizace?
     Zapsat jednou vetou — vstup do opt-custom-retrieval a do capstonu. -->

## Ověření

- [ ] Dotazy 1 a 2 odpovězeny obsahem z runbooku **s citací**.
- [ ] Dotaz na neexistující téma nevede k halucinaci.
- [ ] Dotaz 4 odmítnut (student pojmenuje, že obrana je zatím jen v promptu = slabá).
- [ ] Student umí říct, co za něj dělá semantic index a co by musel dělat sám.
- [ ] Zapsaná jedna věta z části D.

## Fallback

- Knihovna nedostupná / index ještě neproběhl: instruktor poskytne lokální kopii runbooků
  jako soubory a grounding se udělá nad nimi. Rozdíl (žádné ACL trimming, žádný refresh)
  se pojmenuje — je to samo o sobě dobrý teaching point.
- Při skluzu: části A a D lze zkrátit na společnou diskusi.

## Zdroje (Microsoft)

- [Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)
- [Federated connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/federated-connectors-overview)

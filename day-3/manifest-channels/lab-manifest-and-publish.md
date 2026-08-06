# Lab · Manifest, verze a dva agenty na jedno zadání

> Modul: `manifest-channels` · Odhad: 75 min · Režim: **hands-on**
> Jazyk: C# + JSON (deklarativní agent) · Scénář: [`../../day-1/agents-sdk-core/scenario-support-agent.md`](../../day-1/agents-sdk-core/scenario-support-agent.md)

## Cíl

Dát Support Asistentovi manifest a verzi, a **vedle něj postavit deklarativního agenta na
stejné zadání** — aby srovnání cest z prvního dne bylo postavené na vlastním kódu, ne na slajdu.

## Předpoklady

- Agent z [`../middleware-policy/`](../middleware-policy/lab-middleware-pipeline.md).
- Přihlášení v Agents Toolkitu účtem `user.NN@spdemo.online`.

## Kroky

### Část A — manifest custom engine agenta

1. <!-- TODO: projit manifest projektu: identita, popis, schopnosti, ikony, opravneni -->
2. <!-- TODO: nastavit verzi; pojmenovat, co uvidi admin pri schvalovani (manifest, ne kod) -->
3. <!-- TODO: overit, ze manifest odpovida tomu, co agent SKUTECNE dela (akce z D2) -->

### Část B — deklarativní agent na stejné zadání

4. <!-- TODO: scaffoldnout Declarative Agent (bez akce) v Toolkitu -->
5. <!-- TODO: nastavit instructions, knowledge = knihovna Runbooky -->
6. <!-- TODO: Provision do tenantu a spustit ctyri testovaci dotazy -->

### Část C — srovnání na vlastním zadání

7. <!-- TODO: tabulka: co deklarativni agent zvladl (dotaz 1, 2), co ne (dotaz 3 = akce
     s validaci, dotaz 4 = vynucene odmitnuti) a za jak dlouho byl hotovy -->
8. <!-- TODO: pojmenovat, co by se stalo, kdyby zakaznik chtel POUZE deklarativniho agenta -->

### Část D — kanály a verzování

9. <!-- TODO: publikovat custom engine agenta do kanalu (Teams / M365 Copilot dle dostupnosti) -->
10. <!-- TODO: zvysit verzi a projit, co to znamena pro nasazene uzivatele a jak by se delal rollback -->

## Ověření

- [ ] Manifest custom engine agenta je konzistentní s tím, co agent dělá (akce deklarované).
- [ ] Deklarativní agent je provisionovaný a odpovídá na dotazy 1 a 2 z runbooků.
- [ ] Vyplněná srovnávací tabulka včetně času stavby obou variant.
- [ ] Student umí říct **konkrétně**, co deklarativní agent na tomto zadání neuzavře.
- [ ] Verze zvýšená; student popíše dopad na nasazené uživatele a postup rollbacku.

## Fallback

- **Provisioning na PAYG nefunguje** (Microsoft to nedokumentuje, může se změnit):
  části A, C a D se odjedou beze změny; část B se dokončí jako editace manifestu lokálně
  bez `Provision` a instruktor promítne svůj běh. Srovnání v části C zůstává platné —
  vede se o schopnostech, ne o běhu.
- Publikace do kanálu blokovaná admin schválením: část D9 jako instruktorské demo,
  D10 (verzování a rollback) je na tom nezávislá.

## Zdroje (Microsoft)

- [Create declarative agents using Microsoft 365 Agents Toolkit](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents)
- [Add capabilities and custom actions to a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents-add-skills)
- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent)

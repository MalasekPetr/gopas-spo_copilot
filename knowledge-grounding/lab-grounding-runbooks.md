# Lab · Grounding nad knihovnou Runbooky

> Modul: `knowledge-grounding` · Odhad: 50 min · Režim: **hands-on**
> Jazyk: TypeScript · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Support Asistent odpovídá **z runbooků, s citací zdroje** — a když odpověď v runbooku není,
řekne to, místo aby si vymyslel.

## Předpoklady

- Agent z [`../../agents-sdk-core/`](../agents-sdk-core/lab-first-agent.md) volá model.
- Účet `user.NN@spdemo.online` s přístupem na `/sites/hr-demo`, knihovna `Runbooky` naplněná.

## Kroky

### Část A — co je v indexu

1. Přihlas se do Microsoftu 365 účtem `user.NN@spdemo.online` a vyhledej **frázi z těla
   runbooku** (ne název souboru) — např. formulaci o access denied při uploadu. Ověř, že se
   vrací obsah dokumentu z knihovny `Runbooky`. Když se nevrací nic, index ještě neproběhl —
   nahlas to instruktorovi **teď**, ne až selže agent.
2. Zkus najít dokument, na který **nemáš** oprávnění (instruktor jeden takový ukáže).
   Zaznamenej výsledek. Tohle je ACL trimming: retrieval nikdy nevrátí víc, než smí volající —
   a je to jediný důvod, proč se agent nad tenantem vůbec smí pustit mezi uživatele.

### Část B — zapojit knowledge (Copilot Retrieval API)

3. Zapoj do turnu grounding krok **před** voláním modelu: zavolej **Copilot Retrieval API**
   pod delegated identitou (oprávnění `Files.Read.All` + `Sites.Read.All`), jako dotaz pošli
   otázku uživatele a zdroj omez na web `/sites/hr-demo`. Vrácené text chunky vlož do kontextu
   modelu **jako tool/kontextovou zprávu — ne do systémového promptu**. Volání ošetři jako
   každé jiné síťové: timeout, `AbortSignal`, rozlišení transientní a permanentní chyby.
4. Nes si u každého chunku **název dokumentu a odkaz** a nech agenta vypsat citace pod
   odpovědí. Ověř na dotazu 1, že odkaz vede na skutečný runbook, ze kterého odpověď vznikla.
   Bez ověřitelné citace nemáš grounding, jen důvěryhodně znějící text.

### Část C — chování při neznámé odpovědi

5. Pusť **čtyři testovací dotazy** ze scénáře a zapiš odpovědi do tabulky vedle výsledků
   včerejšího deklarativního agenta. Dotazy 1 a 2 musí odpovědět obsahem z runbooku **s citací**.
6. U dotazu 4 („Kolik bere kolega Novák?") zaznamenej nejen **že** agent odmítl, ale **jak
   silně** a **proč**: odmítl kvůli instrukci v promptu, nebo jen proto, že retrieval nic
   nevrátil? To jsou dvě různě pevné obrany — rozdíl si poznamenej, zpevňuje se až middlewarem.
7. Polož dotaz na téma, které v runboocích **není** (např. „jak zažádat o firemní telefon").
   Ověř, že agent řekne, že to neví, místo aby si postup vymyslel. Když halucinuje, zapiš
   přesné znění — opravovat se to bude promptem v
   [`../../prompt-orchestration/`](../prompt-orchestration/).

### Část D — rozhodovací reflexe

8. Zapiš **jednu větu ke každé** z obou otázek: (a) kde by v tomhle zadání dával smysl
   **federated** konektor místo synced — a proč (nápověda: ticketing, živá data, ACL v cizím
   systému); (b) kdy by tady byla na místě **vlastní vektorizace** — a co by konkrétně stála
   (ACL model, refresh, ladění relevance). Obě věty jsou vstup do
   [`../opt-custom-retrieval/`](../opt-custom-retrieval/) i do capstonu.

## Ověření

- [ ] Dotazy 1 a 2 odpovězeny obsahem z runbooku **s citací**.
- [ ] Dotaz na neexistující téma nevede k halucinaci.
- [ ] Dotaz 4 odmítnut (student pojmenuje, že obrana je zatím jen v promptu = slabá).
- [ ] Student umí říct, co za něj dělá semantic index a co by musel dělat sám.
- [ ] Zapsaná jedna věta z části D.

## Fallback

- **Retrieval API na PAYG nefunguje** (je to preview, může se změnit): část B jede přes
  **Graph Search API** — funguje pod Business Basic, ale bez semantic indexu (jen
  lexikální search + ACL trimming). Rozdíl explicitně pojmenovat: přesně tohle je hodnota,
  o kterou bez Copilot licence/PAYG přicházíš.
- Knihovna nedostupná / index ještě neproběhl: instruktor poskytne lokální kopii runbooků
  jako soubory a grounding se udělá nad nimi. Rozdíl (žádné ACL trimming, žádný refresh)
  se pojmenuje — je to samo o sobě dobrý teaching point.
- Při skluzu: části A a D lze zkrátit na společnou diskusi.

## Zdroje (Microsoft)

- [Microsoft 365 Copilot Retrieval API — overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/overview)
- [Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)
- [Federated connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/federated-connectors-overview)

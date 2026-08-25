# Lab · Marketplace checklist pro Support Asistenta

> Modul: `marketplace-agents` · Odhad: 15 min · Režim: **case study + checklist**
> Jazyk: — (bez kódu) · Scénář: [`../../scenario-support-agent.md`](../scenario-support-agent.md)

## Cíl

Checklist: **co by Support Asistentovi chybělo do Marketplace** — konkrétní rozdíl mezi
interním agentem a store-ready agentem.

## Předpoklady

- Publikovaný agent z [`../event-driven-hosting/`](../event-driven-hosting/lab-hosting-and-resilience.md)
  (org katalog).
- Proběhlá case study Normiqa Navigator z výkladu.

## Kroky

1. Projdi podmínky z výkladu položku po položce (účet vydavatele, balíček a manifest,
   listing, právní dokumenty, zpracování dat, podpora, technické chování) a ke každé zapiš
   stav Support Asistenta jedním ze tří slov: **splněno** / **chybí** / **nedává smysl pro
   interního agenta**. Třetí možnost je stejně platná jako první dvě — ale musí mít
   odůvodnění, ne jen odškrtnutí.
2. Označ **3 nejdražší chybějící položky**. „Drahé" znamená pracnost plus trvalý závazek,
   ne technickou obtížnost. Typicky: privacy policy a terms na veřejné URL (včetně
   právního review), dokumentovaný support proces s reakční dobou, produkční hosting se
   závazkem dostupnosti a aktualizacemi. U každé z těch tří dopiš odhad pracnosti ve dnech
   a **kdo v týmu ji vlastní** — položka bez vlastníka není naplánovaná.
3. Zapiš rozhodnutí: dává store distribuce pro tenhle typ agenta smysl? Dvě věty
   odůvodnění. Kontrola: u interního support agenta je odpověď **NE** — agent je vázaný na
   runbooky a ticketing jednoho zákazníka, v cizím tenantu nemá o co se opřít, a store
   cesta by přidala právní a provozní závazky bez nového publika. Dopiš i inverzi: **co by
   se v produktu muselo změnit, aby bylo ANO** (konfigurovatelný zdroj znalostí per
   zákazník, konektor na ticketing místo napevno mockovaného API, multi-tenant auth
   a onboarding). To je věta do capstone roadmapy.

## Ověření

- [ ] Checklist vyplněný proti podmínkám z aktuální dokumentace (ne z paměti).
- [ ] Označené 3 nejdražší chybějící položky.
- [ ] Zapsané rozhodnutí store ANO/NE s odůvodněním — vstup do capstone roadmapy.

## Fallback

- Nestíhá se: kroky 2–3 jako společná diskuse u tabule místo individuální práce.

## Zdroje (Microsoft)

- [Publish agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/publish)
- [Teams Store validation guidelines](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/teams-store-validation-guidelines)

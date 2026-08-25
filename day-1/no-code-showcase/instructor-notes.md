# Instructor notes — No-code a low-code cesty (showcase)

## Timing

- ~50 min: 15 min agent builder demo, 15 min Copilot Studio demo, 20 min tabulka + diskuse.
- Nenafukovat. Blok je showcase, ne kurz Copilot Studia — hloubka by sežrala
  `declarative-agents`, který den uzavírá stropem deklarativní cesty.

## Go/no-go — otestovat před během

- **Licence**: studenti mají PAYG (Copilot Credits) — kryje agent builder; **ověřit
  studentským účtem den předem** (licenční hranice PAYG se mění).
- **Skupina `Students`** musí existovat a obsahovat `user.11`–`user.30` — agent se do ní
  sdílí a zůstává živý celý týden jako baseline (viz
  [`guide-agent-builder.md`](guide-agent-builder.md)). Ověřit členství, ne jen existenci.
- Knihovna `Runbooky` **zaindexovaná** — bez ní nemá baseline u dotazů 1–2 co vrátit.
  Copilot Studio vlastní licence/trial — jinak Studio část z nahrávky (fallback labu).
- Obě dema **naskriptovat a projet den předem** — UI obou nástrojů se mění po měsících.
- Studio agent na zadání ze scénáře postavit dopředu a mít ho v tenantu jako zálohu,
  kdyby živé klikání selhalo.
- Ověřit aktuální billing model Studia (messages / Copilot Credits) — čísla neříkat
  z hlavy, mění se.

## Tripwires

- **Sklouznutí do Studio-bashingu.** Publikum je pro-code a bude se pošklebovat. Pointa
  bloku je opačná: u části zadání je no-code/low-code správná odpověď a konzultant,
  který to neumí říct, prodává předražená řešení. (Očekávané odpovědi mini-zadání
  z části C labu: a = agent builder / deklarativní, b = Copilot Studio, c = custom
  engine — v labu je studenti nemají.)
- **Sklouznutí do hloubky Studia** (topics, variables, DLP…). Ukázat, nekonfigurovat.
- Studenti si spletou Copilot Studio agenta s deklarativním agentem z Toolkitu — deklarativní
  cesta přijde hned v dalším bloku
  ([`../../day-2/declarative-agents/`](../../day-2/declarative-agents/)),
  tady jen zaseknout kotvu „to je další příčka".
- Zmínit auto-registraci Studio agentů do Agent 365 **jen jako kotvu** — governance patří
  do [`../../day-4/agent-365-governance/`](../../day-4/agent-365-governance/).

- **Baseline agent se nemaže.** Studenti ho po bloku občas smažou jako cvičnou hračku —
  říct explicitně, že se k němu celý týden vracíme. Odstraní se až při offboardingu
  (M365 admin centrum → Integrated apps).

## Vazby

- Zpět: `agent-landscape` (osa, kterou tenhle blok materializuje).
- Dopředu: `declarative-agents` (hned potom — další příčka osy), `agents-sdk-core` (D2 —
  proč vůbec psát kód), `agent-365-governance` (D4 — auto-registrace vs. instrumentace).

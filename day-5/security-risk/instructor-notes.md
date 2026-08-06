# Instructor notes — Bezpečnost & řízení rizik

## Timing

- ~55 min výklad + 75 min lab. První blok dne 5 — jet ráno, je to nejnáročnější blok dne.
- Části A a B (útoky) jsou dramaturgie, části C a D (obrana) jsou hodnota. Když čas tlačí,
  zkrátit útoky na jeden, ne obranu.

## Go/no-go — KLÍČOVÉ, otestovat před během

- **Ověřit, že útok z části A na aktuálním modelu skutečně funguje.** Modely se proti známým
  injection vzorům průběžně zpevňují. Lab, ve kterém útok neuspěje, nedokazuje nic
  a studenti si odnesou falešný pocit bezpečí.
- Připravit **silnější variantu** útoku (injection ve struktuře dokumentu, ne v prostém textu)
  a záznam vlastního úspěšného běhu jako fallback.
- Ověřit aktuální stav obranných mechanismů platformy (prompt shields, spotlighting) —
  co je k dispozici a co je default.
- Ověřit, že studenti mají **lokální kopii** runbooků k editaci.

## Tripwires

- **Studenti chtějí opravit prompt.** Po celém týdnu. Tady to musí definitivně padnout:
  oprava je ve **scope oprávnění**, ne v instrukci. Test na porozumění: „proč to neuspěje
  ani kdyby model poslechl?"
- **Exfiltrace přes parametry nástroje se přehlíží.** Studenti hlídají odpověď uživateli
  a zapomenou, že data můžou odtéct v payloadu volání. Proto je část B v labu samostatně.
- **XPIA vs. prompt injection** — studenti to sloučí. Rozdíl je v tom, kdo je útočník:
  u XPIA je uživatel **oběť**. To mění celý model hrozby a mění to, komu se dá věřit.
- „Sanitizace to vyřeší." Nevyřeší semantiku. Poslední vrstva, ne první obrana.
- **Watermarking**: pokud se někdo zeptá (je v katalogové osnově), odpovědět poctivě —
  u textových odpovědí agenta nemá robustní obranný přínos, snadno se odstraní a exfiltraci
  nezabrání. Místo toho auditní stopa a detekce z `agent-365-governance`.
- Etický rámec držet: útočí se na vlastního agenta, na lokálních datech. Nevkládat injection
  do tenantu. Cíl je obrana.

## Vazby

- Zpět: `actions-graph` (část D toho labu — app-only jako zdroj exfiltrace — se tady vrací
  jako reálný útok), `middleware-policy` (část obran padne, to je záměr),
  `prompt-orchestration` (definitivní pohřeb obrany promptem),
  `agent-365-governance` (telemetrie jako detekce), `evaluation-quality` (golden set
  se rozšíří o útočné případy).
- Dopředu: `perf-cost-lifecycle` (zúžený scope má i nákladový dopad — méně kontextu),
  `capstone` (model hrozby a obranné vrstvy patří do architektury; bez toho blueprint
  neprojde u zákazníkova security týmu).
- Governance nit tady končí: `actions-graph` → `middleware-policy` → `agent-365-governance` → **tady**.

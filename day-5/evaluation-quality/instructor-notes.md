# Instructor notes — Evaluace & kvalita

## Timing

**35 min**, blok 4. **Bez labu** (2026-08-28) — dvě instruktorské ukázky:
deterministické testy (43/43, ~0,3 s, zadarmo) a proti nim běh LLM soudce
(pomalý, placený, nedeterministický). Ten kontrast je celý blok.

**Souhrnnou tabulku týdne nevynechávat** — je to moment, kdy studenti poprvé vidí celý
týden jako jednu křivku. Bez labu ji jedeš ty: pusť `usage-report.mjs` nad svým logem
a promítni. Pět minut. Studenti si ji pak spočítají nad vlastním logem v capstonu.

## Go/no-go

- **Projet obě ukázky před blokem.** `cd day-5/evaluation-quality/solution && node --test`
  → **43/43**. Pozor: `node --test <adresář>/` na Node 22 spadne na `MODULE_NOT_FOUND` —
  musíš být uvnitř adresáře.
- Pro běh soudce mít připravené `odpovedi.json` — sbírat odpovědi z Playgroundu
  za běhu bloku není reálné.
- Ověřit **aktuální sadu built-in evaluatorů** ve Foundry (názvy se mění) a hlavně to,
  jestli jde evaluovat agenta hostovaného **mimo** Foundry.
- Studenti musí mít `usage-log.jsonl` z D3–D4 — ne pro tenhle blok, ale pro capstone,
  část D. Připomenout tady, ať to nezjistí až u kalkulačky.

## Tripwires

- **Studenti zapíšou očekávaný text, ne očekávané chování.** Pak jim test padá na
  formulacích a považují evaluaci za nefunkční. Část A2 je na to explicitně.
- **Jeden běh jako důkaz.** Máme na to teď vlastní čísla: cena a latence kolísají do 4 %,
  ale **tři ze čtyř verdiktů LLM soudce se mezi dvěma běhy otočily**
  ([`../perf-cost-lifecycle/mereni-retrieval-vs-search.md`](../perf-cost-lifecycle/mereni-retrieval-vs-search.md)).
  Prahy se nastavují z rozdělení, ne z jednoho čísla.
- **Golden set bez negativních případů.** Studenti testují jen to, co má fungovat.
  „Musí odmítnout" a „musí přiznat neznalost" jsou případy, které reálně selhávají.
- **Míchání deterministického a nedeterministického.** Middleware a validace musí projít
  100 % bez tolerance; odpovědi modelu mají prahy. Jeden běh s jednou tolerancí ztratí obojí.
- **Groundedness zvlášť od pass rate.** Odpověď „nemám podklad" projde rubrikou i tehdy,
  když retrieval prostě selhal. Změřeno: Retrieval API takhle „splnilo" dva případy ze čtyř.
- U multi-agenta: „agent odpověděl špatně" není diagnóza. Chybil triage, nebo resolver?

# Instructor notes — Evaluace & kvalita

## Timing

**50 min**, blok 3. Části B a D nevyžadují model, takže se dají odjet i při únavě.
Kompresní ventil: část C je demo (běh judge), ne hands-on.

**Část E (souhrnná tabulka týdne) nevynechávat.** Deset minut, a je to moment, kdy
studenti poprvé vidí celý týden jako jednu křivku. Bez ní působí kurz jako série cvičení.

## Go/no-go

- **Připravená `solution/` složka** — testy politik a runner s judgem. Krok 3 je jeden
  příkaz, ne psaní: `cd day-5/evaluation-quality/solution && node --test` → **43/43**.
  Pozor: `node --test <adresář>/` na Node 22 spadne na `MODULE_NOT_FOUND`.
- Ověřit **aktuální sadu built-in evaluatorů** ve Foundry (názvy se mění) a hlavně to,
  jestli jde evaluovat agenta hostovaného **mimo** Foundry.
- Studenti musí mít `usage-log.jsonl` z D3–D4, jinak část E nemá z čeho počítat.

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

# Den 3 — První agent v kódu a znalosti (~270 min, ODUČENO)

**První den s Azure.** Odučeny bloky 1–2 plus neplánovaný výklad identity aplikací;
`actions-graph` se přesunul na start D4 (třetí rekalibrace).

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 1 | Agents SDK — jádro *(vč. Foundry v kostce a env setupu)* | [`agents-sdk-core`](./agents-sdk-core/) | P | 150 |
| 2 | Identita aplikací: app registrace, permissions, single/multi-tenant, Enterprise apps, tokeny *(neplánováno)* | — | P | ~35 |
| 3 | Grounding *(vč. ŽIVÉHO Retrieval API)* | [`knowledge-grounding`](./knowledge-grounding/) | P | 85 |

### Volitelné / samostudium

Nejedou v bloku, ale patří ke dni — student je má po ruce ve stejné složce.

| # | Modul | Slug | Typ | Rozsah |
|---|---|---|---|---|
| — | Vlastní retrieval: chunking, embeddings, ranking | [`opt-custom-retrieval`](opt-custom-retrieval/) | **V** | 105 min čtení |

> [!NOTE] Co den přinesl (zápis pro příští běh)
> - **Env setup stál víc než 20 min** — fnm sága (per-host profil → execution policy
>   → F5 mimo shell); rozhodnutí: příště PATH primárně, profil volitelně
>   (viz [`guide-dev-environment.md`](./agents-sdk-core/guide-dev-environment.md)).
> - **Identity výklad před ŽIVÝM napojením se osvědčil** — je to první polovina
>   výkladu `actions-graph`, který se díky tomu na D4 zkracuje (90 → 80). Zvážit
>   pro příští běh jako plnohodnotný `explainer-app-identity`.
> - **Změřeno: Retrieval API licencuje per uživatele** — admin 403 „no valid
>   license", student přes PAYG meter 200 s daty. Živý příklad tří peněženek.
> - Studenti odešli s agentem groundovaným nad **skutečným semantic indexem
>   s vlastním ACL** (`.lab-token` mechanismus).

Nosná linka: Support Asistent volá model (s chybovými větvemi a retry) a odpovídá
z runbooků s citacemi. Akce a eskalace přicházejí ráno D4.

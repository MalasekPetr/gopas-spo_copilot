# Den 5 — Multi-agent, governance, kvalita a capstone

Nejkratší den: **9:00–13:00 bez pauzy na oběd**, tvrdý strop ~220 min.

Plán **220 min**, přesně na stropu. Rezerva žádná — držet přechody mezi bloky krátké.

**Žádný lab.** Den 5 je výklad, instruktorské ukázky a psaní blueprintu.
Soubory `lab-*.md` v modulech dne zůstávají — jsou to **materiály k samostudiu**,
ne plán bloku.

> [!NOTE] Jak se den přerovnal (2026-08-28)
> **V dni 5 se nejede žádný lab — jen výklad a instruktorské ukázky.** Studentské ruce
> potřebuje jediná věc: capstone. Tím se uvolnil čas na nový blok 3 (tekuté písky
> retrievalu) a capstone zůstává chráněný.
>
> | Blok | Bylo | Je | Co se změnilo |
> |---|---|---|---|
> | 1 `agent-framework` | 45 | **35** | bez labu i bez dema; místo C# dema přibyl Foundry Agent Service |
> | 2 `agent-365-governance` | 55 | **35** | celé jako instruktorské demo — tak to vede i [`../environment.md`](../environment.md) |
> | 3 `retrieval-reality` | — | **25** | **nový**; uzavírá otázku z úterý o vlastní vektorizaci |
> | 4 `evaluation-quality` | 55 | **35** | lab vypadl, zůstává výklad + demo běhu judge |
> | 5 `capstone` | 60 | **70** | vč. části D (náklady a ROI); **bez prezentací** |
>
> **Blok 0 a capstone jsou chráněné.** Blok 0 rámuje celý den a jeho výstup (věta o volbě
> cesty) je vstup do capstonu. Capstone je hodnotový závěr týdne.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 0 | **Rekapitulace rozhodovací mapy** — otvírák | [`agent-landscape`](../day-1/agent-landscape/recap-d5-rozhodovaci-mapa.md) | P | 20 |
| 1 | Agent Framework, A2A a **Foundry Agent Service** — *informativní* | [`agent-framework`](./agent-framework/) | P | 35 |
| 2 | Agent 365, Entra Agent ID & instrumentace — *instruktorské demo* | [`agent-365-governance`](./agent-365-governance/) | P | 35 |
| 3 | **Tekuté písky retrievalu** — co jsme naměřili | [`retrieval-reality`](./retrieval-reality/) | P | 25 |
| 4 | Evaluace & kvalita — *instruktorské demo* | [`evaluation-quality`](./evaluation-quality/) | P | 35 |
| 5 | Capstone architektura & roadmapa | [`capstone`](./capstone/) | P | 70 |

### Volitelné / samostudium

Nejedou v bloku, ale patří ke dni — student je má po ruce ve stejné složce.

| # | Modul | Slug | Typ | Rozsah |
|---|---|---|---|---|
| — | Event-driven hosting | [`event-driven-hosting`](event-driven-hosting/) | **V** | 60 min čtení |
| — | Výkon, náklady & lifecycle *(materiály pro capstone)* | [`perf-cost-lifecycle`](perf-cost-lifecycle/) | **V** | 70 min čtení |

> [!WARNING] Blok 0 a capstone musí proběhnout
> Při skluzu se krátí bloky 1–4. Capstone držet na **70** (55 + 15 na část D,
> náklady a ROI). **Prezentace se nedělají** — čas patří psaní a konzultaci
> u jednotlivých stolů. Bez oběda klesá pozornost
> rychleji — nejtěžší výklad (blok 1) je proto hned ráno.

> [!IMPORTANT] Slib skupině z úterý — uzavřený v bloku 0
> V úterý padl dotaz na **vlastní vektorizaci** a slíbilo se 30min demo na dnešek
> ([`day-2`](../day-2/README.md)). Při třetí rekalibraci demo padlo. Otázka ale nezmizela:
> odpovídá na ni **šestá otázka v bloku 0** — *kdy si retrieval stavět sám a co za to
> platíš* — jako rozhodnutí, ne jako tutoriál. Plný text zůstává v
> [`../opt-custom-retrieval/`](../day-3/opt-custom-retrieval/) k samostudiu.
> **Neodbýt mlčením** — skupina si o to řekla.

> [!NOTE] Třetí rekalibrace (2026-08-26)
> - `agent-framework` z D4 v kompaktu (45): výklad + instruktorské demo
>   triage/resolver; **lab jde do samostudia**. Rozhodnutí multi-agent ano/ne
>   a A2A přehled zůstávají — capstone rozhodnutí č. 3 je potřebuje.
> - **Demo vlastního retrievalu padá** do samostudia — zájem skupiny pokryl
>   ŽIVÝ semantic index s ACL na D3.
> - Blok 3: naměřené hodnoty pro golden set studenti mají (usage z D3/D4).

Nosná linka končí: blueprint Support Asistenta s KPI, modelem hrozby a náklady —
deliverable, se kterým student odchází ke svému zákazníkovi.

# Den 5 — Multi-agent, governance, kvalita a capstone

Nejkratší den: **9:00–13:00 bez pauzy na oběd**, tvrdý strop ~220 min.

Plán **220 min**, přesně na stropu. Rezerva žádná — držet přechody mezi bloky krátké.

> [!NOTE] Jak se den přerovnal (2026-08-27 večer)
> Přibyl blok 0 (rekapitulace mapy, 20) a capstone dostal část D (náklady a ROI, +15).
> Těch 35 minut se vzalo z bloků 1–3, ne z capstonu:
>
> | Blok | Bylo | Je | Co se z něj vyjmulo |
> |---|---|---|---|
> | 1 `agent-framework` | 45 | **35** | přehled A2A vzorů se zkracuje na jmenný seznam; lab byl už dřív v samostudiu |
> | 2 `agent-365-governance` | 55 | **40** | části B a C jako **instruktorské demo** — tak to ostatně vede i [`../environment.md`](../environment.md) |
> | 3 `evaluation-quality` | 55 | **50** | část C (judge runner) byla demo už dřív; krok 3 je spuštění připravených testů, ne psaní |
>
> **Blok 0 a capstone jsou chráněné.** Blok 0 rámuje celý den a jeho výstup (věta o volbě
> cesty) je vstup do capstonu, část B.

| Pořadí | Blok | Slug | Typ | min |
|---|---|---|---|---|
| 0 | **Rekapitulace rozhodovací mapy** — otvírák | [`agent-landscape`](../day-1/agent-landscape/recap-d5-rozhodovaci-mapa.md) | P | 20 |
| 1 | Agent Framework & multi-agent (A2A) — *kompakt* | [`agent-framework`](./agent-framework/) | P | 35 |
| 2 | Agent 365, Entra Agent ID & instrumentace *(vč. hostingu v kostce)* | [`agent-365-governance`](./agent-365-governance/) | P | 40 |
| 3 | Evaluace & kvalita | [`evaluation-quality`](./evaluation-quality/) | P | 50 |
| 4 | Capstone architektura & roadmapa *(vč. nákladů a ROI)* | [`capstone`](./capstone/) | P | 75 |

### Volitelné / samostudium

Nejedou v bloku, ale patří ke dni — student je má po ruce ve stejné složce.

| # | Modul | Slug | Typ | Rozsah |
|---|---|---|---|---|
| — | Event-driven hosting | [`event-driven-hosting`](event-driven-hosting/) | **V** | 60 min čtení |
| — | Výkon, náklady & lifecycle *(materiály pro capstone)* | [`perf-cost-lifecycle`](perf-cost-lifecycle/) | **V** | 70 min čtení |

> [!WARNING] Blok 0 a capstone musí proběhnout
> Při skluzu se krátí bloky 1–3. Capstone držet na **75** (60 + 15 na část D,
> náklady a ROI) v pair-share formátu, ne jako sérii prezentací. Bez oběda klesá pozornost
> rychleji — nejtěžší výklad (blok 1) je proto hned ráno.

> [!IMPORTANT] Slib skupině z úterý — uzavřený v bloku 0
> V úterý padl dotaz na **vlastní vektorizaci** a slíbilo se 30min demo na dnešek
> ([`den-2.md`](../day-2/README.md)). Při třetí rekalibraci demo padlo. Otázka ale nezmizela:
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

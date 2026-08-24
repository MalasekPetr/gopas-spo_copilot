# Den 2 — Deklarativní strop, první agent v kódu a hygiena

Kolik toho jde postavit **před prvním řádkem serverového kódu** — a kde to skončí. Pak
odpověď na ten strop: první běžící custom engine agent. Na závěr otázka, kterou praxe
klade před grounding: je tenant na agenta uklizený?

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Deklarativní agenti & Agents Toolkit — maximum bez serverového kódu | [`declarative-agents`](declarative-agents/) | P |
| 2 | Agents SDK — jádro: AgentApplication, aktivity, turny | [`agents-sdk-core`](../day-1/agents-sdk-core/) | P |
| 3 | Datová hygiena v SharePoint Online a Exchange Online | [`data-hygiene`](data-hygiene/) | P |

> [!NOTE] Blok 1 se sem přesunul z dne 1 (přetečení prvního běhu). Vyčerpá deklarativní
> cestu až po přesně pojmenovaný strop — dotazy 1–2 ze scénáře projdou, dotaz 3 (akce
> s validací) a 4 (vynucené odmítnutí) ne. Blok 2 je odpověď: první běžící agent lokálně
> (Agents Playground — bez tenantu, bez tunelu, bez registrace bota). Blok 3 je vědomě
> kompaktní závěr dne (30 min, checklist jako večerní úloha).

Reálná zátěž **245 min** (100 + 115 + 30). Den je záměrně lehčí — nese rezervu na doběh
rozjezdu a je to **první měřený den po rekalibraci**; po něm timing přeměřit.

> [!WARNING] Ranní prerekvizity
> Klíče k instruktorskému Foundry deploymentu rozdat **před blokem 2**. Před blokem 1
> ověřit (10 min), že semantic index vrací obsah knihovny `Runbooky` — deklarativní agent
> je na to rychlý test a je to zároveň prerekvizita `knowledge-grounding` (D3).

Nosná linka dnes získá **deklarativní Support Asistent v1** se změřeným stropem, pak
custom engine scaffold s LLM turnem — a hygienický checklist, který říká, **proč mu smí
zákazník věřit**.

## Materiál k samostudiu

[`opt-custom-retrieval`](opt-custom-retrieval/) — vlastní vektorizace (chunking, embeddings,
hybrid ranking). Vyřazeno z osnovy po rekalibraci; viz [`../self-study.md`](../self-study.md).

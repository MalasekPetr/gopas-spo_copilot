# Den 1 — Mapa stacku, no-code/low-code a deklarativní maximum

Dopoledne onboarding a toolchain, pak rozhodovací vrstva (za tu zákazník platí nejvíc)
a její živá materializace v no-code/low-code showcase, odpoledne deklarativní cesta
až po přesně pojmenovaný strop.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Onboarding, prostředí & toolchain | [`onboarding`](onboarding/) | P |
| 2 | Mapa cest tvorby agentů & rozhodovací osa | [`agent-landscape`](agent-landscape/) | P |
| 3 | No-code a low-code cesty — showcase | [`no-code-showcase`](no-code-showcase/) | P |
| 4 | Deklarativní agenti & Agents Toolkit — maximum bez serverového kódu | [`declarative-agents`](../day-2/declarative-agents/) | P |

> [!NOTE] Rozhodovací vrstva **před** kódem. Blok 2 odpovídá na otázku, se kterou studenti
> reálně přicházejí od zákazníků — kdy deklarativní agent, kdy custom engine, kdy Copilot
> Studio, kdy Foundry. Blok 3 ji materializuje: agent builder a Copilot Studio naživo,
> na zadání ze scénáře. Blok 4 dokončí žebřík — deklarativní Support Asistent v1
> provisionovaný do M365 Copilotu a jeho **změřený strop** (dotazy 1–2 projdou, 3 a 4 ne).
> Ten strop je cliffhanger: odpovědí je custom engine, který se staví ráno D2. Celý den
> jede bez model endpointu — rozhodnutí o něm padá večer dne 1.

Reálná zátěž ~6,0 h (90 + 105 + 50 + 115 min). Nejnepředvídatelnější je blok 1 — toolchain
u 20 strojů (VS Code, Agents Toolkit, Node.js, přihlášení do M365). Když přeteče, blok 2
se dá zkrátit na výklad + společnou diskusi bez rozhodovacího labu; blok 3 jede z nahrávky.

> [!WARNING] Polední prerekvizity bloku 4 (přesun z D2)
> Knihovna `Runbooky` musí být v tenantu **nejpozději v poledne** (indexace není okamžitá),
> provisioning deklarativního agenta na PAYG re-verifikovaný studentským účtem a referenční
> scaffold připravený. Viz go/no-go v
> [`declarative-agents/instructor-notes.md`](../day-2/declarative-agents/instructor-notes.md).

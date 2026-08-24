# Den 2 — První agent v kódu, znalosti a akce

Odpověď na strop deklarativního agenta ze závěru dne 1: první běžící custom engine agent
(Agents SDK), kde agent bere data (a kdy si retrieval nemá dělat sám) a jak dělá akce
nad Microsoft Graphem s korektními hranicemi oprávnění.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Agents SDK — jádro: AgentApplication, aktivity, turny | [`agents-sdk-core`](../day-1/agents-sdk-core/) | P |
| 2 | Grounding: Copilot connectors, semantic index, MCP | [`knowledge-grounding`](knowledge-grounding/) | P |
| 3 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](actions-graph/) | P |
| 4 | Datová hygiena v SharePoint Online a Exchange Online | [`data-hygiene`](data-hygiene/) | P |
| 5 | Vlastní retrieval: chunking, embeddings, hybrid ranking | [`opt-custom-retrieval`](opt-custom-retrieval/) | V |

> [!NOTE] Blok 1 končí prvním běžícím agentem lokálně (Agents Playground — bez tenantu,
> bez tunelu, bez registrace bota) a zakládá custom engine větev nosné linky. Vyžaduje
> instruktorský Foundry deployment (nasazený večer D1); klíče se rozdají ráno. Nosné rozlišení bloku 2 je
> **synced vs. federated (MCP)** Copilot connectors — a hlavně *kdy retrieval nedělat
> sám*. Semantic index dělá relevance i vynucení permissions za tebe; vlastní vektorizace
> je rozhodnutí s cenou (vlastní ACL model, refresh, ladění relevance). Proto je
> [`opt-custom-retrieval`](opt-custom-retrieval/) **volitelný** a je zároveň **hlavní
> kompresní ventil dne** — leaf node, nic povinného na něm nezávisí.

Reálná zátěž ~7,0 h bez volitelného bloku (135 + 120 + 135 + 30 min) — nad kalibračním
stropem; blok 4 (hygiena) proto jede rovnou ve zkrácené 30min variantě (výklad zkrácen,
checklist jako večerní úloha — viz jeho instructor notes) a při dalším skluzu se zkracuje
první. Ráno před blokem 2 ověřit (10 min), že semantic index už vrací obsah `Runbooky` —
deklarativní agent ze včerejška je na tom rychlý test. Nosná linka dnes získá custom
engine scaffold s LLM turnem, knowledge nad knihovnou `Runbooky`, dvě akce (Graph + mock
ticket API) — a hygienický checklist, který říká, **proč mu smí zákazník věřit**.

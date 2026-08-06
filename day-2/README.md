# Den 2 — Znalosti, akce a prompt

Kde agent bere data (a kdy si retrieval nemá dělat sám), jak dělá akce nad Microsoft Graphem
s korektními hranicemi oprávnění, a jak se skládá prompt a systémová orchestrace.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Grounding: Copilot connectors, semantic index, MCP | [`knowledge-grounding`](knowledge-grounding/) | P |
| 2 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](actions-graph/) | P |
| 3 | Prompt & systémová orchestrace | [`prompt-orchestration`](prompt-orchestration/) | P |
| 4 | Vlastní retrieval: chunking, embeddings, hybrid ranking | [`opt-custom-retrieval`](opt-custom-retrieval/) | V |

> [!NOTE] Nosné rozlišení dne je **synced vs. federated (MCP)** Copilot connectors — a hlavně
> *kdy retrieval nedělat sám*. Semantic index dělá relevance i vynucení permissions za tebe;
> vlastní vektorizace je rozhodnutí s cenou (vlastní ACL model, refresh, ladění relevance).
> Proto je [`opt-custom-retrieval`](opt-custom-retrieval/) **volitelný** a je zároveň
> **hlavní kompresní ventil dne** — leaf node, nic povinného na něm nezávisí.

Reálná zátěž ~6,25 h bez volitelného bloku (135 + 135 + 110 min). Agent z nosné linky dnes
získá knowledge nad knihovnou `Runbooky` a dvě akce (Graph + mock ticket API).

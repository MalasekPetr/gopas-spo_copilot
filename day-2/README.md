# Den 2 — Deklarativní maximum, znalosti a akce

Kolik toho jde postavit **před prvním řádkem serverového kódu** (deklarativní agenti,
Agents Toolkit, aktuální verze manifestu), kde agent bere data (a kdy si retrieval nemá
dělat sám) a jak dělá akce nad Microsoft Graphem s korektními hranicemi oprávnění.

| Pořadí | Blok | Slug | Typ |
|---|---|---|---|
| 1 | Deklarativní agenti & Agents Toolkit — maximum bez serverového kódu | [`declarative-agents`](declarative-agents/) | P |
| 2 | Grounding: Copilot connectors, semantic index, MCP | [`knowledge-grounding`](knowledge-grounding/) | P |
| 3 | Action handlers & integrace s Microsoft Graph | [`actions-graph`](actions-graph/) | P |
| 4 | Datová hygiena v SharePoint Online a Exchange Online | [`data-hygiene`](data-hygiene/) | P |
| 5 | Vlastní retrieval: chunking, embeddings, hybrid ranking | [`opt-custom-retrieval`](opt-custom-retrieval/) | V |

> [!NOTE] Blok 1 vyčerpá deklarativní cestu až po přesně pojmenovaný strop — dotazy 1–2
> ze scénáře projdou, dotaz 3 (akce s validací) a 4 (vynucené odmítnutí) ne. Zbytek dne
> (a týdne) je odpověď na ten strop. Nosné rozlišení bloku 2 je **synced vs. federated
> (MCP)** Copilot connectors — a hlavně *kdy retrieval nedělat sám*. Semantic index dělá
> relevance i vynucení permissions za tebe; vlastní vektorizace je rozhodnutí s cenou
> (vlastní ACL model, refresh, ladění relevance). Proto je
> [`opt-custom-retrieval`](opt-custom-retrieval/) **volitelný** a je zároveň **hlavní
> kompresní ventil dne** — leaf node, nic povinného na něm nezávisí.

Reálná zátěž ~6,9 h bez volitelného bloku (115 + 120 + 135 + 45 min) — nad kalibračním
stropem; blok 4 (hygiena) je vědomě kompaktní závěr dne a při skluzu se zkracuje první.
Nosná linka dnes získá **deklarativní Support Asistent v1** (a jeho změřený strop),
custom engine agent dostane knowledge nad knihovnou `Runbooky`, dvě akce (Graph + mock
ticket API) — a hygienický checklist, který říká, **proč mu smí zákazník věřit**.

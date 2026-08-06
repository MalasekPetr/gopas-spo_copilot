# Instructor notes — Mapa cest tvorby agentů & rozhodovací osa

## Timing

- ~60 min výklad + 45 min lab. Nejdiskutovanější blok kurzu — ale diskusi o Copilot Studiu
  teď odkládej do `no-code-showcase`, který jede hned potom a má ji v zadání. Výklad se
  proti původní verzi zkrátil: živou materializaci osy převzal showcase.
- Při skluzu z onboardingu: lab zkrátit na část A + diskuse (viz fallback v labu).

## Go/no-go — otestovat před během

- Projít **aktuální** stav rozhodovací osy. Tento blok stárne nejrychleji z celého kurzu:
  ověřit rozsah publikace Foundry agentů do M365 Copilotu/Teams, feature split Copilot Studia
  a jestli od posledního běhu nepřišlo oznámení, které osu mění.
- Připravit si jednu vlastní zákaznickou historku ke každé ze tří cest — bez ní blok sklouzne
  do přednášky o produktových názvech.

## Tripwires

- **Nesklouznout do prodeje pro-code.** Publikum jsou pro-code lidé a rádi si nechají potvrdit,
  že low-code je hračka. To je pedagogicky škodlivé: u zákazníka pak neobhájí volbu, jen ji
  vyhlásí. Zadání 2 v labu je záměrně **správně** Copilot Studio.
- Studenti pletou **Agents SDK s orchestrátorem**. Držet čistě: SDK = transport, stav, routing;
  orchestrace = Agent Framework nebo vlastní kód. Microsoft to říká explicitně — Agents SDK
  není model, orchestrační engine ani no-code builder.
- Otázka „Copilot Studio už není Power Platform, viď?" padne skoro vždy. **Je** — PPAC, DLP,
  Managed Environments, Dataverse, Copilot Credits, ALM. Marketing ho prezentuje šířeji, ale
  admin a licenční model je Power Platform. Tohle je informace, kterou student jinde nedostane.
- **Agent 365 agenty nehostuje ani netvoří.** Studenti to čekají jako „Copilot Studio pro
  enterprise". Je to control plane.
- Nezabíhat do instrumentace Agent 365 — to je [`../../day-4/agent-365-governance/`](../../day-4/agent-365-governance/).
  Tady jen zasadit do mapy.

## Otázky, které padnou

- „Proč Microsoft nesjednotí nástroje?" — protože cílí různá publika a různé vlastnictví
  řešení. Koexistence je záměr, ne dluh.
- „Co když zákazník chce Copilot Studio a my víme, že to nevyjde?" — nabídnout matici z labu
  jako artefakt do jednání, ne názor proti názoru.
- „Umře Bot Framework?" — role Azure Bot Service se zúžila na registraci kanálu; ověřit
  aktuální stav před během.

## Vazby

- Zpět: toolchain z `onboarding`.
- Dopředu: osa se materializuje hned v `no-code-showcase` (agent builder + Copilot Studio
  naživo); rozhodnutí „custom engine" se realizuje v `agents-sdk-core`; deklarativního
  agenta student postaví v `declarative-agents` (D2), aby srovnání nezůstalo teoretické;
  governance vrstva mapy se otevře v `agent-365-governance` (D4).
- Nit rozhodování: tenhle blok → `knowledge-grounding` (kdy retrieval nedělat sám) →
  `agent-framework` (kdy multi-agent) → `event-driven-hosting` (kde to běží).

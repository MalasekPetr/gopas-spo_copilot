# Lab · Deklarativní Support Asistent v1 — kam až to jde bez kódu

> Modul: `declarative-agents` · Odhad: 65 min · Režim: **hands-on**
> Jazyk: JSON (+ TypeSpec ukázka) · Scénář: [`../../scenario-support-agent.md`](../../scenario-support-agent.md)

## Cíl

Provisionovaný **deklarativní Support Asistent v1** (instructions + knowledge) a vyplněná
tabulka stropu: co zvládl, co ne, a za jak dlouho byl hotový.

## Předpoklady

- Přihlášení v Agents Toolkitu (VS Code) účtem `user.NN@spdemo.online`.
- Knihovna `Runbooky` provisionovaná instruktorem v tenantu (viz [`../../scripts/`](../../scripts/)).
- Čtyři testovací dotazy ze scénáře po ruce.

## Kroky

### Část A — scaffold a instructions

1. V Toolkitu scaffoldni **deklarativního agenta** (šablona podle aktuální verze —
   instruktor promítá). Projdi strukturu projektu: manifest aplikace,
   `declarativeAgent.json`, `env/`.
2. Napiš instructions ze scénáře: role (IT support), scope (runbooky), tón, pravidlo
   odmítnutí mimo-scope dotazů. **Iteruj aspoň jednou** — první verze nikdy nesedí;
   obě verze si ponech, rozdíl je součást pointy.

### Část B — knowledge a capabilities

3. Zapoj knowledge: knihovna `Runbooky` přes capability **`OneDriveAndSharePoint`**
   (URL webu promítne instruktor).
4. Přidej jednu další capability podle aktuálního schématu (např. `WebSearch`) a napiš
   jednou větou, proč ji Support Asistent **chce, nebo nechce** — každá capability
   rozšiřuje, kam agent smí.

> [!IMPORTANT] Fragmenty níže ověř proti schématu, které máš v projektu
> Verze manifest schématu se mění po měsících. Autoritativní je hodnota `$schema`
> ve **tvém** scaffoldnutém `declarativeAgent.json` a IntelliSense ve VS Code —
> ne tenhle soubor. Když se název pole liší, platí schéma; fragmenty ber jako tvar,
> ne jako doslovný text.

**Kostra manifestu** — `name`, `description` a `instructions` jsou povinné jádro:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.7/schema.json",
  "version": "v1.7",
  "name": "Support Asistent v1",
  "description": "Odpovida na dotazy IT helpdesku z runbooku v knihovne Runbooky.",
  "instructions": "Jsi Support Asistent interniho IT helpdesku. Odpovidej vyhradne z runbooku v knihovne Runbooky a ke kazde odpovedi uved zdroj. Kdyz postup neexistuje nebo na dany pripad nestaci, rekni to otevrene a navrhni eskalaci na tiket. Nikdy si postup nedomyslej. Personalni, mzdove a osobni udaje zamestnancu jsou mimo tvuj rozsah.",
  "conversation_starters": [
    { "title": "Access denied", "text": "Nejde mi upload, hlasi access denied." },
    { "title": "SLA", "text": "Jaka je SLA na P1?" }
  ]
}
```

> [!NOTE] Instructions inline vs. v souboru
> Nahoře jsou instructions **přímo v manifestu** — funguje vždy a je to nejkratší cesta
> k běžícímu agentovi. Toolkit umí instructions i externalizovat do samostatného souboru,
> který se do manifestu vloží při buildu; tvar té reference se mezi verzemi Toolkitu lišil,
> takže ji ověř ve scaffoldnutém projektu (často je tam už předvyplněná). Pro delší
> instructions je externí soubor lepší — diff v PR je čitelný.
>
> Je to **tentýž text**, který jste psali do agent builderu v
> [`../../no-code-showcase/guide-agent-builder.md`](../../day-1/no-code-showcase/guide-agent-builder.md).
> Stejné zadání, jiná cesta — a odtud plyne zbytek srovnání.

**Knowledge — knihovna `Runbooky`** přes `items_by_url`. Scopovat jde na web, knihovnu,
složku i jednotlivý soubor; čím užší scope, tím míň má agent kam sáhnout:

```json
"capabilities": [
  {
    "name": "OneDriveAndSharePoint",
    "items_by_url": [
      { "url": "https://ms365x17157302.sharepoint.com/sites/hr-demo/Runbooky" }
    ]
  }
]
```

**Další capability** — `WebSearch` se scopem na konkrétní weby. Do stejného pole
`capabilities` jako druhý objekt:

```json
{
  "name": "WebSearch",
  "sites": [
    { "url": "https://learn.microsoft.com" }
  ]
}
```

> [!NOTE] Krok 4 chce jednu větu, ne kód
> Rozhodnutí je důležitější než syntaxe: **web search rozšiřuje scope mimo tenant.**
> U Support Asistenta to znamená, že odpověď na dotaz z runbooku může přijít z internetu
> a citace přestane být důkaz. Většina studentů ho po téhle úvaze vypne — a to je
> správný výsledek kroku.
>
> Že to není univerzální „vypni WebSearch", ukazuje **Normiqa Navigator** — publikovaný
> agent postavený v Toolkitu, jehož knowledge jsou **výhradně webové zdroje**. Nad veřejnou
> kurátorovanou doménou je to jediná správná volba. Capability se vybírá podle toho,
> co má agent dělat (viz [`README.md`](./README.md), sekce Strop deklarativní cesty).
>
> **Než zdroj zapojíš, ověř, že ho agent vůbec uvidí** — moderní JS weby vracejí crawleru
> prázdnou stránku. Postup v [`explainer-web-knowledge.md`](./explainer-web-knowledge.md).

**Manifest-only funkce** — tohle je hodnota Toolkitu proti agent builderu: pole, která
v žádném UI nenaklikáš. Vyzkoušej alespoň jedno:

```json
"behavior_overrides": {
  "special_instructions": {
    "discourage_model_knowledge": true
  }
}
```

```json
"editorial_answers": [
  {
    "trigger_phrases": ["SLA na P1", "jaka je SLA", "P1 sla"],
    "answer": "P1 = kriticky incident. Reakce do 15 minut, obnova do 4 hodin. Zdroj: runbook Incident P1."
  }
]
```

`discourage_model_knowledge` potlačí obecné znalosti modelu — agent má odpovídat z runbooků,
ne z toho, co „ví" o IT obecně. `editorial_answers` dává **předdefinovanou odpověď**
na známý dotaz (schéma umožňuje řádově stovky párů); u dotazu 2 je to levnější a
deterministické. Obojí ověř proti svému schématu — u `editorial_answers` zvlášť,
názvy podpolí se liší mezi verzemi.

> [!TIP] TypeSpec — tentýž manifest typovaně
> Místo ručního JSON jde agent definovat v **TypeSpec** a nechat ho zkompilovat do
> manifestu: typová kontrola, znovupoužitelné bloky a v PR čitelný diff místo hlídání
> závorek. Pro dnešní lab stačí JSON; koho to zajímá, najde postup v
> [Create declarative agents using TypeSpec](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents-typespec)
> — je to varianta zápisu, ne jiná cesta tvorby.

### Část C — provision a měření

5. **Provision** do tenantu; ověř, že agent je vidět v M365 Copilotu pod tvým účtem.
6. Pusť čtyři testovací dotazy ze scénáře; zaznamenej výsledek každého z nich
   a **celkový čas stavby** (od scaffoldu po první odpověď).

### Část D — strop

7. Vyplň tabulku stropu: dotazy 1–2 (zvládl — knowledge z Runbooků), dotaz 3 (akce
   s validací — **kde přesně** narazil), dotaz 4 (vynucené odmítnutí — co udělaly
   instructions a proč to není enforcement).
8. Odpověz písemně: co by se stalo, kdyby zákazník chtěl **pouze** deklarativního
   agenta? U jakých zadání by to úplně stačilo — a které body scénáře (3–5) by
   zůstaly neuzavřené?

## Ověření

- [ ] Deklarativní agent je provisionovaný a odpovídá v M365 Copilotu.
- [ ] Dotazy 1–2 zodpovězené z knihovny `Runbooky`.
- [ ] Vyplněná tabulka stropu včetně času stavby.
- [ ] Student umí **konkrétně** říct, co deklarativní agent na tomto zadání neuzavře
  (dotaz 3 a 4) — a u jakého zadání by naopak stačil.

## Fallback

- **Provisioning na PAYG nefunguje** (Microsoft to nedokumentuje, může se změnit):
  části A–B se odjedou beze změny lokálně (editace manifestu bez `Provision`), části C–D
  promítne instruktor ze svého běhu. Tabulka stropu zůstává platná — vede se
  o schopnostech, ne o běhu.
- Nestíhá se: část B krok 4 (extra capability) vypustit; strop (část D) je jádro,
  nepřeskakovat.

## Zdroje (Microsoft)

- [Create declarative agents using Microsoft 365 Agents Toolkit](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents)
- [Add capabilities and custom actions to a declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents-add-skills)
- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent)
- [Create declarative agents using TypeSpec](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents-typespec) — typovaná alternativa k ručnímu JSON
- [Declarative agent manifest — reference](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.7) — autoritativní seznam polí; **ověř verzi proti `$schema` ve svém projektu**

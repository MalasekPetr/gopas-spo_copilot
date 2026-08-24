# Instructor notes — Action handlers & integrace s Microsoft Graph

## Timing

- ~60 min výklad + 75 min lab.
- Část D (app-only protipříklad) je jen ~10 min a je to **nejsilnější moment labu**.
  Když čas tlačí, udělat ji jako demo, ale nevynechávat.

## Go/no-go — KLÍČOVÉ, otestovat před během

- Ověřit, které **Graph permissions** studentský účet (Business Basic, ne admin) reálně
  dostane a co s nimi lze v labu přečíst. Pokud nic užitečného, připravit mock Graph endpoint
  jako primární variantu, ne jako fallback.
- Mock ticket API v `solution/` musí běžet na čistém stroji (port, Node verze).
- Připravit app-only konfiguraci pro část D **dopředu** — improvizovat app registraci
  před 20 lidmi se nedělá. App-only credentials se studentům **rozdávají** (rozhodnutí
  autora 2026-08-06; demo tenant, jen fiktivní data): secret s krátkou platností,
  **po kurzu rotovat/zneplatnit** a app registraci uklidit. Ověření labu drží, že po
  části D je app-only režim vypnutý.
- Ověřit aktuální stav **Entra Agent ID**: dostává agent v tomto scénáři Agent ID automaticky,
  nebo se registruje ručně? Mění to formulaci ve výkladu.

## Tripwires

- **Studenti vezmou žadatele z návrhu modelu.** Skoro všichni. Nechat je to udělat, pak jim
  to v části C rozbít. Je to nejlépe zapamatovatelná lekce dne a bez toho pokusu nefunguje.
- „Model přece nebude lhát o parametrech" — ukázat, že nejde o lhaní modelu, ale o **prompt
  injection přes obsah** (naváže `security-risk` v D5). Model je jen kanál.
- Záměna **autorizace agenta** a **autorizace akce**. Agent smí volat Graph ≠ tenhle uživatel
  smí tuhle věc. Autorizace patří do akce.
- App-only se studentům zalíbí, protože „funguje". Zdůraznit, že to je přesně ta pohodlnost,
  která v produkci exfiltruje. A **zkontrolovat, že to po části D vypnuli.**
- Nezabíhat do middleware — filtrování výstupů je [`../../day-3/middleware-policy/`](../../day-3/middleware-policy/).
  Tady řešíme vstup do akce, ne výstup z agenta.

## Vazby

- Zpět: knowledge z `knowledge-grounding`; chybové větve z `agents-sdk-core` se tady
  rozšiřují na Graph (429/Retry-After, 403, 404).
- Dopředu: `middleware-policy` (výstupní filtry — druhá polovina obrany),
  `agent-365-governance` (Entra Agent ID, audit akcí, instrumentace),
  `security-risk` (prompt injection míří přesně na tyto akce).
- Governance nit: tady začíná. Hranice oprávnění → middleware → Agent 365 → scope minimalizace.

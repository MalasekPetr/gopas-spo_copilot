# Instructor notes — SharePoint agents

## Go/no-go

- **Tvorba = Copilot licence** → jen instruktorské demo, nezakládat na tom studentský lab. Studenti sledují + predikují.
- Testovací web s knihovnou `Smlouvy` připravený (data z `New-HRAgentData.ps1`).

## Tripwires

- **1 zdroj a nic jiného** (MC1255409) — nosná pointa; přidání listu shodí knihovnu, ukázat naživo.
- Nezaměnit „SharePoint agent" (na webu, deklarativní) s **Copilot in SharePoint / Skills** (D5; ty na PAYG empiricky fungují — na rozdíl od tvorby SP agenta) — jiná věc.
- Docs lag k listům (GA ~05/2026, admin docs to k 06/2026 neuváděly) — dobrý příklad „ověř stav k datu běhu".

## Vazby

- Zpět: Agent Builder (předchozí blok), mapa cest a srovnání ([`../../day-1/agent-landscape/`](../../day-1/agent-landscape/)).
- Dopředu: Agents Toolkit (agent jako kód); správa/registr agentů → D5 `copilot-admin`.

# Provozní skripty kurzu SPO_COPILOT

Automatizace životního cyklu kurzovního tenantu: provisioning studentů → demo data pro
nosný scénář → offboarding. Všechny skripty jsou idempotentní (bezpečné spustit opakovaně)
a podporují `-WhatIf` (dry-run).

> [!IMPORTANT] Identifikátory
> Repo je public. **Žádný skript nemá zabudované identifikátory** — tenant GUID, ClientId
> aplikací, cert thumbprint, subscription ID ani API klíče se předávají výhradně parametry
> na příkazové řádce. Nikdy je sem nedoplňujte ani necommitujte výstupy s hesly
> (`student-credentials.csv` je gitignored).

> [!WARNING] Stav — Fáze 1
> Skripty samotné se **adaptují z repa `gopas-goc224`** (`scripts/`) při rozpracování
> do plné hloubky. Tento README popisuje cílový stav a rozdíly proti GOC224.

## Životní cyklus kurzu

| Fáze | Skript | API | Stav |
|---|---|---|---|
| 1. Účty studentů (vytvoření/reaktivace, licence, skupina) | `New-CourseStudents.ps1` | Graph | adaptovat z GOC224 |
| 2. Demo data pro nosný scénář (knihovna `Runbooky`, HR list) | `New-SupportAgentData.ps1` | PnP | adaptovat z `New-HRAgentData.ps1` |
| 3. Offboarding — smazání obsahu a artefaktů studentů | `Remove-CourseStudentData.ps1` | Graph + PnP | adaptovat z GOC224 |
| 4. Offboarding — disable sign-in + uvolnění licencí | `Disable-CourseStudents.ps1` | Graph | adaptovat z GOC224 |

Pořadí offboardingu: **nejdřív 3, pak 4** — mazání OneDrive obsahu vyžaduje ještě
licencované účty.

## Rozdíly proti administrátorským kurzům

Tenhle kurz je pro-code, což mění offboarding i přípravu:

| Oblast | Dopad |
|---|---|
| **Model endpoint** | Klíče k modelu rozdává instruktor mimo repo. Po kurzu **rotovat nebo zneplatnit** (viz [`../environment.md`](../environment.md)). Skript to nepokrývá — je to ruční krok. |
| **Azure resources** | Tři bloky jsou instruktorské demo v Azure (Functions, Foundry/AI Search, Agent 365). **Cleanup resource group po kurzu** — jinak demo prostředí dál platí. |
| **App registrace studentů** | Studenti v labech app registrace nezakládají (delegated identita), ale pokud si nějakou vytvoří, `Remove-CourseStudentData.ps1` ji vypíše v reportu. |
| **Publikovaní agenti** | Deklarativní agenti provisionovaní studenty (D3) zůstávají v tenantu — smazat v Microsoft 365 admin centru → Integrated apps. |
| **Studentské repo** | Kód studentů žije lokálně / v jejich vlastním gitu. Nic se necentralizuje. |

## Offboarding — co skripty nepokryjí (ruční kroky)

1. **Rotace / zneplatnění klíčů k model endpointu** — kurz jede na instruktorském Foundry
   deploymentu (rozhodnuto 2026-08-24), klíče byly rozdané 20 lidem.
2. **Cleanup Azure resource group** pro instruktorská dema (Functions, AI Search, Foundry).
3. **PAYG spending policies**: Microsoft 365 admin center → Copilot → Cost Management.
4. **Deklarativní agenti**: Microsoft 365 admin center → Integrated apps.
5. **Agenti v Agent 365 registry** (pokud demo jelo s licencí) — deprovisioning identity.

## Demo data

`New-SupportAgentData.ps1` vytváří podklad nosného scénáře
([`../scenario-support-agent.md`](../scenario-support-agent.md)):
knihovnu `Runbooky` se čtyřmi postupy a HR list. **Výhradně fiktivní data.**

> [!IMPORTANT] Nikdy reálná data
> Instruktorský model endpoint znamená inference **mimo studentský tenant**. Do demo dat
> nikdy nepatří reálná personální ani zákaznická data — ani jako „nepodstatný" vzorek.

Datumové údaje jsou offsety vůči `-ReferenceDate`, takže edge-cases zůstávají platné
při každém běhu kurzu.

## Přihlašování

Skripty přebírají model z GOC224 — tři režimy:

1. **Interactive** (default) — browser/WAM popup.
2. **`-UseDeviceCode`** — kód zadáte v libovolném browseru/profilu.
3. **`-CertificateThumbprint` + `-ClientId` + `-TenantId`** — app-only, doporučeno pro
   dávkové operace (offboarding = 20+ připojení).

Detail požadovaných Graph a SharePoint permissions viz `scripts/README.md` v repu
`gopas-goc224` — přebírá se beze změny.

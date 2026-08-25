# Explainer · Proč agent na některých webech „nic nenajde"

> Modul: `declarative-agents` · Typ: deep-dive k capability `WebSearch`
> Prostředí: viz [`../../environment.md`](../environment.md) · Názvosloví: [`../../GLOSSARY.md`](../GLOSSARY.md)

Když je knowledge agenta **web**, přestává platit „co vidím v prohlížeči, to uvidí agent".
Agent nečte stránku — čte to, co z ní zbylo po crawleru. Tenhle rozdíl rozhoduje o tom,
jestli deklarativní agent nad webovými zdroji funguje, nebo tiše vrací nesmysly.

## Dvě různá selhání, která se pletou

| | Není v indexu | Je v indexu, ale špatně dohledatelný |
|---|---|---|
| **Projev** | agent zdroj nikdy neuvede | agent cituje, ale mimo mísu; odpověď je vágní |
| **Příčina** | crawler se k obsahu nedostal | crawler dostal málo nebo nestrukturovaný text |
| **Test** | `site:` dotaz nevrátí nic | `site:` vrátí URL, ale snippet je prázdný nebo generický |

Studenti hlásí většinou to druhé jako „agent halucinuje". Nehalucinuje — dostal chudý
podklad a doplnil zbytek.

## Proč se crawler k obsahu nedostane

### 1. Client-side rendering (nejčastější příčina)

Server vrátí prázdnou kostru, obsah domalují až JavaScript a fetch v prohlížeči. Crawler,
který JS nespouští, nevidí nic.

**Živý příklad z našeho vlastního webu** — produktová stránka Normiqa Navigatoru
(`malachis.eu`, React SPA) vrací:

- HTTP 200, 17 kB HTML,
- **11 server-side meta tagů** (description, og:, twitter:) — sdílení na sítích funguje,
- ale v `<body>` je přesně **9 slov**: *„You need to enable JavaScript to run this app."*
- a **žádný `<title>`**.

Crawler bez JS tedy zná popisek stránky, ale ne její obsah. Prohlížeč přitom ukáže
kompletní stránku — proto se na tohle nepřijde okem.

### 2. Bot protection a WAF

Stránka jde otevřít v prohlížeči, ale automatizovaný klient dostane 403. **Marketplace
listing Normiqa Navigatoru** se chová přesně takhle: prohlížečová `User-Agent` hlavička
vrátí 200, `curl` dostane 403.

> [!NOTE] Test přes User-Agent není důkaz o skutečném crawleru
> Podvržená hlavička `bingbot` taky dostala 403 — ale to nic nedokazuje. Skutečný Bingbot
> se ověřuje **reverzním DNS**, ne řetězcem, takže web může blokovat podvrhy a pravého
> bota pouštět. Z UA testu se pozná jen to, že **nějaká** ochrana existuje.

### 3. robots.txt a noindex

Explicitní zákaz. `robots.txt` řídí *crawl*, `<meta name="robots" content="noindex">`
a hlavička `X-Robots-Tag` řídí *indexaci* — stránka se stáhne, ale do indexu nejde.
Obojí se hlídá zvlášť.

### 4. Autentizace a paywall

Obsah za přihlášením crawler nevidí. Platí i pro „měkké" zdi typu souhlas s cookies,
který blokuje vykreslení.

### 5. Text, který není text

PDF bez textové vrstvy, obsah v obrázcích, `<canvas>`, video bez přepisu. Stránka
se načte, extrahovatelný text je nulový.

### 6. Chudá struktura

Indexováno, ale bez `<title>`, bez `<h1>`–`<h3>`, bez sémantických odstavců. Retrieval
nemá co chytit a vrátí buď nic, nebo celou stránku bez ohledu na dotaz.

### 7. Sirotčí stránky

Na URL nic neodkazuje a chybí v sitemapě. Crawler o ní neví, i když je veřejná.

## Jak to ověřit

Postupuj odshora — první tři kroky odhalí většinu případů.

### Krok 1 — co dostane klient bez JavaScriptu

```bash
# Kolik VIDITELNEHO textu je v body? Pod ~50 slov = skoro jiste SPA.
curl -sL -A "Mozilla/5.0" "https://priklad.cz/stranka" -o /tmp/p.html
perl -0777 -pe 's/<script.*?<\/script>//gs; s/<style.*?<\/style>//gs' /tmp/p.html \
  | perl -0777 -pe 's/.*<body[^>]*>//s' | sed 's/<[^>]*>/ /g' | wc -w

# Ma stranka title a description?
grep -oiE '<title[^>]*>[^<]*|<meta name="description"[^>]*' /tmp/p.html
```

V prohlížeči totéž rychleji: **Ctrl+U** (zdroj stránky) vs. **F12 → Elements**.
Rozdíl mezi nimi **je** ta část, kterou dodělal JavaScript — a kterou crawler bez JS nevidí.

### Krok 2 — pravidla pro roboty

```bash
curl -s https://priklad.cz/robots.txt
curl -s -o /dev/null -w "sitemap: %{http_code}\n" https://priklad.cz/sitemap.xml
curl -s -o /dev/null -w "llms.txt: %{http_code}\n" https://priklad.cz/llms.txt
curl -sI https://priklad.cz/stranka | grep -i x-robots-tag
```

### Krok 3 — chová se web jinak k botům?

```bash
for ua in "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "curl/8"; do
  echo "$(curl -sL -o /dev/null -w '%{http_code}' -A "$ua" https://priklad.cz/stranka)  <- $ua"
done
```

Rozdílné kódy = ochrana proti botům. Stejné kódy = problém je jinde.

### Krok 4 — je to v indexu, ze kterého agent čerpá

Web search v Copilotu staví na **Bingu**, ne na Googlu — testuj tam:

- `site:priklad.cz` — je doména v indexu vůbec?
- `site:priklad.cz/konkretni-stranka` — je tam **ta** stránka?
- Prázdný nebo generický snippet = indexováno, ale chudý obsah (druhý sloupec tabulky výš).

Pro vlastní doménu je autoritativní **Bing Webmaster Tools**: URL inspection ukáže, co
crawler skutečně stáhl, a index coverage řekne, co bylo vyřazeno a proč.

### Krok 5 — zeptej se agenta

Poslední kontrola je provozní: polož agentovi dotaz, jehož odpověď je **jen** na té
stránce, a podívej se na citace. Když necituje ji, nemá ji.

## Co s tím, když je zdroj tvůj

- **Server-side rendering nebo prerendering** pro crawlery — jediná skutečná oprava SPA.
- **Doplnit `<title>` a strukturu nadpisů**; meta description samotný obsah nenahradí.
- **`llms.txt`** — vznikající konvence: kurátorovaná mapa weba pro LLM klienty v Markdownu.
  Neřeší crawlovatelnost stránek, ale dá modelu strukturovaný přehled a odkazy.
  Malach IS ho má na `malachis.eu/llms.txt`.
- **Sitemapa** a interní prolinkování proti sirotkům.

## Co s tím, když je zdroj cizí

Nemůžeš ho opravit — musíš to **zjistit dopředu a navrhnout podle toho architekturu**:

- zdroj je nedostupný pro crawler → **web search není cesta**; zvaž vlastní ingestion
  (Copilot connector) nebo obsah replikovat do tenantu se souhlasem vlastníka;
- zdroj je chudý → agent bude odpovídat vágně; buď sniž očekávání, nebo přidej vlastní
  kurátorovaný podklad;
- zdroj je za autentizací → potřebuješ akci s vlastními credentials, ne knowledge.

> [!IMPORTANT] Nejdražší chyba je zjistit to až po nasazení
> Ověření zdrojů patří do **návrhu**, ne do ladění. Deklarativní agent nad webem se postaví
> za hodinu — a když jsou zdroje neviditelné, hodinu ladíš instructions místo toho,
> abys změnil zdroj.

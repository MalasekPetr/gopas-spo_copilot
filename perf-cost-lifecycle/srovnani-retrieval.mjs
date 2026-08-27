// ============================================================================
// Srovnani dvou groundingovych cest na TECHZE dotazech, TEMZE promptu a TEMZE modelu.
//
//   A) Graph Search   = prepis dotazu modelem -> KQL -> /search/query -> stazeni obsahu
//   B) Retrieval API  = jedno volani, semanticke chunky
//
// Meri tri veci, ktere se v labu tvrdily, ale nemerily:
//   1. VYKON  - latence retrievalu i celeho turnu, pocet HTTP volani
//   2. CENA   - volani modelu, in/out/reasoning tokeny, prepocet na USD dle ceniku
//   3. KVALITA- odpoved obou cest na tentyz dotaz + verdikt LLM soudce
//
// Spusteni z C:/Repos/GOPAS/PMApp:
//   node <klon-repa>/perf-cost-lifecycle/srovnani-retrieval.mjs \
//        --token-search .lab-token-user15 --token-retrieval .explorer-token
//
// Dva tokeny zamerne: kazda cesta muze potrebovat jinou app registraci
// (zmereno 27. 8. - viz knowledge-grounding/instructor-notes.md). Kdyz das jen
// --token-search, pouzije se pro obe.
//
//   --dotazy 2      jen prvni dva dotazy (rychly beh)
//   --bez-soudce    preskoci kvalitativni hodnoceni (usetri tokeny)
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from "node:fs";

// --- argumenty ----------------------------------------------------------------
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const TOKEN_SEARCH_F = arg("--token-search", ".lab-token");
const TOKEN_RETRIEVAL_F = arg("--token-retrieval", TOKEN_SEARCH_F);
const LIMIT = Number(arg("--dotazy", "0"));
const BEZ_SOUDCE = process.argv.includes("--bez-soudce");

const RUNBOOKY_PATH = "https://ms365x17157302.sharepoint.com/sites/hr-demo/Runbooky";
const CENIK = { in: 0.2416, cached: 0.0242, out: 1.9330 }; // gpt-5-mini, USD / 1M

const DOTAZY = [
  { id: "K1", q: "Nejde mi upload, hlásí access denied.",
    ocekavani: "Shrne postup z runbooku (oprávnění Contribute, unique permissions, povinné sloupce) a cituje zdroj. NESMÍ vymýšlet kroky, které v podkladu nejsou." },
  { id: "K2", q: "Jaká je SLA na P1?",
    ocekavani: "Uvede reakční dobu a dobu řešení z runbooku a cituje zdroj. NESMÍ vymýšlet čísla." },
  { id: "K3", q: "Tiskárna netiskne a runbook nepomohl.",
    ocekavani: "Nabídne eskalaci nebo založení tiketu. NESMÍ předstírat, že problém vyřešil." },
  { id: "K4", q: "Kdo jsem?",
    ocekavani: "Řekne, že na identitu runbooky nejsou, nebo se zeptá. NESMÍ odpovídat obsahem runbooku o resetu hesla — to je falešná shoda." },
].slice(0, LIMIT || 99);

// --- tokeny --------------------------------------------------------------------
function nactiToken(f) {
  if (!existsSync(f)) { console.error(`Chybi token: ${f}`); process.exit(1); }
  const raw = readFileSync(f);
  const t = (raw[0] === 0xff && raw[1] === 0xfe ? raw.toString("utf16le") : raw.toString("utf8")).replace(/^\uFEFF/, "").trim();
  const p = JSON.parse(Buffer.from(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  if (p.exp * 1000 < Date.now()) { console.error(`Token ${f} vyprsel.`); process.exit(1); }
  return { t, ucet: p.upn ?? p.preferred_username, appid: p.appid, min: Math.round((p.exp * 1000 - Date.now()) / 60000) };
}
const TS = nactiToken(TOKEN_SEARCH_F);
const TR = nactiToken(TOKEN_RETRIEVAL_F);
console.log(`Graph Search  : ${TS.ucet} (app ${TS.appid.slice(0, 8)}…, ${TS.min} min)`);
console.log(`Retrieval API : ${TR.ucet} (app ${TR.appid.slice(0, 8)}…, ${TR.min} min)\n`);

// --- model ---------------------------------------------------------------------
const cfg = Object.fromEntries(
  readFileSync(".localConfigs.playground", "utf8").split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const OA = `${cfg.AZURE_OPENAI_ENDPOINT}/openai/deployments/${cfg.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-12-01-preview`;

const ucet = { volani: 0, in: 0, out: 0, reasoning: 0 };
async function model(messages, kdo) {
  const r = await fetch(OA, {
    method: "POST",
    headers: { "api-key": cfg.AZURE_OPENAI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ messages, max_completion_tokens: 2500 }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!r.ok) throw new Error(`model ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  const u = d.usage ?? {};
  ucet.volani++; ucet.in += u.prompt_tokens ?? 0; ucet.out += u.completion_tokens ?? 0;
  ucet.reasoning += u.completion_tokens_details?.reasoning_tokens ?? 0;
  return {
    text: d.choices[0]?.message?.content ?? "",
    in: u.prompt_tokens ?? 0, out: u.completion_tokens ?? 0,
    reasoning: u.completion_tokens_details?.reasoning_tokens ?? 0,
    kdo,
  };
}
const usd = (o) => (o.in * CENIK.in + o.out * CENIK.out) / 1e6;

const SYSTEM = [
  "Jsi IT support asistent firmy. Odpovídáš česky, stručně a věcně.",
  "Podklady z runbooků použij JEN tehdy, když odpovídají na položený dotaz — pak odpověz přímo z nich:",
  "shrň postup a pod odpověď vypiš citace ve tvaru [číslo] název — odkaz.",
  "Když odpověď v podkladech není, řekni to a nabídni eskalaci na technika.",
  "Nikdy si nedomýšlej postup ani čísla.",
].join(" ");

// --- A) Graph Search -----------------------------------------------------------
async function cestaA(dotaz) {
  const t0 = Date.now();
  const r = await model([
    { role: "system", content: "Z dotazu vytvoř 2-5 klíčových slov pro fulltextové vyhledávání. Vrať POUZE slova oddělená mezerou, bez interpunkce a bez vysvětlení." },
    { role: "user", content: dotaz },
  ], "prepis");
  const words = r.text.trim().replace(/[".,'\n]/g, " ").split(/\s+/).filter(Boolean);
  const kql = words.length ? `(${words.join(" OR ")}) AND path:"${RUNBOOKY_PATH}"` : "";
  let http = 1;

  let hits = [];
  if (kql) {
    const sr = await fetch("https://graph.microsoft.com/v1.0/search/query", {
      method: "POST",
      headers: { Authorization: `Bearer ${TS.t}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests: [{ entityTypes: ["driveItem"], query: { queryString: kql }, size: 3, fields: ["name", "webUrl", "parentReference", "id"] }] }),
      signal: AbortSignal.timeout(30_000),
    });
    http++;
    if (!sr.ok) throw new Error(`Graph Search ${sr.status}`);
    const found = (await sr.json()).value?.[0]?.hitsContainers?.[0]?.hits ?? [];
    for (const h of found) {
      const it = h.resource;
      const cr = await fetch(`https://graph.microsoft.com/v1.0/drives/${it.parentReference.driveId}/items/${it.id}/content`,
        { headers: { Authorization: `Bearer ${TS.t}` }, signal: AbortSignal.timeout(30_000) });
      http++;
      if (cr.ok) hits.push({ title: it.name, url: it.webUrl, text: (await cr.text()).slice(0, 3000) });
    }
  }
  return { hits, msRetrieval: Date.now() - t0, http, prepis: r, kql };
}

// --- B) Retrieval API ----------------------------------------------------------
async function cestaB(dotaz) {
  const t0 = Date.now();
  const r = await fetch("https://graph.microsoft.com/v1.0/copilot/retrieval", {
    method: "POST",
    headers: { Authorization: `Bearer ${TR.t}`, "Content-Type": "application/json" },
    body: JSON.stringify({ queryString: dotaz, dataSource: "sharePoint", maximumNumberOfResults: 3 }),
    signal: AbortSignal.timeout(60_000),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Retrieval API ${r.status}: ${txt.slice(0, 200)}`);
  const hits = (JSON.parse(txt).retrievalHits ?? []).map((h) => ({
    title: h.resourceMetadata?.title ?? h.webUrl?.split("/").pop() ?? "?",
    url: h.webUrl,
    text: (h.extracts ?? []).map((e) => e.text).join("\n"),
    skore: h.extracts?.[0]?.relevanceScore ?? null,
  }));
  return { hits, msRetrieval: Date.now() - t0, http: 1, prepis: null };
}

// --- odpoved agenta ------------------------------------------------------------
async function odpoved(dotaz, hits, kdo) {
  const knowledge = hits.length
    ? "Podklady z runbooků:\n\n" + hits.map((h, i) => `[${i + 1}] ${h.title} — ${h.url}\n${h.text}`).join("\n\n")
    : "Podklady z runbooků: žádný runbook k dotazu nenalezen.";
  return model([
    { role: "system", content: SYSTEM },
    { role: "user", content: dotaz },
    { role: "user", content: knowledge },
  ], kdo);
}

// --- soudce --------------------------------------------------------------------
const JUDGE = "Jsi přísný hodnotitel odpovědí IT asistenta. Dostaneš OČEKÁVANÉ CHOVÁNÍ a dvě odpovědi, A a B. "
  + 'Vrať POUZE JSON: {"a_splneno":true|false,"b_splneno":true|false,"lepsi":"A"|"B"|"remiza","duvod":"jedna veta"}.';

async function soudce(ocekavani, a, b) {
  const r = await fetch(OA, {
    method: "POST",
    headers: { "api-key": cfg.AZURE_OPENAI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: JUDGE },
        { role: "user", content: `OČEKÁVANÉ CHOVÁNÍ:\n${ocekavani}\n\nODPOVĚĎ A:\n${a}\n\nODPOVĚĎ B:\n${b}` },
      ],
      max_completion_tokens: 1500,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!r.ok) throw new Error(`soudce ${r.status}`);
  const d = await r.json();
  ucet.volani++; ucet.in += d.usage?.prompt_tokens ?? 0; ucet.out += d.usage?.completion_tokens ?? 0;
  return JSON.parse(d.choices[0].message.content);
}

// --- beh ------------------------------------------------------------------------
const vysledky = [];
for (const d of DOTAZY) {
  console.log(`\n═══ ${d.id}  "${d.q}"`);
  const zaznam = { ...d };

  for (const [klic, fn, jmeno] of [["a", cestaA, "Graph Search "], ["b", cestaB, "Retrieval API"]]) {
    try {
      const t0 = Date.now();
      const ret = await fn(d.q);
      const odp = await odpoved(d.q, ret.hits, klic);
      const msCelkem = Date.now() - t0;
      const tokeny = {
        in: (ret.prepis?.in ?? 0) + odp.in,
        out: (ret.prepis?.out ?? 0) + odp.out,
        reasoning: (ret.prepis?.reasoning ?? 0) + odp.reasoning,
      };
      zaznam[klic] = {
        hits: ret.hits.map((h) => h.title), skore: ret.hits.map((h) => h.skore ?? null),
        msRetrieval: ret.msRetrieval, msCelkem, http: ret.http,
        volaniModelu: ret.prepis ? 2 : 1, tokeny, usd: usd(tokeny),
        odpoved: odp.text,
      };
      console.log(`  ${jmeno}: ${ret.hits.length} hitu · retrieval ${ret.msRetrieval} ms · turn ${msCelkem} ms · ${zaznam[klic].volaniModelu} volani modelu · ${tokeny.in}/${tokeny.out} tok · $${usd(tokeny).toFixed(5)}`);
      console.log(`                  [${ret.hits.map((h) => h.title).join(", ") || "-"}]`);
    } catch (e) {
      zaznam[klic] = { chyba: String(e.message) };
      console.log(`  ${jmeno}: CHYBA ${e.message}`);
    }
  }

  if (!BEZ_SOUDCE && zaznam.a?.odpoved && zaznam.b?.odpoved) {
    try {
      zaznam.verdikt = await soudce(d.ocekavani, zaznam.a.odpoved, zaznam.b.odpoved);
      console.log(`  soudce       : A=${zaznam.verdikt.a_splneno ? "ok" : "FAIL"} B=${zaznam.verdikt.b_splneno ? "ok" : "FAIL"} · lepsi: ${zaznam.verdikt.lepsi} · ${zaznam.verdikt.duvod}`);
    } catch (e) { console.log(`  soudce       : CHYBA ${e.message}`); }
  }
  vysledky.push(zaznam);
}

// --- souhrn ----------------------------------------------------------------------
const ok = (k) => vysledky.filter((v) => v[k] && !v[k].chyba);
const sum = (k, f) => ok(k).reduce((s, v) => s + f(v[k]), 0);
const prum = (k, f) => ok(k).length ? sum(k, f) / ok(k).length : 0;

console.log("\n\n═══════ SOUHRN ═══════\n");
console.table([
  { metrika: "hitů celkem", "Graph Search": sum("a", (x) => x.hits.length), "Retrieval API": sum("b", (x) => x.hits.length) },
  { metrika: "volání modelu / dotaz", "Graph Search": prum("a", (x) => x.volaniModelu).toFixed(2), "Retrieval API": prum("b", (x) => x.volaniModelu).toFixed(2) },
  { metrika: "HTTP volání / dotaz", "Graph Search": prum("a", (x) => x.http).toFixed(2), "Retrieval API": prum("b", (x) => x.http).toFixed(2) },
  { metrika: "latence retrievalu (ms)", "Graph Search": Math.round(prum("a", (x) => x.msRetrieval)), "Retrieval API": Math.round(prum("b", (x) => x.msRetrieval)) },
  { metrika: "latence turnu (ms)", "Graph Search": Math.round(prum("a", (x) => x.msCelkem)), "Retrieval API": Math.round(prum("b", (x) => x.msCelkem)) },
  { metrika: "vstupní tokeny / dotaz", "Graph Search": Math.round(prum("a", (x) => x.tokeny.in)), "Retrieval API": Math.round(prum("b", (x) => x.tokeny.in)) },
  { metrika: "výstupní tokeny / dotaz", "Graph Search": Math.round(prum("a", (x) => x.tokeny.out)), "Retrieval API": Math.round(prum("b", (x) => x.tokeny.out)) },
  { metrika: "USD / dotaz", "Graph Search": prum("a", (x) => x.usd).toFixed(5), "Retrieval API": prum("b", (x) => x.usd).toFixed(5) },
]);

const v = vysledky.filter((x) => x.verdikt);
if (v.length) {
  console.log(`\nKvalita (LLM soudce, ${v.length} dotazů):`);
  console.log(`  A Graph Search  splnilo: ${v.filter((x) => x.verdikt.a_splneno).length}/${v.length}`);
  console.log(`  B Retrieval API splnilo: ${v.filter((x) => x.verdikt.b_splneno).length}/${v.length}`);
  const skore = { A: 0, B: 0, remiza: 0 };
  v.forEach((x) => skore[x.verdikt.lepsi] !== undefined && skore[x.verdikt.lepsi]++);
  console.log(`  lepší: A ${skore.A}× · B ${skore.B}× · remíza ${skore.remiza}×`);
}

const mesic = (u) => u * 200 * 1 * 21; // 200 uzivatelu, 1 dotaz/den, 21 dnu
console.log(`\nPrepocet na mesic (200 uzivatelu x 1 dotaz/den x 21 dnu):`);
console.log(`  Graph Search : $${mesic(prum("a", (x) => x.usd)).toFixed(2)}`);
console.log(`  Retrieval API: $${mesic(prum("b", (x) => x.usd)).toFixed(2)}  (+ cena Retrieval API dle PAYG, neni v tokenech)`);
console.log(`\nCelkem za beh: ${ucet.volani} volani modelu, ${ucet.in} in / ${ucet.out} out (z toho ${ucet.reasoning} reasoning)`);

writeFileSync("srovnani-retrieval.json", JSON.stringify({
  bezel: new Date().toISOString(),
  tokeny: { search: { ucet: TS.ucet, app: TS.appid }, retrieval: { ucet: TR.ucet, app: TR.appid } },
  cenik: CENIK, ucetCelkem: ucet, vysledky,
}, null, 2));
console.log("\nDetail (vcetne plnych odpovedi) v srovnani-retrieval.json");

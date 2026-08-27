// ============================================================================
// Srovnani TRI groundingovych cest na techze dotazech, promptu a modelu.
//
//   A) Graph Search      /v1.0/search/query      - prepis dotazu modelem -> KQL
//                                                  -> hledani -> stazeni obsahu
//   B) Retrieval API     /v1.0/copilot/retrieval - jedno volani, vraci chunky
//   C) Copilot Search    /beta/copilot/search    - jedno volani, vraci previews
//
// Meri vykon (latence, HTTP volani, volani modelu), cenu (tokeny -> USD dle
// ceniku) a kvalitu (LLM soudce porovna vsechny tri odpovedi najednou).
//
// POZOR NA JEDEN BEH: 27. 8. bylo zmereno, ze cena a latence kolisaji do 4 %,
// ale tri ze ctyr verdiktu soudce se mezi dvema behy otocily. Proto se sada
// pousti VICEKRAT a agreguje - jeden beh je vzorek, ne mereni.
//
// Spusteni z C:/Repos/GOPAS/PMApp:
//   node <klon-repa>/day-5/perf-cost-lifecycle/srovnani-tri-api.mjs --token .explorer-token
//
//   --behy 3        kolikrat projet celou sadu (vychozi 2)
//   --dotazy 2      omezit pocet dotazu
//   --bez-soudce    preskocit kvalitativni hodnoceni
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const TOKEN_F = arg("--token", ".lab-token");
const BEHY = Number(arg("--behy", "2"));
const LIMIT = Number(arg("--dotazy", "0"));
const BEZ_SOUDCE = process.argv.includes("--bez-soudce");

const PATH = "https://ms365x17157302.sharepoint.com/sites/hr-demo/Runbooky";
const CENIK = { in: 0.2416, out: 1.9330 }; // gpt-5-mini, USD / 1M

const DOTAZY = [
  { id: "K1", q: "Nejde mi upload, hlásí access denied.",
    ocekavani: "Shrne postup z runbooku (oprávnění Contribute, unique permissions, povinné sloupce) a cituje zdroj. NESMÍ vymýšlet kroky, které v podkladu nejsou." },
  { id: "K2", q: "Jaká je SLA na P1?",
    ocekavani: "Uvede reakční dobu a dobu řešení z runbooku a cituje zdroj. NESMÍ vymýšlet čísla." },
  { id: "K3", q: "Tiskárna netiskne a runbook nepomohl.",
    ocekavani: "Nabídne eskalaci nebo založení tiketu. NESMÍ předstírat, že problém vyřešil." },
  { id: "K4", q: "Kdo jsem?",
    ocekavani: "Řekne, že na identitu runbooky nejsou, nebo se doptá. NESMÍ odpovídat obsahem runbooku o resetu hesla — to je falešná shoda." },
].slice(0, LIMIT || 99);

// --- token --------------------------------------------------------------------
if (!existsSync(TOKEN_F)) { console.error(`Chybi token: ${TOKEN_F}`); process.exit(1); }
const raw = readFileSync(TOKEN_F);
const T = (raw[0] === 0xff && raw[1] === 0xfe ? raw.toString("utf16le") : raw.toString("utf8")).replace(/^\uFEFF/, "").trim();
const cl = JSON.parse(Buffer.from(T.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
if (cl.exp * 1000 < Date.now()) { console.error("Token vyprsel."); process.exit(1); }

// Accept-Language je POVINNA pro /copilot/retrieval (zmereno 27. 8.) - bez ni
// vraci 200 a prazdno bez chyby. U ostatnich dvou nevadi, tak ji posilame vsude.
const H = { Authorization: "Bearer " + T, "Content-Type": "application/json", "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8" };

console.log(`Ucet: ${cl.upn ?? cl.preferred_username} · beh sady ${BEHY}x · ${DOTAZY.length} dotazu\n`);

// --- model --------------------------------------------------------------------
const cfg = Object.fromEntries(
  readFileSync(".localConfigs.playground", "utf8").split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const OA = `${cfg.AZURE_OPENAI_ENDPOINT}/openai/deployments/${cfg.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-12-01-preview`;

let modelCelkem = { volani: 0, in: 0, out: 0 };
async function model(messages, json = false) {
  const r = await fetch(OA, {
    method: "POST",
    headers: { "api-key": cfg.AZURE_OPENAI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ messages, max_completion_tokens: 2500, ...(json ? { response_format: { type: "json_object" } } : {}) }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!r.ok) throw new Error(`model ${r.status}: ${(await r.text()).slice(0, 160)}`);
  const d = await r.json();
  const u = d.usage ?? {};
  modelCelkem.volani++; modelCelkem.in += u.prompt_tokens ?? 0; modelCelkem.out += u.completion_tokens ?? 0;
  return { text: d.choices[0]?.message?.content ?? "", in: u.prompt_tokens ?? 0, out: u.completion_tokens ?? 0 };
}
const usd = (t) => (t.in * CENIK.in + t.out * CENIK.out) / 1e6;

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
  ]);
  const w = r.text.trim().replace(/[".,'\n]/g, " ").split(/\s+/).filter(Boolean);
  // filetype:md je pojistka - v knihovne jsou od 27. 8. i PDF renditiony a .text()
  // by z nich udelal binarni smeti v promptu
  const kql = w.length ? `(${w.join(" OR ")}) AND filetype:md AND path:"${PATH}"` : "";
  let http = 1, hits = [];
  if (kql) {
    const sr = await fetch("https://graph.microsoft.com/v1.0/search/query", {
      method: "POST", headers: H,
      body: JSON.stringify({ requests: [{ entityTypes: ["driveItem"], query: { queryString: kql }, size: 3, fields: ["name", "webUrl", "parentReference", "id"] }] }),
      signal: AbortSignal.timeout(30_000),
    });
    http++;
    const found = (await sr.json()).value?.[0]?.hitsContainers?.[0]?.hits ?? [];
    for (const h of found) {
      const it = h.resource;
      const cr = await fetch(`https://graph.microsoft.com/v1.0/drives/${it.parentReference.driveId}/items/${it.id}/content`,
        { headers: { Authorization: "Bearer " + T }, signal: AbortSignal.timeout(30_000) });
      http++;
      if (cr.ok) hits.push({ title: it.name, url: it.webUrl, text: (await cr.text()).slice(0, 3000) });
    }
  }
  return { hits, msRetrieval: Date.now() - t0, http, volaniModelu: 1, tokenyRetrieval: { in: r.in, out: r.out } };
}

// --- B) Retrieval API ----------------------------------------------------------
async function cestaB(dotaz) {
  const t0 = Date.now();
  const r = await fetch("https://graph.microsoft.com/v1.0/copilot/retrieval", {
    method: "POST", headers: H,
    body: JSON.stringify({ queryString: dotaz, dataSource: "sharePoint", filterExpression: `path:"${PATH}"` }),
    signal: AbortSignal.timeout(90_000),
  });
  const hits = (JSON.parse(await r.text()).retrievalHits ?? []).map((h) => ({
    title: (h.webUrl || "").split("/").pop(),
    url: h.webUrl,
    text: (h.extracts ?? []).map((e) => e.text).join("\n"),
  }));
  return { hits, msRetrieval: Date.now() - t0, http: 1, volaniModelu: 0, tokenyRetrieval: { in: 0, out: 0 } };
}

// --- C) Copilot Search API -----------------------------------------------------
// preview obsahuje znackovani shod (<c0>…</c0>, <ddd/>) - realna implementace ho
// musi ocistit, jinak posila modelu smeti
const ocisti = (s) => (s || "").replace(/<\/?c\d+>/g, "").replace(/<ddd\/>/g, " … ");

async function cestaC(dotaz) {
  const t0 = Date.now();
  const r = await fetch("https://graph.microsoft.com/beta/copilot/search", {
    method: "POST", headers: H,
    body: JSON.stringify({
      query: dotaz, pageSize: 3,
      dataSources: { oneDrive: { filterExpression: `path:"${PATH}"`, resourceMetadataNames: ["title"] } },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  const hits = (JSON.parse(await r.text()).searchHits ?? []).map((h) => ({
    title: h.resourceMetadata?.title ?? (h.webUrl || "").split("/").pop(),
    url: h.webUrl,
    text: ocisti(h.preview),
  }));
  return { hits, msRetrieval: Date.now() - t0, http: 1, volaniModelu: 0, tokenyRetrieval: { in: 0, out: 0 } };
}

// --- odpoved -------------------------------------------------------------------
async function odpoved(dotaz, hits) {
  const knowledge = hits.length
    ? "Podklady z runbooků:\n\n" + hits.map((h, i) => `[${i + 1}] ${h.title} — ${h.url}\n${h.text}`).join("\n\n")
    : "Podklady z runbooků: žádný runbook k dotazu nenalezen.";
  return model([
    { role: "system", content: SYSTEM },
    { role: "user", content: dotaz },
    { role: "user", content: knowledge },
  ]);
}

// --- soudce tri odpovedi -------------------------------------------------------
const JUDGE = "Jsi přísný hodnotitel odpovědí IT asistenta. Dostaneš OČEKÁVANÉ CHOVÁNÍ a tři odpovědi A, B, C. "
  + 'Vrať POUZE JSON: {"a":true|false,"b":true|false,"c":true|false,"nejlepsi":"A"|"B"|"C"|"remiza","duvod":"jedna veta"}.';

async function soudce(ocekavani, a, b, c) {
  const r = await model([
    { role: "system", content: JUDGE },
    { role: "user", content: `OČEKÁVANÉ CHOVÁNÍ:\n${ocekavani}\n\nODPOVĚĎ A:\n${a}\n\nODPOVĚĎ B:\n${b}\n\nODPOVĚĎ C:\n${c}` },
  ], true);
  return JSON.parse(r.text);
}

// --- beh ------------------------------------------------------------------------
const CESTY = [
  ["A", "Graph Search  ", cestaA],
  ["B", "Retrieval API ", cestaB],
  ["C", "Copilot Search", cestaC],
];
const vse = [];

for (let beh = 1; beh <= BEHY; beh++) {
  console.log(`\n╔══ BĚH ${beh}/${BEHY} ${"═".repeat(46)}`);
  for (const d of DOTAZY) {
    console.log(`\n  ${d.id}  "${d.q}"`);
    const z = { beh, ...d };
    for (const [k, jmeno, fn] of CESTY) {
      try {
        const t0 = Date.now();
        const ret = await fn(d.q);
        const odp = await odpoved(d.q, ret.hits);
        const tok = { in: ret.tokenyRetrieval.in + odp.in, out: ret.tokenyRetrieval.out + odp.out };
        z[k] = {
          hits: ret.hits.map((h) => h.title), znaku: ret.hits.reduce((s, h) => s + h.text.length, 0),
          msRetrieval: ret.msRetrieval, msCelkem: Date.now() - t0, http: ret.http,
          volaniModelu: ret.volaniModelu + 1, tok, usd: usd(tok), odpoved: odp.text,
        };
        console.log(`    ${jmeno} ${String(ret.hits.length).padStart(2)} hitu · ret ${String(ret.msRetrieval).padStart(5)} ms · turn ${String(z[k].msCelkem).padStart(6)} ms · ${z[k].volaniModelu} vol · ${String(tok.in).padStart(4)}/${String(tok.out).padStart(4)} tok · $${usd(tok).toFixed(5)}  [${ret.hits.map((h) => h.title).join(", ") || "-"}]`);
      } catch (e) {
        z[k] = { chyba: String(e.message) };
        console.log(`    ${jmeno} CHYBA ${e.message}`);
      }
    }
    if (!BEZ_SOUDCE && z.A?.odpoved && z.B?.odpoved && z.C?.odpoved) {
      try {
        z.verdikt = await soudce(d.ocekavani, z.A.odpoved, z.B.odpoved, z.C.odpoved);
        console.log(`    soudce         A=${z.verdikt.a ? "ok" : "FAIL"} B=${z.verdikt.b ? "ok" : "FAIL"} C=${z.verdikt.c ? "ok" : "FAIL"} · nejlepší: ${z.verdikt.nejlepsi} · ${z.verdikt.duvod}`);
      } catch (e) { console.log(`    soudce         CHYBA ${e.message}`); }
    }
    vse.push(z);
  }
}

// --- souhrn ----------------------------------------------------------------------
const ok = (k) => vse.filter((v) => v[k] && !v[k].chyba);
const pr = (k, f) => { const o = ok(k); return o.length ? o.reduce((s, v) => s + f(v[k]), 0) / o.length : 0; };

console.log(`\n\n${"═".repeat(64)}\nSOUHRN — ${BEHY} běhů × ${DOTAZY.length} dotazů = ${BEHY * DOTAZY.length} měření na cestu\n`);
console.table([
  { metrika: "hitů / dotaz", A: pr("A", (x) => x.hits.length).toFixed(2), B: pr("B", (x) => x.hits.length).toFixed(2), C: pr("C", (x) => x.hits.length).toFixed(2) },
  { metrika: "znaků podkladů / dotaz", A: Math.round(pr("A", (x) => x.znaku)), B: Math.round(pr("B", (x) => x.znaku)), C: Math.round(pr("C", (x) => x.znaku)) },
  { metrika: "volání modelu / dotaz", A: pr("A", (x) => x.volaniModelu).toFixed(2), B: pr("B", (x) => x.volaniModelu).toFixed(2), C: pr("C", (x) => x.volaniModelu).toFixed(2) },
  { metrika: "HTTP volání / dotaz", A: pr("A", (x) => x.http).toFixed(2), B: pr("B", (x) => x.http).toFixed(2), C: pr("C", (x) => x.http).toFixed(2) },
  { metrika: "latence retrievalu (ms)", A: Math.round(pr("A", (x) => x.msRetrieval)), B: Math.round(pr("B", (x) => x.msRetrieval)), C: Math.round(pr("C", (x) => x.msRetrieval)) },
  { metrika: "latence turnu (ms)", A: Math.round(pr("A", (x) => x.msCelkem)), B: Math.round(pr("B", (x) => x.msCelkem)), C: Math.round(pr("C", (x) => x.msCelkem)) },
  { metrika: "vstupní tokeny / dotaz", A: Math.round(pr("A", (x) => x.tok.in)), B: Math.round(pr("B", (x) => x.tok.in)), C: Math.round(pr("C", (x) => x.tok.in)) },
  { metrika: "výstupní tokeny / dotaz", A: Math.round(pr("A", (x) => x.tok.out)), B: Math.round(pr("B", (x) => x.tok.out)), C: Math.round(pr("C", (x) => x.tok.out)) },
  { metrika: "USD / dotaz", A: pr("A", (x) => x.usd).toFixed(5), B: pr("B", (x) => x.usd).toFixed(5), C: pr("C", (x) => x.usd).toFixed(5) },
  { metrika: "USD / měsíc (200×1×21)", A: (pr("A", (x) => x.usd) * 4200).toFixed(2), B: (pr("B", (x) => x.usd) * 4200).toFixed(2), C: (pr("C", (x) => x.usd) * 4200).toFixed(2) },
]);

const v = vse.filter((x) => x.verdikt);
if (v.length) {
  console.log(`Kvalita — LLM soudce, ${v.length} hodnocení:`);
  for (const [k, n] of [["a", "A Graph Search "], ["b", "B Retrieval API"], ["c", "C Copilot Search"]])
    console.log(`  ${n} splnilo: ${v.filter((x) => x.verdikt[k]).length}/${v.length}`);
  const s = { A: 0, B: 0, C: 0, remiza: 0 };
  v.forEach((x) => { if (s[x.verdikt.nejlepsi] !== undefined) s[x.verdikt.nejlepsi]++; });
  console.log(`  nejlepší: A ${s.A}× · B ${s.B}× · C ${s.C}× · remíza ${s.remiza}×`);

  if (BEHY > 1) {
    console.log(`\n  Stabilita verdiktů mezi běhy (tentýž dotaz, tentýž prompt):`);
    for (const d of DOTAZY) {
      const r = vse.filter((x) => x.id === d.id && x.verdikt).map((x) => x.verdikt.nejlepsi);
      const stejne = new Set(r).size === 1;
      console.log(`    ${d.id}  ${r.join(" → ")}  ${stejne ? "stabilní" : "ZMĚNA"}`);
    }
  }
}
console.log(`\nCelkem za měření: ${modelCelkem.volani} volání modelu, ${modelCelkem.in} in / ${modelCelkem.out} out, $${usd(modelCelkem).toFixed(4)}`);

writeFileSync("srovnani-tri-api.json", JSON.stringify({ bezel: new Date().toISOString(), ucet: cl.upn, behy: BEHY, cenik: CENIK, modelCelkem, vysledky: vse }, null, 2));
console.log("Detail vcetne plnych odpovedi: srovnani-tri-api.json");

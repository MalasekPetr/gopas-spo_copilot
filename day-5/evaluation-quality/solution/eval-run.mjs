// ============================================================================
// Runner s LLM judgem - instruktorske demo casti C.
//
// Judge NEHODNOTI text proti textu. Dostane OCEKAVANE CHOVANI (rubriku) a
// SKUTECNOU ODPOVED a rozhodne, jestli chovani sedi. Proto se do golden setu
// pise chovani, ne ocekavany retezec.
//
// Spusteni:
//   $env:AZURE_OPENAI_ENDPOINT   = "https://spo-copilot-course.openai.azure.com"
//   $env:AZURE_OPENAI_API_KEY    = "<klic>"
//   $env:AZURE_OPENAI_DEPLOYMENT_NAME = "support-agent"
//   node eval-run.mjs odpovedi.json
//
//   node eval-run.mjs odpovedi.json --dry   # bez volani modelu, jen zkontroluje vstupy
//
// Vstup `odpovedi.json`: [{ "id": "K1", "odpoved": "…", "ms": 4120 }, …]
// Odpovedi se poridi z Playgroundu - kazdy dotaz ze golden-set.json poslat
// agentovi a odpoved zkopirovat. Runner nevola agenta sam zamerne: volani bota
// pres /api/messages je krehke a v labu by kradlo cas, ktery patri vyhodnoceni.
// ============================================================================

import { readFileSync, writeFileSync } from "node:fs";

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const KEY = process.env.AZURE_OPENAI_API_KEY;
const DEPLOY = process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "support-agent";
const DRY = process.argv.includes("--dry");
const ODPOVEDI = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "odpovedi.json";

const JUDGE = "Jsi přísný hodnotitel odpovědí IT asistenta. Dostaneš OČEKÁVANÉ CHOVÁNÍ a SKUTEČNOU ODPOVĚĎ. "
  + 'Vrať POUZE JSON ve tvaru {"trida":"odpoved|neznalost|eskalace|odmitnuti","splneno":true|false,"duvod":"jedna veta"}.';

const URL = `${ENDPOINT}/openai/deployments/${DEPLOY}/chat/completions?api-version=2024-12-01-preview`;

async function judge(ocekavani, odpoved) {
  const r = await fetch(URL, {
    method: "POST",
    headers: { "api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: JUDGE },
        { role: "user", content: `OČEKÁVANÉ CHOVÁNÍ:\n${ocekavani}\n\nSKUTEČNÁ ODPOVĚĎ:\n${odpoved}` },
      ],
      max_completion_tokens: 1200,               // reasoning model: pod ~900 vraci prazdno
      response_format: { type: "json_object" },  // bez tohohle pribali markdown blok
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!r.ok) throw new Error(`judge selhal: ${r.status} ${await r.text()}`);
  const d = await r.json();
  const obsah = d.choices?.[0]?.message?.content;
  if (!obsah) throw new Error("judge vratil prazdny obsah - zvys max_completion_tokens");
  return { verdikt: JSON.parse(obsah), usage: d.usage };
}

// --- deterministicke metriky, ktere judge nepotrebuje ------------------------
const maCitaci = (t) => /\[\d+\]\s*\S+\.md/.test(t);
const CIZI_ODKAZ = /https?:\/\/(?!ms365x17157302\.sharepoint\.com|learn\.microsoft\.com)/i;

// --- beh ---------------------------------------------------------------------
const pripady = JSON.parse(readFileSync("golden-set.json", "utf8"));
let odpovedi;
try {
  odpovedi = JSON.parse(readFileSync(ODPOVEDI, "utf8"));
} catch {
  console.error(`Nenasel jsem ${ODPOVEDI}. Ocekavam [{ "id": "K1", "odpoved": "…", "ms": 4120 }, …]`);
  console.error("Odpovedi se poridi z Playgroundu - kazdy dotaz z golden-set.json poslat agentovi.");
  process.exit(1);
}
const mapa = new Map(odpovedi.map((o) => [o.id, o]));

const chybi = pripady.filter((p) => !mapa.has(p.id)).map((p) => p.id);
if (chybi.length) console.warn(`! Chybi odpovedi pro: ${chybi.join(", ")} - budou pocitany jako nesplnene.`);

if (DRY) {
  console.log(`DRY RUN - ${pripady.length} pripadu, ${mapa.size} odpovedi, model se nevola.`);
  for (const p of pripady) {
    const o = mapa.get(p.id);
    console.log(`  ${p.id} [${p.trida}] ${o ? "odpoved OK" : "CHYBI"}${o && maCitaci(o.odpoved) ? " · citace" : ""}${o && CIZI_ODKAZ.test(o.odpoved) ? " · CIZI ODKAZ" : ""}`);
  }
  process.exit(0);
}
if (!ENDPOINT || !KEY) { console.error("Chybi AZURE_OPENAI_ENDPOINT nebo AZURE_OPENAI_API_KEY."); process.exit(1); }

const t0 = Date.now();
const vysledky = [];
let judgeIn = 0, judgeOut = 0;

for (const p of pripady) {
  const o = mapa.get(p.id);
  if (!o) { vysledky.push({ ...p, splneno: false, duvod: "odpoved chybi", citace: false }); continue; }

  const { verdikt, usage } = await judge(p.ocekavani, o.odpoved);
  judgeIn += usage?.prompt_tokens ?? 0;
  judgeOut += usage?.completion_tokens ?? 0;

  const r = {
    id: p.id,
    trida_ocekavana: p.trida,
    trida_soudce: verdikt.trida,
    trida_sedi: verdikt.trida === p.trida,
    splneno: verdikt.splneno === true,
    duvod: verdikt.duvod,
    citace: maCitaci(o.odpoved),
    cizi_odkaz: CIZI_ODKAZ.test(o.odpoved),
    ms: o.ms ?? null,
  };
  vysledky.push(r);
  console.log(`${r.splneno ? "ok  " : "FAIL"} ${p.id} [${p.trida}${r.trida_sedi ? "" : ` → soudce: ${verdikt.trida}`}] ${verdikt.duvod}`);
}

// --- agregace ----------------------------------------------------------------
const n = vysledky.length;
const proslo = vysledky.filter((v) => v.splneno).length;
const latence = vysledky.map((v) => v.ms).filter((x) => typeof x === "number").sort((a, b) => a - b);
const p = (q) => latence.length ? latence[Math.min(latence.length - 1, Math.floor(latence.length * q))] : null;

const podleTridy = {};
for (const v of vysledky) {
  const t = (podleTridy[v.trida_ocekavana] ??= { celkem: 0, proslo: 0 });
  t.celkem++; if (v.splneno) t.proslo++;
}

const souhrn = {
  bezel: new Date().toISOString(),
  pripadu: n,
  pass_rate: +(proslo / n).toFixed(3),
  spravna_trida: +(vysledky.filter((v) => v.trida_sedi).length / n).toFixed(3),
  groundedness: +(vysledky.filter((v) => v.citace).length / n).toFixed(3),
  cizich_odkazu: vysledky.filter((v) => v.cizi_odkaz).length,
  latence_p50_ms: p(0.5),
  latence_p95_ms: p(0.95),
  judge_tokenu: { in: judgeIn, out: judgeOut },
  doba_behu_s: +((Date.now() - t0) / 1000).toFixed(1),
};

console.log("\n--- souhrn ---");
console.table(podleTridy);
console.log(souhrn);
writeFileSync("vysledky.json", JSON.stringify({ souhrn, podleTridy, vysledky }, null, 2));
console.log("\nZapsano do vysledky.json");
console.log(`Pro srovnani: deterministicke testy (policy.test.ts) bezi ~0,3 s a stoji 0 tokenu.`);

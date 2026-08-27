// ============================================================================
// "Uz to naindexovalo?" - kontrola, jestli jsou nove soubory v knihovne
// dohledatelne PRES OBA indexy. Retrieval API cte Copilot semantic index,
// Graph Search cte Microsoft Search index - propaguji se NEZAVISLE a ruzne
// rychle. Prave proto se ptaji obou.
//
// Spusteni z C:/Repos/GOPAS/PMApp:
//   node <klon-repa>/day-5/perf-cost-lifecycle/je-to-naindexovane.mjs .lab-token
//
// Vyzaduje Accept-Language - bez ni vraci Retrieval API 200 a prazdno,
// viz mereni-retrieval-vs-search.md.
// ============================================================================

import { readFileSync, existsSync } from "node:fs";

const F = process.argv[2] ?? ".lab-token";
if (!existsSync(F)) { console.error(`Chybi token: ${F}`); process.exit(1); }
const raw = readFileSync(F);
const T = (raw[0] === 0xff && raw[1] === 0xfe ? raw.toString("utf16le") : raw.toString("utf8")).replace(/^\uFEFF/, "").trim();
const claims = JSON.parse(Buffer.from(T.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
if (claims.exp * 1000 < Date.now()) { console.error("Token vyprsel."); process.exit(1); }

const PATH = "https://ms365x17157302.sharepoint.com/sites/hr-demo/Runbooky";
const H = {
  Authorization: "Bearer " + T,
  "Content-Type": "application/json",
  "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
};

// Prirozene ceske vety - presne to, co u .md nefungovalo. Kdyz je vrati PDF,
// semanticky retrieval na podporovanem typu funguje.
const VETY = [
  "Nejde mi upload, hlásí access denied.",
  "Jaká je SLA na P1?",
  "Tiskárna netiskne a runbook nepomohl.",
  "Jak si mám resetovat heslo?",
];

console.log(`Ucet: ${claims.upn ?? claims.preferred_username} · ${new Date().toISOString().slice(0, 19)}Z\n`);

// --- 1. Microsoft Search index: jsou soubory videt vubec? --------------------
async function search(kql) {
  const r = await fetch("https://graph.microsoft.com/v1.0/search/query", {
    method: "POST", headers: H,
    body: JSON.stringify({ requests: [{ entityTypes: ["driveItem"], query: { queryString: kql }, size: 25, fields: ["name"] }] }),
    signal: AbortSignal.timeout(30_000),
  });
  const d = await r.json();
  return (d.value?.[0]?.hitsContainers?.[0]?.hits ?? []).map((x) => x.resource?.name);
}

const pdf = await search(`filetype:pdf AND path:"${PATH}"`);
const md = await search(`filetype:md AND path:"${PATH}"`);
console.log("── Microsoft Search index (cte Graph Search)");
console.log(`   .pdf : ${pdf.length} ks  ${pdf.join(", ") || "— zatim nic"}`);
console.log(`   .md  : ${md.length} ks  ${md.join(", ")}`);

if (!pdf.length) {
  console.log("\n   PDF zatim nejsou ani v Search indexu. Nahrano pred chvili? Pockej a spust znovu.");
}

// --- 2. Copilot semantic index: odpovi na prirozenou vetu? ------------------
console.log("\n── Copilot semantic index (cte Retrieval API)");
let semanticky = 0;
for (const q of VETY) {
  const t0 = Date.now();
  const r = await fetch("https://graph.microsoft.com/v1.0/copilot/retrieval", {
    method: "POST", headers: H,
    body: JSON.stringify({ queryString: q, dataSource: "sharePoint" }),
    signal: AbortSignal.timeout(60_000),
  });
  const hits = (JSON.parse(await r.text()).retrievalHits ?? []);
  const ms = Date.now() - t0;
  const nazvy = hits.map((x) => (x.webUrl || "").split("/").pop());
  const jePdf = nazvy.some((n) => n.toLowerCase().endsWith(".pdf"));
  if (jePdf) semanticky++;
  console.log(`   ${hits.length} hitu (${String(ms).padStart(5)} ms) ${jePdf ? "PDF ✓" : "      "}  "${q.slice(0, 38)}"`);
  if (nazvy.length) console.log(`        ${nazvy.join(", ")}`);
}

// --- verdikt -----------------------------------------------------------------
console.log("\n── Verdikt");
if (semanticky >= 2) {
  console.log(`   HOTOVO. ${semanticky}/${VETY.length} prirozenych ceskych vet naslo PDF.`);
  console.log("   Semanticky retrieval na podporovanem typu funguje - hypoteza potvrzena.");
  console.log("   Ted ma smysl pustit srovnani-retrieval.mjs znovu, uz s fer podminkami.");
} else if (pdf.length) {
  console.log(`   JESTE NE. PDF jsou v Search indexu, ale Retrieval API je nevraci (${semanticky}/${VETY.length}).`);
  console.log("   Ty dva indexy propaguji nezavisle - Copilot semantic index byva pomalejsi.");
  console.log("   Zkus za hodinu; pri prvnim naplneni knihovny to muze byt i desitky hodin.");
  console.log("   Do te doby to NENI dukaz, ze to nefunguje.");
} else {
  console.log("   PDF zatim nikde. Nahraj je a spust znovu.");
}
console.log("\n   Pripominka: prazdna odpoved za ~0,5 s = chybi Accept-Language nebo neni co najit;");
console.log("   skutecne hledani trva 1-3 s. Viz mereni-retrieval-vs-search.md.");

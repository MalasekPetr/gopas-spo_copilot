// Mock Retrieval endpoint pro lab knowledge-grounding (fallback části B) — bez závislostí.
// Servíruje chunky z lokálních kopií runbooků (./runbooky/*.md) s naivním keyword
// skórováním. Tvar odpovědi volně zrcadlí Copilot Retrieval API (retrievalHits ->
// extracts/text + webUrl), aby přepnutí na skutečné API byla změna URL a tokenu,
// ne přepis kódu. POZOR na rozdíl, který se v labu pojmenovává: tenhle mock nemá
// ACL trimming ani semantic index — jen lexikální shodu.
//
// Spuštění:  node mock-retrieval.mjs            (port 4002)
// Self-test: node mock-retrieval.mjs --self-test
//
// Endpoint: POST /retrieval  { "queryString": "..." }
//   -> 200 { retrievalHits: [{ webUrl, resourceMetadata: { title }, extracts: [{ text }] }] }

import { createServer } from "http";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PORT = Number(process.env.PORT ?? 4002);
const DIR = join(dirname(fileURLToPath(import.meta.url)), "runbooky");

// nacti runbooky jednou pri startu; chunk = odstavec
const chunks = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(DIR, f), "utf8");
  const title = text.match(/^# (.+)$/m)?.[1] ?? f;
  for (const para of text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith("#")))
    chunks.push({ file: f, title, text: para });
}

function score(query, text) {
  // tokenizace pres unicode (česká diakritika); krátké slovo drží jen zkratka
  // (velká písmena) nebo token s číslicí — "SLA" i "P1" musí projít
  const words = query
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 3 || /\d/.test(w) || (w.length >= 2 && w === w.toUpperCase()))
    .map((w) => w.toLowerCase());
  const hay = text.toLowerCase();
  return words.filter((w) => hay.includes(w)).length;
}

const server = createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/retrieval") {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "POST /retrieval" }));
  }
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    let q = "";
    try { q = JSON.parse(raw).queryString ?? ""; } catch { /* prazdny dotaz */ }
    const hits = chunks
      .map((c) => ({ c, s: score(q, c.text) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(({ c }) => ({
        webUrl: `https://spdemo.sharepoint.com/sites/hr-demo/Runbooky/${c.file}`,
        resourceMetadata: { title: c.title },
        extracts: [{ text: c.text }],
      }));
    console.log(`[retrieval] "${q}" -> ${hits.length} chunku`);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ retrievalHits: hits }, null, 2));
  });
});

server.listen(PORT, async () => {
  console.log(`Mock retrieval bezi na http://localhost:${PORT}/retrieval (${chunks.length} chunku z ${DIR})`);
  if (process.argv.includes("--self-test")) {
    const ask = async (q) =>
      (await (await fetch(`http://localhost:${PORT}/retrieval`, { method: "POST", body: JSON.stringify({ queryString: q }) })).json()).retrievalHits.length;
    const upload = await ask("Nejde mi upload, hlásí access denied");
    const sla = await ask("Jaká je SLA na P1?");
    const nic = await ask("recept na svíčkovou");
    console.log(`self-test: upload=${upload} hitu (>0), SLA=${sla} (>0), mimo temata=${nic} (0)`);
    process.exit(upload > 0 && sla > 0 && nic === 0 ? 0 : 1);
  }
});

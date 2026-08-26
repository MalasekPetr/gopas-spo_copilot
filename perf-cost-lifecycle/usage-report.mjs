// Statistika spotřeby agenta z usage-log.jsonl — bez závislostí, čistý Node.
//
// Agent při každém volání modelu připíše jeden řádek (viz logUsage v labech).
// Tenhle skript ho přečte, sečte a ocení podle prices-snapshot.json.
//
// Spuštění:
//   node usage-report.mjs <cesta-k-usage-log.jsonl>
//   node usage-report.mjs ../PMApp/usage-log.jsonl --users 200 --dotazu 8
//   node usage-report.mjs log.jsonl --model gpt-5-nano     (co by stal levnější model)
//
// Řádek logu: {"ts","turn","lab","q","kolo","in","out","reasoning","cached"}

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const logPath = args.find((a) => !a.startsWith("--")) ?? "usage-log.jsonl";
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const USERS = Number(opt("users", 200));       // kolik lidi to bude pouzivat
const DOTAZU = Number(opt("dotazu", 8));       // dotazu na uzivatele za pracovni den
const DNU = Number(opt("dnu", 21));            // pracovnich dnu v mesici
const MODEL = opt("model", null);              // prepocet na jiny model

if (!existsSync(logPath)) {
  console.error(`Log nenalezen: ${logPath}`);
  console.error(`Agent ho zaklada az po prvnim volani modelu — pust nejdriv par dotazu.`);
  process.exit(1);
}

const prices = JSON.parse(readFileSync(join(HERE, "prices-snapshot.json"), "utf8"));
const radky = readFileSync(logPath, "utf8").split("\n").filter((l) => l.trim())
  .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

if (!radky.length) { console.error("Log je prazdny."); process.exit(1); }

// --- agregace ---------------------------------------------------------------
const zaLab = new Map();
let celkem = { in: 0, out: 0, reasoning: 0, cached: 0, kol: 0 };
const turny = new Set();

for (const r of radky) {
  const lab = r.lab ?? "(neznamy)";
  if (!zaLab.has(lab)) zaLab.set(lab, { in: 0, out: 0, reasoning: 0, cached: 0, kol: 0, turny: new Set() });
  const s = zaLab.get(lab);
  for (const k of ["in", "out", "reasoning", "cached"]) { s[k] += r[k] ?? 0; celkem[k] += r[k] ?? 0; }
  s.kol++; celkem.kol++;
  // turn = jeden pruchod handlerem; bez nej fallback na lab+dotaz
  const turnKey = r.turn ? `${lab}|${r.turn}` : `${lab}|${r.q ?? ""}`;
  s.turny.add(turnKey); turny.add(turnKey);
}

const modelKey = MODEL ?? radky.find((r) => r.model)?.model ?? "gpt-5-mini";
const cena = prices.models[modelKey];
if (!cena) {
  console.error(`Model '${modelKey}' neni v prices-snapshot.json. Dostupne: ${Object.keys(prices.models).join(", ")}`);
  process.exit(1);
}

// ceny jsou EUR za 1M tokenu
const eur = (t) => (t.in - t.cached) / 1e6 * cena.in + t.cached / 1e6 * cena.cached + t.out / 1e6 * cena.out;
const fmt = (n, d = 4) => n.toFixed(d).replace(".", ",");
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);

// --- vystup -----------------------------------------------------------------
console.log(`\n=== SPOTREBA AGENTA ==========================================`);
console.log(`log: ${logPath}  |  model: ${cena.label ?? modelKey}  |  ceny: ${prices.region}, staz. ${prices.fetchedAt}\n`);

console.log(`${pad("lab / faze", 26)}${rpad("turnu", 7)}${rpad("kol", 6)}${rpad("vstup", 9)}${rpad("vystup", 9)}${rpad("z toho reas.", 13)}${rpad("EUR", 10)}`);
console.log("-".repeat(80));
for (const [lab, s] of zaLab) {
  console.log(`${pad(lab, 26)}${rpad(s.turny.size, 7)}${rpad(s.kol, 6)}${rpad(s.in, 9)}${rpad(s.out, 9)}${rpad(s.reasoning, 13)}${rpad(fmt(eur(s)), 10)}`);
}
console.log("-".repeat(80));
console.log(`${pad("CELKEM", 26)}${rpad(turny.size, 7)}${rpad(celkem.kol, 6)}${rpad(celkem.in, 9)}${rpad(celkem.out, 9)}${rpad(celkem.reasoning, 13)}${rpad(fmt(eur(celkem)), 10)}`);

const naTurn = {
  in: celkem.in / turny.size, out: celkem.out / turny.size,
  reasoning: celkem.reasoning / turny.size, cached: celkem.cached / turny.size,
};
const cenaTurn = eur(naTurn);
const podilReasoning = celkem.out ? (celkem.reasoning / celkem.out * 100) : 0;

console.log(`\n--- NA JEDEN TURN --------------------------------------------`);
console.log(`  kol na turn        : ${fmt(celkem.kol / turny.size, 2)}`);
console.log(`  vstup / vystup     : ${Math.round(naTurn.in)} / ${Math.round(naTurn.out)} tokenu`);
console.log(`  reasoning          : ${Math.round(naTurn.reasoning)} tokenu (${fmt(podilReasoning, 1)} % vystupu — platis, nevidis)`);
console.log(`  cena               : ${fmt(cenaTurn)} EUR`);

const mesic = cenaTurn * USERS * DOTAZU * DNU;
console.log(`\n--- PROVOZ (odhad z tvych cisel) ------------------------------`);
console.log(`  ${USERS} uzivatelu x ${DOTAZU} dotazu/den x ${DNU} dnu = ${(USERS * DOTAZU * DNU).toLocaleString("cs")} turnu/mesic`);
console.log(`  MESICNE            : ${fmt(mesic, 2)} EUR`);
console.log(`  ROCNE              : ${fmt(mesic * 12, 2)} EUR`);

console.log(`\n--- KDYBY JINY MODEL -----------------------------------------`);
for (const [k, m] of Object.entries(prices.models)) {
  if (m.in == null) continue;
  const e = (naTurn.in - naTurn.cached) / 1e6 * m.in + naTurn.cached / 1e6 * m.cached + naTurn.out / 1e6 * m.out;
  const mark = k === modelKey ? "  <- tvuj" : "";
  console.log(`  ${pad(k, 14)} ${rpad(fmt(e), 9)} EUR/turn   ${rpad(fmt(e * USERS * DOTAZU * DNU, 2), 10)} EUR/mesic${mark}`);
}
console.log(`\nPozor: cisla plati pro NAMERENY vzorek. Kratsi dotazy v provozu = min tokenu,`);
console.log(`delsi historie a vic kol = vic. Rozsah si osahej v cost-visual.html.\n`);

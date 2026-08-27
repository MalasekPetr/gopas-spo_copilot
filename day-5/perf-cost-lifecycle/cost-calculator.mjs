#!/usr/bin/env node
/**
 * Kalkulator provoznich nakladu agenta.
 *
 * Simuluje konverzaci turn po turnu a kolo po kole a secte tokeny, ktere se
 * realne posilaji do modelu. Nepocita "tokeny x cena" — zviditelnuje tri veci,
 * ktere zustavaji skryte: statickou cast posilanou v kazdem kole, reasoning
 * uctovany jako vystup, a kvadraticky rust historie.
 *
 * Spusteni:
 *   node cost-calculator.mjs
 *   node cost-calculator.mjs --scenario muj-agent.json
 *   node cost-calculator.mjs --cache 0.8 --history 2 --model gpt-5-nano
 *   node cost-calculator.mjs --refresh-prices
 *
 * Bez zavislosti — Node 18+ (globalni fetch).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REGION = "westeurope";
const PRICE_CACHE = join(HERE, "prices-snapshot.json");

// --- vychozi scenar: vsechny hodnoty jdou precist z usage metadat odpovedi ---
const DEFAULT_SCENARIO = {
  systemPrompt: 800,   // staticky, posila se v KAZDEM kole, cachovatelny
  toolSchemas: 600,    // dtto
  grounding: 1500,     // chunky z retrievalu, per turn
  userMessage: 30,
  response: 250,
  reasoning: 200,      // uctuje se jako VYSTUP
  kolaPerTurn: 2,      // model -> nastroj -> model
  turnsPerConversation: 6,
  historyLimit: Infinity,
  cacheHitRatio: 0,
  users: 20,
  conversationsPerUserPerDay: 3,
  daysPerMonth: 20,
};

// --- argumenty -------------------------------------------------------------
function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith("--")) continue;
    const name = k.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) { a[name] = true; }
    else { a[name] = next; i++; }
  }
  return a;
}

// --- ceny ------------------------------------------------------------------
async function fetchPrices() {
  const url = "https://prices.azure.com/api/retail/prices?currencyCode='EUR'"
    + `&$filter=serviceName eq 'Foundry Models' and armRegionName eq '${REGION}'&$top=1000`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`pricing API ${res.status}`);
  const items = (await res.json()).Items ?? [];

  // metry maji zkracene nazvy: "GPT 5 Mini Inpt DZone 1M Tokens"
  const pick = (re) => {
    const m = items.find(i => re.test(i.meterName) && /1M/.test(i.unitOfMeasure));
    return m ? m.retailPrice : null;
  };
  const model = (label, base, zone) => {
    const z = zone === "DZ" ? "DZone" : "Glbl";
    const esc = base.replace(/ /g, "\\s");
    return {
      label,
      in: pick(new RegExp(`^${esc}\\s+Inpt\\s+${z}`, "i")),
      cached: pick(new RegExp(`^${esc}\\s+cchd\\s+Inpt\\s+${z}`, "i")),
      out: pick(new RegExp(`^${esc}\\s+outpt\\s+${z}`, "i")),
    };
  };
  const out = {
    "gpt-5-nano": model("gpt-5-nano (Global)", "GPT 5 Nano", "GL"),
    "gpt-5-mini": model("gpt-5-mini (DataZone)", "GPT 5 Mini", "DZ"),
    "gpt-5": model("gpt-5 (DataZone)", "GPT 5", "DZ"),
  };
  return { fetchedAt: new Date().toISOString().slice(0, 10), region: REGION, models: out };
}

async function loadPrices(args) {
  if (args["prices"]) return JSON.parse(readFileSync(args["prices"], "utf8"));
  if (!args["refresh-prices"] && existsSync(PRICE_CACHE)) {
    const snap = JSON.parse(readFileSync(PRICE_CACHE, "utf8"));
    if (!args["offline"]) {
      try { const live = await fetchPrices(); writeFileSync(PRICE_CACHE, JSON.stringify(live, null, 2)); return live; }
      catch { console.log("  (!) ceny se nepodarilo stahnout, pouzivam snapshot\n"); }
    }
    return snap;
  }
  if (args["offline"]) {
    console.error(`Chybi snapshot cen (${PRICE_CACHE}) a --offline zakazuje stazeni.`);
    console.error(`Spust jednou s pripojenim, nebo predej ceny pres --prices <soubor.json>.`);
    process.exit(1);
  }
  const live = await fetchPrices();
  writeFileSync(PRICE_CACHE, JSON.stringify(live, null, 2));
  return live;
}

// --- jadro vypoctu ---------------------------------------------------------
/** Projde konverzaci turn po turnu a kolo po kole; vrati tokeny a cenu. */
function simulate(s, p) {
  const staticPart = s.systemPrompt + s.toolSchemas;
  const exchange = s.userMessage + s.response;
  let inTok = 0, cachedTok = 0, outTok = 0, calls = 0;

  for (let t = 1; t <= s.turnsPerConversation; t++) {
    const kept = Math.min(t - 1, s.historyLimit);
    const history = kept * exchange;
    for (let k = 1; k <= s.kolaPerTurn; k++) {
      calls++;
      const input = staticPart + s.grounding + s.userMessage + history;
      const cachedHere = staticPart * s.cacheHitRatio;
      cachedTok += cachedHere;
      inTok += input - cachedHere;
      // reasoning v kazdem kole; viditelna odpoved jen v poslednim
      outTok += s.reasoning + (k === s.kolaPerTurn ? s.response : 0);
    }
  }
  const cIn = (inTok * p.in) / 1e6;
  const cCached = (cachedTok * p.cached) / 1e6;
  const cOut = (outTok * p.out) / 1e6;
  const perConversation = cIn + cCached + cOut;
  const perMonth = perConversation * s.conversationsPerUserPerDay * s.users * s.daysPerMonth;
  return { inTok, cachedTok, outTok, calls, cIn, cCached, cOut, perConversation, perMonth };
}

// --- vystup ----------------------------------------------------------------
const eur = (n) => n.toFixed(n < 1 ? 4 : 2);
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
const rule = (n = 66) => console.log("-".repeat(n));

function printBreakdown(s, p, r) {
  console.log(`\nROZPAD — ${p.label}\n`);
  console.log(`  volani modelu / konverzace   ${rpad(r.calls, 10)}   (${s.turnsPerConversation} turnu x ${s.kolaPerTurn} kola)`);
  console.log(`  vstupni tokeny               ${rpad(Math.round(r.inTok).toLocaleString("cs"), 10)}`);
  console.log(`  z toho cachovane             ${rpad(Math.round(r.cachedTok).toLocaleString("cs"), 10)}`);
  console.log(`  vystupni tokeny              ${rpad(Math.round(r.outTok).toLocaleString("cs"), 10)}   (reasoning ${Math.round(s.reasoning * r.calls).toLocaleString("cs")})`);
  rule();
  const tot = r.perConversation;
  console.log(`  ${pad("vstup", 22)} ${rpad(eur(r.cIn), 10)} EUR   ${rpad((r.cIn / tot * 100).toFixed(1), 5)} %`);
  if (r.cCached > 0)
    console.log(`  ${pad("cachovany vstup", 22)} ${rpad(eur(r.cCached), 10)} EUR   ${rpad((r.cCached / tot * 100).toFixed(1), 5)} %`);
  console.log(`  ${pad("vystup", 22)} ${rpad(eur(r.cOut), 10)} EUR   ${rpad((r.cOut / tot * 100).toFixed(1), 5)} %`);
  const cReason = (s.reasoning * r.calls * p.out) / 1e6;
  console.log(`  ${pad("  z toho reasoning", 22)} ${rpad(eur(cReason), 10)} EUR   ${rpad((cReason / tot * 100).toFixed(1), 5)} %  <- nikdo neuvidi`);
  rule();
  console.log(`  ${pad("CENA / KONVERZACE", 22)} ${rpad(eur(tot), 10)} EUR`);
  console.log(`  ${pad("CENA / MESIC", 22)} ${rpad(eur(r.perMonth), 10)} EUR   (${s.users} uziv. x ${s.conversationsPerUserPerDay}/den x ${s.daysPerMonth} dnu)`);
}

function printLevers(s, p, base) {
  console.log(`\n\nPAKY — co kolik usetri (mesicne)\n`);
  const variants = [
    ["baseline", s],
    ["cache 80 % staticke casti", { ...s, cacheHitRatio: 0.8 }],
    ["limit historie na 2 turny", { ...s, historyLimit: 2 }],
    ["oboji", { ...s, cacheHitRatio: 0.8, historyLimit: 2 }],
    ["oboji + bez reasoningu", { ...s, cacheHitRatio: 0.8, historyLimit: 2, reasoning: 0 }],
    ["+ jedno kolo misto dvou", { ...s, cacheHitRatio: 0.8, historyLimit: 2, reasoning: 0, kolaPerTurn: 1 }],
  ];
  for (const [label, sc] of variants) {
    const m = simulate(sc, p).perMonth;
    const d = ((m / base - 1) * 100);
    console.log(`  ${pad(label, 30)} ${rpad(eur(m), 9)} EUR   ${rpad((d >= 0 ? "+" : "") + d.toFixed(0), 5)} %`);
  }
}

function printModels(s, prices, base) {
  console.log(`\n\nTYZ SCENAR, JINY MODEL (mesicne)\n`);
  for (const p of Object.values(prices.models)) {
    if (p.in == null) { console.log(`  ${pad(p.label, 30)} (cena nenalezena)`); continue; }
    const m = simulate(s, p).perMonth;
    const d = ((m / base - 1) * 100);
    console.log(`  ${pad(p.label, 30)} ${rpad(eur(m), 9)} EUR   ${rpad((d >= 0 ? "+" : "") + d.toFixed(0), 5)} %`);
  }
}

function printGrowth(s, p) {
  console.log(`\n\nDELKA KONVERZACE — historie roste kvadraticky (mesicne)\n`);
  for (const t of [3, 6, 12, 24]) {
    const m = simulate({ ...s, turnsPerConversation: t }, p).perMonth;
    console.log(`  ${pad(`konverzace ${t} turnu`, 30)} ${rpad(eur(m), 9)} EUR`);
  }
}

// --- main ------------------------------------------------------------------
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`
Kalkulator provoznich nakladu agenta

  --scenario <soubor.json>   vlastni merene hodnoty
  --model <klic>             gpt-5-nano | gpt-5-mini | gpt-5   (default gpt-5-mini)
  --cache <0..1>             podil cachovane staticke casti
  --history <n>              limit historie na N turnu
  --turns <n>                delka konverzace
  --users <n>                pocet uzivatelu
  --prices <soubor.json>     ceny ze snapshotu
  --refresh-prices           stahnout ceny znovu
  --offline                  nestahovat, pouzit snapshot
`);
  process.exit(0);
}

let scenario = { ...DEFAULT_SCENARIO };
if (args.scenario) scenario = { ...scenario, ...JSON.parse(readFileSync(args.scenario, "utf8")) };
if (args.cache !== undefined) scenario.cacheHitRatio = Number(args.cache);
if (args.history !== undefined) scenario.historyLimit = Number(args.history);
if (args.turns !== undefined) scenario.turnsPerConversation = Number(args.turns);
if (args.users !== undefined) scenario.users = Number(args.users);

const prices = await loadPrices(args);
const key = args.model ?? "gpt-5-mini";
const price = prices.models[key];
if (!price || price.in == null) {
  console.error(`Model '${key}' nenalezen nebo bez ceny. Dostupne: ${Object.keys(prices.models).join(", ")}`);
  process.exit(1);
}

console.log(`\n=== NAKLADY AGENTA =============================================`);
console.log(`ceny: ${prices.region}, EUR/1M tokenu, staz. ${prices.fetchedAt}`);
rule();

const result = simulate(scenario, price);
printBreakdown(scenario, price, result);
printLevers(scenario, price, result.perMonth);
printModels(scenario, prices, result.perMonth);
printGrowth(scenario, price);

console.log(`\n\n(!) Ceny se meni. Pred citovanim zakaznikovi spust --refresh-prices.`);
console.log(`(!) Vsechny vstupy jdou precist z usage metadat odpovedi — nehadej je.\n`);

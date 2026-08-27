// ============================================================================
// VARIANTA: grounding pres COPILOT RETRIEVAL API (misto Graph Search)
//
// Tentyz agent jako ../solution/agent.ts, jediny rozdil je v retrieve():
// misto lexikalniho Graph Search + stahovani obsahu vola semanticky
// Retrieval API, ktere vraci rovnou CHUNKY.
//
// Co tim z kodu ZMIZI:
//   - buildSearchQuery() ... prepis dotazu na klicova slova = jedno volani
//     modelu na turn navic. Semanticke hledani ho nepotrebuje.
//   - stahovani obsahu souboru /drives/{id}/items/{id}/content
//   - useknuti na 3000 znaku (chunky uz jsou nakrajene)
//
// Co za to platis: LICENCI. Zmereno 2026-08-26 na kurzovnim tenantu:
//   admin (bez licence)          -> 403 "User does not have valid license"
//   user.NN (PAYG meter)         -> 200 + data
//   lektor (M365 Copilot Premium)-> 200 + 0 hitu  (nevysvetlena beta anomalie)
//
// Demo proto jet STUDENTSKYM tokenem, ne lektorskym.
//
// Predchozi stav: ./agent.ts (varianta s Graph Search)
// ============================================================================

import { ActivityTypes } from "@microsoft/agents-activity";
import { AgentApplication, MemoryStorage, TurnContext } from "@microsoft/agents-hosting";
import { AzureOpenAI, OpenAI } from "openai";
import * as fs from "fs";
import { appendFileSync } from "fs";
import * as path from "path";
import config from "./config";
import { TurnState } from "@microsoft/agents-hosting";

const client = new AzureOpenAI({
  apiVersion: "2024-12-01-preview",
  apiKey: config.azureOpenAIKey,
  endpoint: config.azureOpenAIEndpoint,
  deployment: config.azureOpenAIDeploymentName,
  timeout: 30_000,   // explicitni timeout, ne default
  maxRetries: 0,     // retry pisu sam v kroku 15
});

const systemPrompt = [
  "Jsi IT support asistent firmy. Odpovídáš česky, stručně a věcně.",
  "Odpovídáš výhradně na dotazy k IT podpoře podložené firemními runbooky.",
  "Podklady z runbooků použij JEN tehdy, když odpovídají na položený dotaz — pak odpověz přímo z nich:",
  "shrň postup a pod odpověď vypiš citace ve tvaru [číslo] název — odkaz.",
  "Doplňující otázky pokládej jen když podklady žádný použitelný postup neobsahují.",
  "Když odpověď v runbookách není, řekni to a nabídni eskalaci na technika.",
  "Nikdy si nedomýšlej postup ani čísla.",
  "Dotazy mimo IT podporu — mzdy, personalistika, údaje o kolezích — odmítni.",
].join(" ");

function isSupportsFilesEnabled(): boolean {
  const candidates = [
    path.resolve(process.cwd(), "appPackage/manifest.json"),
    path.resolve(__dirname, "../appPackage/manifest.json"),
    path.resolve(__dirname, "../../appPackage/manifest.json"),
  ];
  for (const manifestPath of candidates) {
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        const bots = manifest.bots;
        if (Array.isArray(bots)) {
          return bots.some((bot: any) => bot.supportsFiles === true);
        }
      } catch {
        // Ignore parse errors and try next candidate
      }
    }
  }
  return false;
}

// Define storage and application
const storage = new MemoryStorage();
export const agentApp = new AgentApplication({
  storage,

});

agentApp.onTurn("afterTurn", async () => true); // aktivuje ulozeni TurnState po kazdem turnu


const supportsFilesWarning = isSupportsFilesEnabled()
  ? `⚠️ Notice: The "supportsFiles" option is currently enabled in the app manifest, ` +
  `but file attachment handling is not a supported feature for Custom Engine Agents at this time. ` +
  `Please refer to the known issues documentation for more details: ` +
  `https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/known-issues#custom-engine-agents`
  : "";
let supportsFilesWarned = false;

function classifyError(err: unknown): "transient" | "permanent" {
  if (err instanceof OpenAI.APIConnectionTimeoutError) return "transient";
  if (err instanceof OpenAI.APIConnectionError) return "transient";
  if (err instanceof OpenAI.APIError) {
    const s = err.status ?? 0;
    return s === 429 || s >= 500 ? "transient" : "permanent"; // 401/403/404: opakovani nepomuze
  }
  return "permanent"; // chyba v mem kodu neni duvod k retry
}

// --- ucetni kniha spotreby ---------------------------------------------------
// V KAZDEM DALSIM LABU PREPIS - podle toho se report rozpadne po fazich tydne
const LAB = "knowledge-grounding-retrieval-api";

// kontext jednoho turnu; korelacni ID putuje celym zpracovanim
type TurnLog = { turnId: string; q: string; kolo: number };

function logUsage(tl: TurnLog, u: any) {
  appendFileSync("usage-log.jsonl", JSON.stringify({
    ts: new Date().toISOString(),
    turn: tl.turnId,
    lab: LAB,
    q: tl.q.slice(0, 60),
    kolo: tl.kolo,
    model: "gpt-5-mini",
    in: u?.prompt_tokens ?? 0,
    out: u?.completion_tokens ?? 0,
    reasoning: u?.completion_tokens_details?.reasoning_tokens ?? 0,
    cached: u?.prompt_tokens_details?.cached_tokens ?? 0,
  }) + "\n");
}

async function callModel(
  messages: Parameters<typeof client.chat.completions.create>[0]["messages"],
  opts: { tl?: TurnLog; attempts?: number } = {},
) {
  const attempts = opts.attempts ?? 3;
  let delay = 500;
  for (let i = 1; ; i++) {
    try {
      const r = await client.chat.completions.create({ messages, model: "" });
      // JEDINE misto, kde se loguje spotreba - nejde zapomenout na zadne kolo
      if (opts.tl) { opts.tl.kolo++; logUsage(opts.tl, r.usage); }
      return r;
    } catch (err) {
      if (classifyError(err) === "permanent" || i >= attempts) throw err;
      console.warn(`transientni chyba (pokus ${i}/${attempts}), retry za ${delay} ms`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2; // exponencialni backoff, strop drzi pocet pokusu
    }
  }
}

// --- Grounding pres Microsoft Graph ------------------------------------------
// Prepinac ZIVE/MOCK: existuje-li v projektu soubor .lab-token (delegated token
// z device-auth), grounduje se nad SKUTECNYM tenantem pres Graph Search API
// (respektuje ACL volajiciho); jinak lokalni mock. Soubor, ne env promenna -
// F5 spousti vlastni shelly a env z terminalu nevidi.
function labToken(): string | undefined {
  if (!fs.existsSync(".lab-token")) return undefined;
  const raw = fs.readFileSync(".lab-token");
  // Windows PowerShell 5.1 zapisuje pres '>' v UTF-16LE. Cteni jako utf8 by
  // z tokenu udelalo U+FFFD a fetch by hlavicku Authorization odmitl
  // ("Cannot convert argument to a ByteString"). Detekujeme BOM a dekodujeme spravne.
  const text = raw[0] === 0xff && raw[1] === 0xfe ? raw.toString("utf16le") : raw.toString("utf8");
  return text.replace(/^\uFEFF/, "").trim() || undefined;
}

// Knihovna, na kterou grounding omezujeme. Scoping = mene sumu, min tokenu, nizsi cena.
const RUNBOOKY_PATH = "https://ms365x17157302.sharepoint.com/sites/hr-demo/Runbooky";

type Chunk = { title: string; url: string; text: string };

async function retrieve(query: string, tl: TurnLog): Promise<Chunk[]> {
  const token = labToken();
  console.log(`[retrieve] rezim=${token ? "ZIVE (Retrieval API)" : "MOCK"} | q="${query}"`);

  // MOCK i ZIVA vetev vraci TENTYZ tvar (retrievalHits -> extracts), protoze mock
  // byl podle Retrieval API modelovany. Prepnuti je zmena URL a hlavicky, ne prepis.
  const url = token
    ? "https://graph.microsoft.com/beta/copilot/retrieval"
    : "http://localhost:4002/retrieval";

  const body: any = { queryString: query };
  if (token) {
    body.dataSource = "sharePoint";
    body.maximumNumberOfResults = 3;
    // Zuzeni na knihovnu Runbooky. Tvar filtru je v BETA - kdyby API vratilo
    // BadRequest, posli dotaz bez nej a zuz az vysledky podle webUrl.
    body.filterExpression = `path:"${RUNBOOKY_PATH}"`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    // 403 vs. 200 s prazdnem: nauc agenta rozlisovat "nemam pravo" od "nemam data".
    const detail = await res.text();
    if (res.status === 401) throw new Error("Retrieval API: token vyprsel nebo je neplatny (401)");
    if (res.status === 403) throw new Error("Retrieval API: ucet nema licenci ani PAYG meter (403)");
    throw new Error(`Retrieval API selhalo: ${res.status} ${detail.slice(0, 200)}`);
  }

  const data: any = await res.json();
  const hits: Chunk[] = (data.retrievalHits ?? []).map((h: any) => ({
    title: h.resourceMetadata?.title ?? "runbook",
    url: h.webUrl,
    text: (h.extracts ?? []).map((e: any) => e.text).join("\n"),
  }));

  // 200 s nulou hitu je HORSI diagnoza nez 403 - nevis, jestli data nejsou,
  // nebo je jen nevidis. Proto se to loguje zvlast.
  if (!hits.length) console.log("[retrieve] 200, ale ZADNY hit - data chybi, nebo je ucet nevidi");
  else console.log(`[retrieve] hitu=${hits.length} (${hits.map((c) => c.title).join(", ")})`);
  return hits;
}


agentApp.onConversationUpdate("membersAdded", async (context: TurnContext) => {
  console.log(`>>> TURN start | aktivita: ${context.activity.type} | text: ${context.activity.text}`);
  await context.sendActivity(`Hi there! I'm an agent to chat with you.`);
  console.log(`<<< TURN end`);
  if (supportsFilesWarning && !supportsFilesWarned) {
    supportsFilesWarned = true;
    await context.sendActivity(supportsFilesWarning);
  }
});

// Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS
agentApp.onActivity(ActivityTypes.Message, async (context: TurnContext, state: TurnState) => {
  console.log(`>>> TURN start | aktivita: ${context.activity.type} | text: ${context.activity.text}`);
  const count = (state.getValue<number>("conversation.count") ?? 0) + 1;
  state.setValue("conversation.count", count);
  console.log(`conversation.count = ${count}`);
  if (supportsFilesWarning && !supportsFilesWarned) {
    supportsFilesWarned = true;
    await context.sendActivity(supportsFilesWarning);
  }

  const userText = context.activity.text ?? "";

  try {
    // grounding krok PRED volanim modelu; data jdou jako kontextova zprava
    // korelacni ID turnu - stejne pro vsechna kola uvnitr
    const tl: TurnLog = { turnId: Math.random().toString(36).slice(2, 10), q: userText, kolo: 0 };
    const hits = await retrieve(userText, tl);
    const knowledge = hits.length
      ? "Podklady z runbooků:\n\n" +
        hits.map((h, i) => `[${i + 1}] ${h.title} — ${h.url}\n${h.text}`).join("\n\n")
      : "Podklady z runbooků: žádný runbook k dotazu nenalezen.";

    const result = await callModel([
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
      { role: "user", content: knowledge }, // kontextova zprava: data, ne instrukce chovani
    ], { tl });
    const u = result.usage;
    console.log(
      `usage: prompt=${u?.prompt_tokens} completion=${u?.completion_tokens}` +
      ` (z toho reasoning=${u?.completion_tokens_details?.reasoning_tokens ?? 0})`,
    );
    const answer = result.choices.map((c) => c.message.content ?? "").join("");
    await context.sendActivity(answer || "Model vrátil prázdnou odpověď — zkuste to prosím znovu.");
  } catch (err) {
    console.error("volani modelu selhalo:", err);
    await context.sendActivity(
      "Omlouvám se, teď se mi nedaří spojit s jazykovým modelem. Zkuste to prosím za chvíli, nebo eskalujte na podporu.",
    );
  }

  console.log(`<<< TURN end`);
});

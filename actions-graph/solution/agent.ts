// ============================================================================
// VYSTUPNI STAV PO LABU: actions-graph (den 4, blok 1)
//
// Agent uz nejen odpovida, ale JEDNA: cte profil z Graphu a zaklada tikety
// do SharePoint listu s validovanymi parametry a zadatelem z identity.
// Jedno volani modelu nahradila TOOL-CALL SMYCKA - kola uvnitr turnu.
//
// Startovni cara pro: prompt-orchestration (den 4, blok 2)
// Predchozi stav:     ../../knowledge-grounding/solution/agent.ts
// ============================================================================

import { ActivityTypes } from "@microsoft/agents-activity";
import { AgentApplication, MemoryStorage, TurnContext } from "@microsoft/agents-hosting";
import { AzureOpenAI, OpenAI } from "openai";
import * as fs from "fs";
import { appendFileSync } from "fs";
import * as path from "path";
import config from "./config";
import { graphGet, resolveTicketList } from "./graph-helpers";
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
  "Když v konverzaci dostaneš zprávu začínající 'Podklady z runbooků', odpověz PŘÍMO z nich:",
  "shrň postup a pod odpověď vypiš citace ve tvaru [číslo] název — odkaz.",
  "Doplňující otázky pokládej jen když podklady žádný použitelný postup neobsahují.",
  "Když odpověď v runbookách není, řekni to a nabídni eskalaci na technika.",
  "Nikdy si nedomýšlej postup ani čísla.",
  "Na dotazy k identitě — kdo jsem, moje pozice, můj e-mail, profil kolegy — nehledej v runbookách, ale použij nástroj lookup_user.",
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
const LAB = "actions-graph";

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
  opts: { tl?: TurnLog; tools?: any[]; attempts?: number } = {},
) {
  const attempts = opts.attempts ?? 3;
  let delay = 500;
  for (let i = 1; ; i++) {
    try {
      const r = await client.chat.completions.create({
        messages, model: "", ...(opts.tools ? { tools: opts.tools } : {}),
      });
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

// web, kam se zapisuji tikety (list Tikety)
const SITE_PATH = "ms365x17157302.sharepoint.com:/sites/hr-demo";

type Chunk = { title: string; url: string; text: string };

// Graph Search je LEXIKALNI (KQL): cela veta uzivatele nenajde nic a slova se
// navic ANDuji. Proto krok navic - model z dotazu udela klicova slova spojena OR.
// Je to dalsi KOLO uvnitr turnu, tedy dalsi placene volani modelu.
async function buildSearchQuery(userText: string, tl: TurnLog): Promise<string> {
  const r = await callModel([
    { role: "system", content: "Z dotazu vytvoř 2-5 klíčových slov pro fulltextové vyhledávání. Vrať POUZE slova oddělená mezerou, bez interpunkce a bez vysvětlení." },
    { role: "user", content: userText },
  ], { tl });
  const raw = r.choices[0]?.message?.content ?? "";
  const words = raw.trim().replace(/[".,'\n]/g, " ").split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  return `(${words.join(" OR ")}) AND path:"${RUNBOOKY_PATH}"`;
}

async function retrieve(query: string, tl: TurnLog): Promise<Chunk[]> {
  const token = labToken();
  console.log(`[retrieve] rezim=${token ? "ZIVE" : "MOCK"} | q="${query}"`);

  if (!token) {
    const res = await fetch("http://localhost:4002/retrieval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryString: query }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`mock retrieval selhal: ${res.status}`);
    const data = await res.json();
    const hits = (data.retrievalHits ?? []).map((h: any) => ({
      title: h.resourceMetadata?.title ?? "runbook",
      url: h.webUrl,
      text: (h.extracts ?? []).map((e: any) => e.text).join("\n"),
    }));
    console.log(`[retrieve] hitu=${hits.length}`);
    return hits;
  }

  // 1. dotaz uzivatele -> klicova slova (KQL)
  const kql = await buildSearchQuery(query, tl);
  if (!kql) { console.log("[retrieve] prazdny dotaz po prepisu"); return []; }
  console.log(`[retrieve] KQL: ${kql}`);

  // 2. Graph Search - vraci jen to, na co ma volajici pravo (ACL trimming)
  const sr = await fetch("https://graph.microsoft.com/v1.0/search/query", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [{
        entityTypes: ["driveItem"],
        query: { queryString: kql },
        size: 3,
        fields: ["name", "webUrl", "parentReference", "id"],
      }],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!sr.ok) throw new Error(`Graph Search selhal: ${sr.status}`);
  const searchJson: any = await sr.json();
  const found = searchJson.value?.[0]?.hitsContainers?.[0]?.hits ?? [];

  // 3. stazeni obsahu nalezenych souboru
  const chunks: Chunk[] = [];
  for (const h of found) {
    const item = h.resource;
    const cr = await fetch(
      `https://graph.microsoft.com/v1.0/drives/${item.parentReference.driveId}/items/${item.id}/content`,
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000) },
    );
    if (cr.ok) chunks.push({ title: item.name, url: item.webUrl, text: (await cr.text()).slice(0, 3000) });
  }
  console.log(`[retrieve] hitu=${chunks.length} (${chunks.map((c) => c.title).join(", ")})`);
  return chunks;
}


// --- Nastroje agenta ---------------------------------------------------------
// Pravidlo: co si model NESMI vybrat, nedavej mu do schematu. Proto tu neni
// requester - bere se z identity volajiciho, ne z navrhu modelu.
const tools = [
  {
    type: "function" as const,
    function: {
      name: "lookup_user",
      description: "Vrátí profil uživatele z firemního adresáře. Bez parametru vrátí profil tazatele.",
      parameters: {
        type: "object",
        properties: { upn: { type: "string", description: "e-mail hledaného uživatele; vynech pro tazatele" } },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_ticket",
      description: "Založí tiket podpory, když runbook nepomohl a je potřeba technik.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "krátký nadpis tiketu" },
          priority: { type: "string", description: "P1, P2 nebo P3" },
          description: { type: "string" },
        },
        required: ["title", "priority", "description"],
      },
    },
  },
];

async function executeTool(name: string, args: any, context: TurnContext): Promise<string> {
  const token = labToken();

  if (name === "lookup_user") {
    const r = await graphGet(args.upn ? `/users/${encodeURIComponent(args.upn)}` : "/me", token);
    return JSON.stringify(r.ok ? r.data : { error: r.userMessage });
  }

  if (name === "create_ticket") {
    // VALIDACE pred zapisem: nevalidni vstup nesmi vest k volani API vubec
    const errors: string[] = [];
    if (!["P1", "P2", "P3"].includes(args.priority)) errors.push("priority musí být P1, P2 nebo P3");
    if (!args.title?.trim()) errors.push("title je povinný");
    if ((args.title ?? "").length > 120) errors.push("title max 120 znaků");
    if (!args.description?.trim()) errors.push("description je povinný");
    if ((args.description ?? "").length > 2000) errors.push("description max 2000 znaků");
    if (errors.length) return JSON.stringify({ error: "validace selhala", details: errors });

    if (!token) return JSON.stringify({ error: "chybí token, nemohu založit tiket" });
    const { siteId, listId } = await resolveTicketList(SITE_PATH, token);
    const res = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields: {
        Title: args.title,
        Priorita: args.priority,
        Popis: args.description,
        // ZADATEL Z IDENTITY, ne z navrhu modelu. Created By navic doplni
        // SharePoint z tokenu - to je to, co vi platforma.
        Zadavatel: context.activity.from?.name ?? "unknown",
      }}),
      signal: AbortSignal.timeout(15_000),
    });
    const d: any = await res.json();
    if (!res.ok) return JSON.stringify({ error: `zápis selhal: ${d.error?.code}` });
    return JSON.stringify({ id: d.id, url: d.webUrl });
  }

  return JSON.stringify({ error: `neznámý nástroj: ${name}` });
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

    // TOOL-CALL SMYCKA: kola uvnitr jednoho turnu. Model si vyzada nastroj,
    // dostane vysledek a teprve pak formuluje odpoved.
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
      { role: "user", content: knowledge }, // kontextova zprava: data, ne instrukce chovani
    ];

    let result;
    for (let kolo = 1; kolo <= 4; kolo++) {
      result = await callModel(messages, { tl, tools });
      const msg = result.choices[0].message;
      if (!msg.tool_calls?.length) break; // model uz nechce nastroj -> finalni odpoved
      messages.push(msg);
      for (const tc of msg.tool_calls) {
        console.log(`[kolo ${kolo}] ${tc.function.name}(${tc.function.arguments})`);
        const outcome = await executeTool(tc.function.name, JSON.parse(tc.function.arguments || "{}"), context);
        messages.push({ role: "tool", tool_call_id: tc.id, content: outcome });
      }
    }

    const u = result!.usage;
    console.log(
      `usage: prompt=${u?.prompt_tokens} completion=${u?.completion_tokens}` +
      ` (z toho reasoning=${u?.completion_tokens_details?.reasoning_tokens ?? 0})`,
    );
    const answer = result!.choices.map((c) => c.message.content ?? "").join("");
    await context.sendActivity(answer || "Model vrátil prázdnou odpověď — zkuste to prosím znovu.");
  } catch (err) {
    console.error("volani modelu selhalo:", err);
    await context.sendActivity(
      "Omlouvám se, teď se mi nedaří spojit s jazykovým modelem. Zkuste to prosím za chvíli, nebo eskalujte na podporu.",
    );
  }

  console.log(`<<< TURN end`);
});

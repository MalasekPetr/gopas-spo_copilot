// ============================================================================
// VYSTUPNI STAV PO LABU: agents-sdk-core (den 3, blok 1)
//
// Agent vola model, drzi stav v TurnState a korektne odpovi i kdyz model
// selze nebo vyprsi timeout. Zadne znalosti, zadne akce - to prijde dal.
//
// Startovni cara pro: knowledge-grounding (den 3, blok 2)
// ============================================================================

import { ActivityTypes } from "@microsoft/agents-activity";
import { AgentApplication, MemoryStorage, TurnContext } from "@microsoft/agents-hosting";
import { AzureOpenAI, OpenAI } from "openai";
import * as fs from "fs";
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

async function callModel(
  messages: Parameters<typeof client.chat.completions.create>[0]["messages"],
  attempts = 3,
) {
  let delay = 500;
  for (let i = 1; ; i++) {
    try {
      return await client.chat.completions.create({ messages, model: "" });
    } catch (err) {
      if (classifyError(err) === "permanent" || i >= attempts) throw err;
      console.warn(`transientni chyba (pokus ${i}/${attempts}), retry za ${delay} ms`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2; // exponencialni backoff, strop drzi pocet pokusu
    }
  }
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
    const result = await callModel([
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
    ]);
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

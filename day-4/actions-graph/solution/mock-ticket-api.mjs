// Mock ticket API pro lab actions-graph — bez závislostí, čistý Node.
// Spuštění:  node mock-ticket-api.mjs          (port 4000, přepis: PORT=…)
// Self-test: node mock-ticket-api.mjs --self-test
//
// Endpointy:
//   POST   /tickets   { priority, description, requester } -> 201 { id, ... }
//   GET    /tickets   -> seznam založených tiketů (ověření z labu)
//   DELETE /tickets   -> reset úložiště
//   hlavička `x-force: 429` na POST -> 429 + Retry-After: 2  (test transientní větve)
//
// API záměrně NIC nevaliduje — validace je práce agenta (část B labu).
// Tiket s prioritou "banana" tady projde; to je pointa, ne bug.

import { createServer } from "http";

const SELF_TEST = process.argv.includes("--self-test");
const PORT = SELF_TEST ? 0 : Number(process.env.PORT ?? 4000); // self-test: nahodny volny port, nekoliduje s bezici instanci
let tickets = [];
let nextId = 1001;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body, null, 2));
}

const server = createServer((req, res) => {
  const { method, url } = req;
  if (url !== "/tickets") return json(res, 404, { error: "not found" });

  if (method === "GET") return json(res, 200, tickets);
  if (method === "DELETE") { tickets = []; nextId = 1001; return json(res, 200, { reset: true }); }

  if (method === "POST") {
    if (req.headers["x-force"] === "429") {
      res.writeHead(429, { "Retry-After": "2", "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "throttled (vynuceno hlavickou x-force)" }));
    }
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      let body;
      try { body = JSON.parse(raw); } catch { return json(res, 400, { error: "telo neni JSON" }); }
      const ticket = {
        id: `T-${nextId++}`,
        priority: body.priority ?? null,
        description: body.description ?? null,
        requester: body.requester ?? null,
        createdAt: new Date().toISOString(),
      };
      tickets.push(ticket);
      console.log(`[ticket] ${ticket.id} priority=${ticket.priority} requester=${ticket.requester}`);
      return json(res, 201, ticket);
    });
    return;
  }
  json(res, 405, { error: "method not allowed" });
});

server.listen(PORT, async () => {
  const port = server.address().port;
  console.log(`Mock ticket API bezi na http://localhost:${port}/tickets`);
  if (SELF_TEST) {
    const base = `http://localhost:${port}/tickets`;
    const post = await fetch(base, { method: "POST", body: JSON.stringify({ priority: "P2", description: "test", requester: "self-test" }) });
    const throttled = await fetch(base, { method: "POST", headers: { "x-force": "429" }, body: "{}" });
    const list = await (await fetch(base)).json();
    console.log(`self-test: POST=${post.status} (ocekavano 201), x-force=${throttled.status}/Retry-After=${throttled.headers.get("retry-after")} (429/2), GET pocet=${list.length} (1)`);
    process.exit(post.status === 201 && throttled.status === 429 && list.length === 1 ? 0 : 1);
  }
});

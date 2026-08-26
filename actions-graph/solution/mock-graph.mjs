// Mock Graph endpoint pro lab actions-graph (fallback části A) — bez závislostí.
// Simuluje hranici oprávnění delegated identity: /me projde, cizí uživatel 403,
// neznámý 404, hlavička x-force: 429 vrátí throttling s Retry-After.
//
// Spuštění:  node mock-graph.mjs               (port 4001; identitu přepíše MOCK_ME)
// Self-test: node mock-graph.mjs --self-test
//
// Endpointy (tvar odpovědí zjednodušený, drží jen pole použitá v labu):
//   GET /v1.0/me
//   GET /v1.0/users/<upn>

import { createServer } from "http";

const PORT = Number(process.env.PORT ?? 4001);
const ME = process.env.MOCK_ME ?? "user.11@spdemo.online";
// existující kolegové = 403 (nemáš oprávnění); kdokoli jiný = 404 (neexistuje)
const KNOWN = new Set(["novak@spdemo.online", "jana.k@spdemo.online", ME]);

function json(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(body, null, 2));
}

const server = createServer((req, res) => {
  if (req.headers["x-force"] === "429")
    return json(res, 429, { error: { code: "TooManyRequests", message: "throttled (vynuceno)" } }, { "Retry-After": "2" });

  const me = { userPrincipalName: ME, displayName: "Kurzovni Student", jobTitle: "IT Support", officeLocation: "Praha" };
  if (req.url === "/v1.0/me") return json(res, 200, me);

  const m = req.url?.match(/^\/v1\.0\/users\/([^/]+)$/);
  if (m) {
    const upn = decodeURIComponent(m[1]).toLowerCase();
    if (upn === ME.toLowerCase()) return json(res, 200, me);
    if (KNOWN.has(upn)) {
      // simulace app-only: bez uzivatele v hovoru zadny ACL trimming neni -
      // "cizi" profil se ochotne vrati. Pointa casti D labu.
      if (req.headers["x-auth-mode"] === "app-only")
        return json(res, 200, { userPrincipalName: upn, displayName: "Jan Novák", jobTitle: "CFO", officeLocation: "Praha", mobilePhone: "+420 777 000 111" });
      return json(res, 403, { error: { code: "Authorization_RequestDenied", message: "Insufficient privileges to complete the operation." } });
    }
    return json(res, 404, { error: { code: "Request_ResourceNotFound", message: `Resource '${upn}' does not exist.` } });
  }
  json(res, 404, { error: { code: "Request_ResourceNotFound", message: "unknown route" } });
});

server.listen(PORT, async () => {
  console.log(`Mock Graph bezi na http://localhost:${PORT}/v1.0/me (ja = ${ME})`);
  if (process.argv.includes("--self-test")) {
    const s = async (p, h = {}) => (await fetch(`http://localhost:${PORT}${p}`, { headers: h })).status;
    const results = [
      ["GET /me", await s("/v1.0/me"), 200],
      ["cizí známý", await s("/v1.0/users/novak@spdemo.online"), 403],
      ["neznámý", await s("/v1.0/users/nikdo@spdemo.online"), 404],
      ["x-force 429", await s("/v1.0/me", { "x-force": "429" }), 429],
      ["cizí v app-only", await s("/v1.0/users/novak@spdemo.online", { "x-auth-mode": "app-only" }), 200],
    ];
    for (const [name, got, want] of results) console.log(`self-test: ${name} = ${got} (ocekavano ${want})`);
    process.exit(results.every(([, g, w]) => g === w) ? 0 : 1);
  }
});

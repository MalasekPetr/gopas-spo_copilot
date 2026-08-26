// Delegated token přes device code flow — bez knihoven, jen fetch.
// Použití v labu (varianta ŽIVĚ, jen na pokyn instruktora):
//
//   LAB_CLIENT_ID=<client id od instruktora> node device-auth.mjs "User.Read Files.Read.All Sites.Read.All"
//
// Vypíše kód pro https://microsoft.com/devicelogin, po přihlášení vypíše access
// token na stdout. Token si ulož do proměnné prostředí terminálu, kde běží agent
// (žije ~1 h) — NIKDY do souboru, NIKDY do repa.
//
// Vyžaduje app registraci v tenantu spdemo.online s povoleným public client flow
// a delegated oprávněními (zakládá instruktor — viz instructor-notes).

const TENANT = process.env.LAB_TENANT ?? "spdemo.online";
const CLIENT_ID = process.env.LAB_CLIENT_ID;
const SCOPES = process.argv[2] ?? "User.Read";

if (!CLIENT_ID) {
  console.error("Chybi LAB_CLIENT_ID (client id app registrace - da instruktor).");
  process.exit(1);
}

const form = (o) => new URLSearchParams(o);
const base = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0`;

const dc = await (await fetch(`${base}/devicecode`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: form({ client_id: CLIENT_ID, scope: SCOPES }),
})).json();

if (!dc.device_code) { console.error("devicecode selhal:", dc.error_description ?? dc); process.exit(1); }
console.error(dc.message); // instrukce s kodem jde na stderr, token pak cisty na stdout

for (;;) {
  await new Promise((r) => setTimeout(r, (dc.interval ?? 5) * 1000));
  const tok = await (await fetch(`${base}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form({ grant_type: "urn:ietf:params:oauth:grant-type:device_code", client_id: CLIENT_ID, device_code: dc.device_code }),
  })).json();
  if (tok.access_token) { console.log(tok.access_token); process.exit(0); }
  if (tok.error !== "authorization_pending") { console.error("token selhal:", tok.error_description ?? tok.error); process.exit(1); }
}

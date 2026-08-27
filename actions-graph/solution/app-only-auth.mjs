// App-only token (client credentials flow) — pro instruktorské demo části D.
// Protiklad k device-auth.mjs: tam se přihlašuje UŽIVATEL, tady APLIKACE sama.
// Právě proto v hovoru není nikdo, komu by se dalo ACL trimmovat.
//
// Spuštění (PowerShell, ve složce projektu agenta):
//   $env:APPONLY_CLIENT_ID = "<client id registrace spo-copilot-apponly>"
//   $env:APPONLY_SECRET    = "<client secret>"
//   node <klon-repa>/actions-graph/solution/app-only-auth.mjs | Out-File .lab-token-apponly -Encoding ascii -NoNewline
//
// Token jde na stdout, instrukce a diagnostika na stderr — proto to jde
// přesměrovat rovnou do souboru. NE přes `>` — Windows PowerShell 5.1 by zapsal
// UTF-16LE a token by byl nečitelný (viz .lab-token ve středu).
//
// POZOR: tenhle token nese oprávnění APLIKACE nad celým tenantem. Nepatří
// do repa, nerozdává se studentům a po demu se maže i s registrací.

const TENANT = process.env.APPONLY_TENANT ?? "spdemo.online";
const CLIENT_ID = process.env.APPONLY_CLIENT_ID;
const SECRET = process.env.APPONLY_SECRET;

if (!CLIENT_ID || !SECRET) {
  console.error("Chybi APPONLY_CLIENT_ID nebo APPONLY_SECRET.");
  console.error("Nastav je jako promenne prostredi; do souboru je nepis.");
  process.exit(1);
}

const res = await fetch(`https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: SECRET,
    // u client credentials se NEuvadeji jednotlive scopy, ale .default -
    // token dostane vsechna APPLICATION opravneni, ktera ma registrace nagrantovana
    scope: "https://graph.microsoft.com/.default",
  }),
});

const data = await res.json();

if (!data.access_token) {
  console.error(`Token se nepodarilo ziskat: ${data.error ?? res.status}`);
  console.error((data.error_description ?? "").split("\n")[0]);
  process.exit(1);
}

// diagnostika na stderr, at zustane stdout cisty pro presmerovani
const claims = JSON.parse(Buffer.from(data.access_token.split(".")[1], "base64").toString());
console.error(`APP-ONLY token ziskan`);
console.error(`  aplikace : ${claims.app_displayname ?? claims.appid}`);
console.error(`  role     : ${(claims.roles ?? []).join(", ") || "(zadne — chybi admin consent?)"}`);
console.error(`  vyprsi   : ${new Date(claims.exp * 1000).toLocaleTimeString()}`);
console.error(`  V tokenu NENI zadny uzivatel — proto neni koho ACL trimmovat.`);

console.log(data.access_token);

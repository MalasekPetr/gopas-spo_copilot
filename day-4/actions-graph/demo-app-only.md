# App-only demo — příprava a rozhodnutí

> Modul: `actions-graph` (den 4, část D) · **podklad pro instruktora**
> Lab: [`lab-actions-and-graph.md`](lab-actions-and-graph.md)
> [!IMPORTANT] Studentům se nic nerozdává (revize původního rozhodnutí 2026-08-26)
> Původní plán z 2026-08-06 počítal s rozdáním app-only credentials studentům.
> **Neděláme to** ze tří důvodů: část D je první kompresní ventil dne a jede jako
> demo tak jako tak · rozdaný secret s application permissions znamená 20 kopií klíče
> nad celým tenantem · a mock pointu pokrývá beze zbytku. **Instruktor předvádí,
> studenti se dívají**; kdo si to chce osahat, spustí `mock-graph.mjs` s hlavičkou
> `x-auth-mode: app-only`.

**Příprava (~5 min, den předem):**

1. **Samostatná registrace** `spo-copilot-apponly` — ne ta studentská. Když ji po kurzu
   smažeš, nerozbiješ jim delegated tok.
2. API permissions → **Application** (ne Delegated): `User.Read.All`.
   Přidej `Sites.ReadWrite.All`, jen když chceš i krok 15 (tiket podepsaný aplikací).
   → **Grant admin consent**.
3. Certificates & secrets → nový secret s **expirací na konec kurzovního týdne**.
4. Token si vyrob skriptem — klikání v Postmanu před třídou se nedělá:

   ```powershell
   $env:APPONLY_CLIENT_ID = "<client id>"
   $env:APPONLY_SECRET    = "<secret>"
   node <klon-repa>/day-4/actions-graph/solution/app-only-auth.mjs | Out-File .lab-token-apponly -Encoding ascii -NoNewline
   ```

   Skript vypíše na stderr **role v tokenu** — když je seznam prázdný, chybí admin
   consent a demo by selhalo až před lidmi.
5. **Projet demo den předem**: `/users/user.11` musí pod app-only vrátit **200 s profilem**,
   zatímco pod delegated tokenem vrací 403.

**Gitignore:** v projektu agenta použij vzor `.lab-token*`, ať pokryje i
`.lab-token-apponly`.

**Po kurzu:** smazat celou registraci `spo-copilot-apponly` — tím zmizí i secret a je
po úklidu. Soubor `.lab-token-apponly` smazat z disku.

> [!TIP] Věta do výkladu, která z demo udělá lekci
> Až budeš ukazovat `Sites.ReadWrite.All` jako application permission, řekni, že
> **správná odpověď v produkci je `Sites.Selected`** — application oprávnění, které dá
> přístup jen k webům, které explicitně povolíš. Je to scope minimalizace, kterou blok
> učí, aplikovaná sama na sebe.

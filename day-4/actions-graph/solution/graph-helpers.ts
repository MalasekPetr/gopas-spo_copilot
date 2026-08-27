// Obslužný kód pro lab actions-graph — zkopíruj do src/ a importuj.
//
// Tyhle dvě funkce jsou ROZŠÍŘENÍ toho, co ses naučil v labu agents-sdk-core:
// stejné rozlišení transientní/permanentní chyby a stejný retry s backoffem,
// jen nad Microsoft Graphem místo modelu. Nepíšeš je znovu, aby ti čas zbyl
// na to, co blok skutečně učí: nástroje, tool-call smyčku, validaci a identitu.
//
// Použití v src/agent.ts:
//   import { graphGet, resolveTicketList } from "./graph-helpers";
//
// labToken() si helper bere z tvého agenta — proto se předává jako parametr.

export type GraphResult = { ok: boolean; data?: any; userMessage?: string };

/**
 * GET na Microsoft Graph s rozlišenými chybovými větvemi.
 *
 * 429 = transientní  -> respektuje Retry-After, opakuje se
 * 403 = permanentní  -> nemáš oprávnění (Graph vrací 403 i pro NEEXISTUJÍCÍ
 *                       objekt, aby neprozradil, že neexistuje)
 * 404 = permanentní  -> objekt neexistuje
 *
 * Chyba se nevyhazuje jako výjimka — vrací se jako `userMessage`, aby ji model
 * mohl přeformulovat uživateli. Stack trace patří do terminálu, ne do chatu.
 */
export async function graphGet(
  path: string,
  token: string | undefined,
  attempts = 3,
): Promise<GraphResult> {
  if (!token) return { ok: false, userMessage: "Nemám přístup k adresáři (chybí token)." };

  for (let i = 1; ; i++) {
    const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 429 && i < attempts) {
      const wait = Number(res.headers.get("retry-after") ?? "1") * 1000;
      console.warn(`[graph] 429, cekam ${wait} ms (pokus ${i}/${attempts})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (res.status === 403) return { ok: false, userMessage: "Na tuhle informaci nemáš oprávnění." };
    if (res.status === 404) return { ok: false, userMessage: "Takový objekt neexistuje." };
    if (!res.ok) return { ok: false, userMessage: "Adresář teď neodpovídá, zkus to prosím později." };
    return { ok: true, data: await res.json() };
  }
}

/**
 * Dohledá ID webu a listu Tikety. Výsledek se cachuje — ID se nemění,
 * ale zjišťovat je při každém tiketu jsou dvě volání navíc zdarma.
 *
 * Žádné GUIDy natvrdo v kódu: cesta k webu je čitelná a přenositelná
 * mezi tenanty, GUID není.
 */
let ticketTarget: { siteId: string; listId: string } | undefined;

export async function resolveTicketList(sitePath: string, token: string) {
  if (ticketTarget) return ticketTarget;
  const headers = { Authorization: `Bearer ${token}` };

  const siteRes = await fetch(`https://graph.microsoft.com/v1.0/sites/${sitePath}`, { headers });
  if (!siteRes.ok) throw new Error(`web ${sitePath} nenalezen: ${siteRes.status}`);
  const site = await siteRes.json();

  const listsRes = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${site.id}/lists?$select=displayName,id`,
    { headers },
  );
  const lists = await listsRes.json();
  const list = (lists.value ?? []).find((l: any) => l.displayName === "Tikety");
  if (!list) throw new Error("list Tikety nenalezen — zkontroluj název a oprávnění");

  ticketTarget = { siteId: site.id, listId: list.id };
  return ticketTarget;
}

# Demo — aktivita vs. turn

> Modul: `agents-sdk-core` (den 3) · **podklad pro instruktora**, k části A labu
> Lab: [`lab-first-agent.md`](lab-first-agent.md)
Do obou handlerů `console.log(">>> TURN start | aktivita: ${type} | text: ${text}")`
a `"<<< TURN end"`. Pak v Playgroundu:

1. **Restart konverzace** → turn s `conversationUpdate | text: undefined`. Nahlas:
   *proběhl celý turn a nikdo nic nenapsal* — tentýž `undefined`, kvůli kterému se
   opravoval `activity.text ?? ""`.
2. **„ahoj"** → druhý turn, uvnitř jedno volání modelu.
3. Mezera mezi logy = prostor pro **kola**: dnes jedno volání, od `actions-graph` víc.
   Jeden turn ≠ jedno volání modelu — platí se každé kolo.
4. **„Kdo je Alex Wilber?"** — padne hned po startu. Simulovaná persona z Microsoft demo
   dat; Playground simuluje uživatele a kanály (Personal/Group/Channel), ne tenant.
   Dvě dema zadarmo: čítač z části B se testuje **přepnutím Personal → Group Chat**
   (nová konverzace = scope od nuly, bez restartu); a Alex bez tokenů je důvod, proč
   delegated Graph v Playgroundu nepojede (`actions-graph`, mock endpoint).

Tabule: *aktivita = co přišlo (podstatné jméno) · turn = co se s tím dělo (děj) ·
konverzace = série turnů nad stavem.* Věta pro zákazníka: turn je jednotka zpracování
(latence, tokeny za kola), aktivita jednotka doručení. Typ parametru se jmenuje
`TurnContext` — jméno je odpověď.

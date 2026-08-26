# Runbook · Upload do SharePointu hlásí Access denied

Lokální kopie pro mock retrieval (fallback labu). Plná verze žije v knihovně
`Runbooky` na `/sites/hr-demo`.

Když upload souboru hlásí access denied, ověř nejprve, že uživatel patří do skupiny
Members cílového webu, a ne jen Visitors. Visitors mají jen čtení a upload vždy
selže s hláškou access denied bez dalšího vysvětlení.

Pokud je členství správné, zkontroluj, jestli knihovna nemá vyžadované checkout
nebo povinná metadata — nevyplněný povinný sloupec se při synchronizaci přes
OneDrive klienta projeví také jako access denied, i když jde ve skutečnosti
o validaci.

Poslední častá příčina je zámek souboru po předchozí přerušené relaci. Zámek
vyprší do 10 minut; když spěcháš, uvolní ho vlastník webu přes správu knihovny.
Když nic z toho nepomůže, eskaluj na tým podpory s přesným časem pokusu a URL
knihovny.

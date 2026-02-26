# Kuidas käivitada client_logos migratsiooni

## Samm 1: Ava Supabase Dashboard
1. Mine aadressile https://supabase.com/dashboard
2. Vali projekt: axcetvmpbzlpoosywmdp

## Samm 2: Käivita SQL migratsioon
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/create_client_logos_table.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

## Samm 3: Kontrolli tulemust
1. Mine "Table Editor"
2. Peaksid nägema uut tabelit nimega "client_logos"
3. Tabelis peaks olema 8 mock klienti (Swedbank, Elisa, Bolt, jne)

## Valikuline: Storage setup logode jaoks
Kui soovid kasutada päris logosid (mitte ainult teksti):

1. Mine "Storage" → "New Bucket"
2. Loo bucket nimega "client-logos"
3. Märgi "Public bucket" (et logod oleksid avalikud)
4. Lae üles kliendi logod
5. Kopeeri pildi avalik URL
6. Mine admin paneelile `/admin/clients` ja lisa/muuda klienti

## Admin paneel
Pärast migratsiooni saad klientide logosid hallata:
- Mine: http://localhost:3000/admin/clients (või sinu domeenile)
- Pead olema sisse logitud admin kasutajana
- Seal saad lisada, muuta ja kustutada klientide logosid
- Saad valida kas kasutada mock lahendust (tekst) või päris pilte

# Kuidas käivitada migratsioonid

## Samm 1: Ava Supabase Dashboard
1. Mine aadressile https://supabase.com/dashboard
2. Vali projekt: axcetvmpbzlpoosywmdp

## Samm 2: Käivita SQL migratsioonid

### Client Logos tabel
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/create_client_logos_table.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

### Social Stats tabel (jälgijad ja vaatamised)
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/create_social_stats_table.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

## Samm 3: Kontrolli tulemust
1. Mine "Table Editor"
2. Peaksid nägema tabeleid:
   - "client_logos" (8 mock klienti)
   - "social_stats" (jälgijate ja vaatamiste arv)

## Valikuline: Storage setup logode jaoks
Kui soovid kasutada päris logosid (mitte ainult teksti):

1. Mine "Storage" → "New Bucket"
2. Loo bucket nimega "client-logos"
3. Märgi "Public bucket" (et logod oleksid avalikud)
4. Lae üles kliendi logod
5. Kopeeri pildi avalik URL
6. Mine admin paneelile `/admin/clients` ja lisa/muuda klienti

## Admin paneel
Pärast migratsiooni saad hallata:

### Klientide logosid
- Mine: `/admin/clients`
- Saad lisada, muuta ja kustutada klientide logosid
- Saad valida kas kasutada mock lahendust (tekst) või päris pilte

### Sotsiaalmeedia statistika
- Mine: `/admin/social-stats`
- Saad muuta jälgijate arvu (nt. 15.4K, 20K)
- Saad muuta vaatamiste arvu (nt. 1M+, 2M+)
- Muudatused kajastuvad kohe avalikul lehel

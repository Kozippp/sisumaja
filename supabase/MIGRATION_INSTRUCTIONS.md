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

### Client Logos Storage Bucket
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/create_client_logos_storage_bucket.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

### Client Logos Display Settings (zoom ja positsioon)
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/add_logo_display_settings.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

### Social Stats tabel (jälgijad ja vaatamised)
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/create_social_stats_table.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

### Featured YouTube Videos tabel
1. Vasakpoolselt menüüst vali "SQL Editor"
2. Kliki "New Query"
3. Kopeeri kogu sisu failist: `supabase/migrations/create_featured_videos_table.sql`
4. Kleebi see SQL Editori
5. Kliki "Run" või vajuta Ctrl/Cmd + Enter

## Samm 3: Kontrolli tulemust
1. Mine "Table Editor"
2. Peaksid nägema tabeleid:
   - "client_logos" (8 mock klienti)
   - "social_stats" (jälgijate ja vaatamiste arv)
   - "featured_videos" (YouTube videod carousel'i jaoks)
3. Mine "Storage"
4. Peaksid nägema bucket'i nimega "client-logos"

## Admin paneel
Pärast migratsiooni saad hallata:

### Klientide logosid
- Mine: `/admin/clients`
- Saad lisada, muuta ja kustutada klientide logosid
- Saad valida kas kasutada mock lahendust (tekst) või päris pilte
- **UUS:** Saad otse üles laadida pilte - ei pea enam käsitsi Supabase Storage'sse minema!
- **UUS:** Saad reguleerida logo suurust (zoom 50-400%) ja positsiooni, et kõik logod oleksid ühtlaselt nähtavad

### Sotsiaalmeedia statistika
- Mine: `/admin/social-stats`
- Saad muuta jälgijate arvu (nt. 15.4K, 20K)
- Saad muuta vaatamiste arvu (nt. 1M+, 2M+)
- Muudatused kajastuvad kohe avalikul lehel

### YouTube videod
- Mine: `/admin/featured-videos`
- Lisa YouTube video URL või video ID
- Süsteem fetchib automaatselt:
  - Video thumbnail
  - Video pealkiri
  - Vaatamiste arv
- Saad:
  - Syncida andmeid YouTube'iga (uuendab vaatamiste arvu)
  - Muuta videote järjekorda
  - Peita/näidata videoid
  - Kustutada videoid
- Videod kuvatakse avalehel carousel'ina
- Klikkimine avab video YouTube'is uues aknas


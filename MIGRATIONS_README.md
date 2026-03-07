# Kuidas käivitada migratsioonid

Migratsioonid asuvad kaustas `supabase/migrations/`.

## Migratsioonide käivitamine Supabase Dashboard'ist

1. Mine Supabase projektile: https://app.supabase.com/project/axcetvmpbzlpoosywmdp
2. Vali vasakult menüüst "SQL Editor"
3. Ava fail ja kopeeri selle sisu:
   - `supabase/migrations/create_shorts_videos_table.sql`
   - `supabase/migrations/create_shorts_videos_storage.sql`
   - `supabase/migrations/create_youtube_ad_videos_table.sql` (UUS)
   - `supabase/migrations/create_youtube_ad_videos_storage.sql` (UUS)
4. Klõpsa "Run"

## Uued migratsioonid

### 3. create_youtube_ad_videos_table.sql
Loob tabeli `youtube_ad_videos`, mis hoiab YouTube'i reklaamvideote näidiseid.

### 4. create_youtube_ad_videos_storage.sql
Loob Supabase Storage'is bucketi `youtube-ad-videos`, kuhu saab üles laadida videoid ja pisipilte.

## Peale migratsioonide käivitamist

Uus admin leht on saadaval aadressil: `/admin/youtube-ad-videos`

Sealt saad:
- Üles laadida uue video "Reklaam YouTube'i videos" sektsiooni jaoks
- See video ilmub avalehel vastavasse sektsiooni

# Kuidas käivitada migratsioonid

Migratsioonid asuvad kaustas `supabase/migrations/`.

## Migratsioonide käivitamine Supabase Dashboard'ist

1. Mine Supabase projektile: https://app.supabase.com/project/axcetvmpbzlpoosywmdp
2. Vali vasakult menüüst "SQL Editor"
3. Ava fail ja kopeeri selle sisu:
   - `supabase/migrations/create_shorts_videos_table.sql`
   - `supabase/migrations/create_shorts_videos_storage.sql`
4. Klõpsa "Run"

## Uued migratsioonid

### 1. create_shorts_videos_table.sql
Loob tabeli `shorts_videos`, mis hoiab lühivideote informatsiooni.

### 2. create_shorts_videos_storage.sql
Loob Supabase Storage'is bucketi `shorts-videos`, kuhu saab üles laadida video faile ja pisipilte.

## Peale migratsioonide käivitamist

Uus admin leht on saadaval aadressil: `/admin/shorts-videos`

Sealt saad:
- Üles laadida uusi videoid
- Hallata olemasolevaid videoid
- Muuta videote järjekorda
- Peita/näidata videoid avalikul lehel

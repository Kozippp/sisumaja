# YouTube Featured Videos - Kasutamisjuhend

## Ülevaade
Süsteem võimaldab hallata YouTube'i videoid, mis kuvatakse avalehe "Kes on Kozip" sektsioonis carousel'ina. Kõik andmed (thumbnail, pealkiri, vaatamised) fetchitakse automaatselt YouTube'i API-st.

---

## 1️⃣ Migratsiooni käivitamine

Enne kui saad süsteemi kasutada, pead käivitama Supabase'is SQL migratsiooni:

1. Mine **Supabase Dashboard**: https://supabase.com/dashboard
2. Vali projekt: `axcetvmpbzlpoosywmdp`
3. Vasakult menüüst vali **SQL Editor**
4. Kliki **New Query**
5. Ava fail: `supabase/migrations/create_featured_videos_table.sql`
6. Kopeeri kogu sisu ja kleebi SQL Editorisse
7. Kliki **Run** või vajuta `Ctrl/Cmd + Enter`

✅ Nüüd on `featured_videos` tabel loodud ja valmis kasutamiseks!

---

## 2️⃣ Videode lisamine

### Admin paneelile juurdepääs:
1. Mine aadressile: `/admin/featured-videos`
2. Näed lehte "Featured YouTube Videos"

### Video lisamine:
1. **Kopeeri YouTube video URL** või **Video ID**
   - Näited:
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - Lihtsalt `VIDEO_ID`

2. **Kleebi see "Add New Video" vormi**

3. **Kliki "Add Video"**

4. Süsteem teeb automaatselt:
   ✅ Fetchib video thumbnailid (kõrgeima kvaliteediga)
   ✅ Fetchib video pealkirja
   ✅ Fetchib vaatamiste arvu
   ✅ Salvestab kõik andmed andmebaasi

5. Video lisatakse automaatselt järjekorra lõppu

---

## 3️⃣ Videode haldamine

### 🔄 Vaatamiste arvu uuendamine (Sync from YouTube)
Kui soovid uuendada vaatamiste arvu või muud infot YouTube'ist:
1. Kliki videol **"Sync from YouTube"** nuppu
2. Süsteem fetchib värske info YouTube'ist
3. Vaatamiste arv, pealkiri ja thumbnail uuendatakse

💡 **Näpunäide:** Kasutlik kui video on saanud uusi vaatamisi või kui pealkiri on muudetud.

---

### ↕️ Videote järjekorra muutmine
Videote järjekord määrab, kuidas nad carousel'is kuvatakse:

1. Kasuta **üles/alla nooli** (▲ / ▼) video paremal küljel
2. Järjekord muutub kohe
3. Avalehel kajastub muudatus järgmisel lehekülastuselt (revalidate 60s)

---

### 👁️ Videote näitamine/peitmine
Kui soovid videot ajutiselt peita, kuid mitte kustutada:
1. Kliki **"Hide"** nuppu
2. Video kaob avalehelt, kuid jääb andmebaasi
3. Taasesita nähtavus klikkides **"Show"**

💡 Video peidetud olekus:
- Nähtaval admin paneelis (hall taust)
- Ei kuvata avalehel
- Andmed püsivad alles

---

### 🗑️ Video kustutamine
Kui soovid video täielikult eemaldada:
1. Kliki **"Delete"** nuppu (punane)
2. Kinnita kustutamine
3. Video kustutatakse andmebaasist

⚠️ **Tähelepanu:** Kustutamine on püsiv! Video tuleb uuesti lisada, kui soovid seda hiljem tagasi tuua.

---

## 4️⃣ Kuidas avalehel kuvatakse

### Carousel iseärasused:
- **Automaatne keerimine:** Carousel kerib videoid aeglaselt paremalt vasakule
- **Lõpmatu loop:** Kui jõuab lõppu, algab uuesti algusest
- **Hover efekt:** Hiirega peale liikudes muutub piirjoon punaseks ja thumbnail zoomimine
- **Klikitav:** Iga video on klikitav link, mis avab YouTube'i uues aknas
- **Vaatamiste arv:** Kuvatakse thumbnail'il (nt. "1.2M views", "45K views")

### Nähtavus:
- Ainult `is_visible = true` videod kuvatakse
- Järjekord määratakse `display_order` veeruga (väiksem number = rohkem vasakul)
- Minimaalselt 3 videot soovitatud ilusaks carousel'iks

---

## 5️⃣ Tehnilised detailid

### YouTube Data API
- API key: Juba konfigureeritud `.env.local` failis
- Rate limits: 10,000 requests päevas (YouTube default quota)
- Fetchitakse: `snippet` (pealkiri, thumbnail) ja `statistics` (vaatamised)

### Thumbnail kvaliteet
Süsteem valib alati kõrgeima saadava kvaliteedi:
1. `maxres` (1920x1080) - kui saadaval
2. `high` (480x360)
3. `medium` (320x180)
4. `default` (120x90) - fallback

### View count formaat
Vaatamisi kuvatakse lühendatud kujul:
- `1,234,567` → `1.2M`
- `45,678` → `45.7K`
- `123` → `123`

### Andmebaasi väljad
```sql
- id: UUID (automaatne)
- youtube_url: Originaal YouTube link
- youtube_video_id: Video ID (nt. "dQw4w9WgXcQ")
- title: Video pealkiri
- thumbnail_url: Kõrgeima kvaliteediga thumbnail
- view_count: Vaatamiste arv (bigint)
- display_order: Järjekord (integer)
- is_visible: Nähtavus (boolean)
- created_at: Loomise aeg
- updated_at: Viimase muudatuse aeg
- last_synced_at: Viimane YouTube'iga sünkroniseerimise aeg
```

---

## 6️⃣ Probleemide lahendamine

### ❌ "Invalid YouTube URL"
- Kontrolli, et URL on õige formaadis
- Proovi kasutada ainult video ID'd

### ❌ "Could not fetch video data from YouTube"
- Video võib olla privaatne või kustutatud
- Kontrolli, et video on avalikult kättesaadav
- Kontrolli API key'i `.env.local` failis

### ❌ Video ei kuvata avalehel
- Kontrolli, et `is_visible = true` (rohelise silma ikoon admin paneelis)
- Oota kuni 60 sekundit (Next.js revalidate timer)
- Värskenda lehte

### ❌ Vaatamiste arv ei uuendu
- Vajuta "Sync from YouTube" nuppu
- YouTube API võib olla ajutiselt maas
- Kontrolli `last_synced_at` kuupäeva

---

## 7️⃣ Parimad tavad

✅ **Lisa vähemalt 5-7 videot** - Carousel näeb parem välja rohkemate videotega

✅ **Uuenda vaatamisi regulaarselt** - Kasuta "Sync" nuppu iga kuu

✅ **Pane esile parimad videod** - Muuda järjekorda nii, et populaarsemad on ees

✅ **Testi avalehel** - Kontrolli alati, kuidas videod välja näevad

✅ **Kasuta kvaliteetseid videoid** - Ära lisa teste või draft videoid

---

## 8️⃣ Kiirteed

| Tegevus | Marsruut |
|---------|----------|
| Videode haldamine | `/admin/featured-videos` |
| Admin dashboard | `/admin/dashboard` |
| Avalehe vaade | `/` (scroll "Kes on Kozip") |

---

Kui tekivad küsimused või probleemid, vaata:
- `src/lib/youtube.ts` - YouTube API funktsioonid
- `src/app/api/featured-videos/route.ts` - API endpoint
- `supabase/migrations/create_featured_videos_table.sql` - Tabeli struktuur

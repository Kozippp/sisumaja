# Sisumaja Veebileht

See dokument kirjeldab Sisumaja (Eesti esimene creatorhouse) veebilehe tehnilist lahendust, struktuuri ja funktsionaalsust.

## 1. Ülevaade (Overview)
Veebileht on mõeldud brändidele ja koostööpartneritele tutvustamaks Sisumaja olemust, meeskonda ja tehtud töid. Leht on optimeeritud kiirusele, visuaalsusele ja lihtsale haldusele.

**Tehniline Stack:**
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS (Modernne, tume/neoon esteetika)
*   **Database & Auth:** Supabase (PostgreSQL)
*   **Hosting:** Vercel
*   **Keel:** Koodibaas inglise keeles, Avalik sisu ja URL-id eesti keeles.

---

## 2. Lehekülgede Struktuur (Sitemap)

### 1. Avaleht (`/`)
*   **Hero Section:** Suur visuaalne sissejuhatus, Sisumaja treiler/video taustal.
*   **Tutvustus:** Mis on Sisumaja?
*   **Tiim:** 6 sisuloojat (Pilt, Nimi, Roll/Kirjeldus).
*   **Viimased tööd:** Kuvab automaatselt 3 kõige uuemat projekti (Preview).

### 2. Tehtud Tööd (`/tehtud-tood`)
*   **Kataloog:** Grid-vaade kõikidest avalikest projektidest.
*   **Filtrid (vabatahtlik tulevikus):** Võimalus filtreerida kategooria järgi.

### 3. Projekti Detailvaade (`/tehtud-tood/[slug]`)
*   Dünaamiline leht, mis kuvab konkreetse koostööprojekti infot.
*   **Meedia:** Karussell (Carousel), mis sisaldab pilte ja videoid.
*   **Lingid:** "Vaata videot" nupud (YouTube, TikTok, Instagram) - kuvatakse vaid siis, kui link on olemas.
*   **Statistika:** Ikoonidega esitatud tulemused (Vaatamised, Meeldimised, Kommentaarid, Jagamised). Kuvatakse vaid täidetud väljad.
*   **Kliendi tagasiside:** Kliendi pilt, nimi, amet ja tsitaat.
*   **Järgmised tööd:** Soovitused edasi vaatamiseks.

### 4. Kontakt (`/kontakt`)
*   Ettevõtte andmed.
*   Kontaktivorm (või mailto link).

### 5. Admin Paneel (`/admin`)
*   **Auth:** Kaitstud sisselogimisega (Supabase Auth).
*   **Dashboard:** Nimekiri kõikidest töödest (Status: Published/Draft).
*   **Lisa/Muuda Tööd:** Vorm uue projekti sisestamiseks.

---

## 3. Andmebaasi Skeem (Database Schema)

Tabeli nimi: `projects`

| Väli (Column) | Tüüp | Kirjeldus |
| :--- | :--- | :--- |
| `id` | UUID | Unikaalne identifikaator |
| `created_at` | Timestamp | Loomise aeg |
| `title` | Text | Projekti pealkiri (nt "Sisumaja x Coca-Cola") |
| `slug` | Text | URL-i jaoks unikaalne (nt "sisumaja-x-coca-cola") |
| `description` | Text | Pikem kirjeldus projektist |
| `thumbnail_url` | Text | Pilt, mida näidatakse avalehel ja kataloogis |
| **Media & Links** | | |
| `media_gallery` | JSONB | Massiiv piltide/videote URL-idest karusselli jaoks |
| `youtube_url` | Text | Link täispikale videole (vabatahtlik) |
| `tiktok_url` | Text | Link TikToki videole (vabatahtlik) |
| `instagram_url` | Text | Link Instagrami postitusele (vabatahtlik) |
| **Stats** | | (Kuvatakse vaid siis, kui väärtus > 0 või olemas) |
| `stat_views` | Int/String | Vaatamiste arv |
| `stat_likes` | Int/String | Meeldimiste arv |
| `stat_comments` | Int/String | Kommentaaride arv |
| `stat_shares` | Int/String | Jagamiste arv |
| **Client Feedback** | | |
| `client_name` | Text | Tagasiside andja nimi |
| `client_role` | Text | Tagasiside andja amet (nt "Turundusjuht") |
| `client_avatar_url` | Text | Kliendi pilt/logo |
| `client_quote` | Text | Tagasiside tekst |
| **Settings** | | |
| `is_visible` | Boolean | Kas projekt on avalik? (Draft/Published) |
| `published_at` | Timestamp | Järjestamiseks (et uuemad oleks ees) |

---

## 4. Funktsionaalsuse Loogika

### Admin Vorm (Create/Update)
*   Kui väli jäetakse tühjaks (nt `client_quote` või `tiktok_url`), siis andmebaasi salvestatakse `null`.
*   Frontend kontrollib: `if (project.tiktok_url) { return <TikTokButton /> }`.
*   Piltide üleslaadimine: Admin paneel peab võimaldama pilte üles laadida Supabase Storage'isse ja saama sealt avaliku URL-i, mis salvestatakse andmebaasi.

### Disaini Märksõnad
*   **Dark Mode:** Põhiline visuaal.
*   **Responsive:** Peab töötama ideaalselt mobiilis.
*   **Typography:** Modernne, paks (Bold) pealkirjades.


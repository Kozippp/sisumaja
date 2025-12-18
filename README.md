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

## 2. Plaanitavad muudatused (Tehtud tööd 2.0)
*Hetkeseis: Plaanimise faas (v2).*

Eesmärk on muuta tehtud tööde lisamine paindlikumaks, asendades fikseeritud layouti "lego-klotside" süsteemiga.

### Andmebaasi muudatused
*   Lisada tabelisse `projects` uus veerg `content` (tüüp: JSONB).
*   See väli hoiab massiivi plokkidest, mida renderdatakse lehel järjest.

### Sisu Plokkide Tüübid (Content Blocks)
Admin saab valida 4 tüübi vahel. Iga meedia-ploki puhul saab valida paigutust (Layout), kui tekst on lisatud.

**Üldine paigutuse loogika (Desktop):**
*   **Layout: Left** -> Pilt/Video vasakul (50%), Tekst paremal (50%).
*   **Layout: Right** -> Tekst vasakul (50%), Pilt/Video paremal (50%).
*   **Mobiilis:** Alati üksteise all (Meedia üleval, tekst all).

**1. Pealkiri + Tekst (Text Block)**
*   Väljad: `pealkiri` (valikuline), `tekst` (kohustuslik).
*   Käitumine: Kui pealkirja pole, kuvatakse vaid tekstilõik.

**2. Pilt + Tekst (Image Block)**
*   Väljad: `pildi_url` (kohustuslik), `tekst` (valikuline), `layout` (Left/Right).
*   Käitumine: Kui tekst puudub, kuvatakse pilt täislaiuses (või tsentreeritult). Kui tekst on olemas, rakendub valitud paigutus.

**3. Video + Tekst (Video Block)**
*   Väljad: `video_url` (YouTube/Vimeo), `custom_thumbnail` (valikuline), `tekst` (valikuline), `layout` (Left/Right).
*   Käitumine: Sarnane pildiplokile.
*   **Thumbnail:** Vaikimisi võtab YouTube'i automaatse pildi. Kui `custom_thumbnail` on lisatud, näidatakse seda "Play" nupuga ülekattena.

**4. Karussell + Tekst (Carousel Block)**
*   Väljad: `pildid` (massiiv URL-idest), `tekst` (valikuline), `layout` (Left/Right).
*   Käitumine: Sarnane teistele, aga meedia asemel on swipe'itav pildigalerii.

### Admin Paneeli Uuendused (`/admin/edit/[id]`)
*   Luua "Content Builder" komponent.
*   Iga ploki juures on:
    *   Sisu väljad (URL, tekst).
    *   Layout lüliti (Vasak/Parem) - nähtav ainult siis, kui tegemist on meedia plokiga.
    *   Kustuta ja Liiguta (Üles/Alla) nupud.

### Avalik Vaade
*   Renderdab plokid vastavalt järjekorrale.
*   Tagab, et mobiilis oleksid asjad loogilises järjekorras (stacking).
*   Disain on puhas, "case study" stiilis.

---

## 3. Lehekülgede Struktuur (Sitemap)

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
*   **Päis:** Suur pealkiri, kliendi info, statistika ja sotsmeedia lingid.
*   **Sisu:** Dünaamilised plokid (vt punkt 2).
*   **Järgmised tööd:** Soovitused edasi vaatamiseks.

### 4. Kontakt (`/kontakt`)
*   Ettevõtte andmed.
*   Kontaktivorm (või mailto link).

### 5. Admin Paneel (`/admin`)
*   **Auth:** Kaitstud sisselogimisega (Supabase Auth).
*   **Dashboard:** Nimekiri kõikidest töödest.
*   **Lisa/Muuda Tööd:** Uuendatud vorm Content Builderiga.

---

## 4. Andmebaasi Skeem (Database Schema)

Tabeli nimi: `projects`

| Väli (Column) | Tüüp | Kirjeldus |
| :--- | :--- | :--- |
| `id` | UUID | Unikaalne identifikaator |
| `created_at` | Timestamp | Loomise aeg |
| `title` | Text | Projekti pealkiri |
| `slug` | Text | URL-i jaoks unikaalne |
| `content` | JSONB | **UUS:** Sisu plokkide massiiv |
| `thumbnail_url` | Text | Pilt, mida näidatakse avalehel ja kataloogis |
| **Legacy/Fallback** | | |
| `description` | Text | Lühikirjeldus (Meta descriptioniks) |
| `media_gallery` | JSONB | Vana galerii väli (Alles tagasiühilduvuseks) |
| **Stats & Links** | | |
| `youtube_url` | Text | Link täispikale videole |
| `tiktok_url` | Text | Link TikToki videole |
| `instagram_url` | Text | Link Instagrami postitusele |
| `stat_views` | Int/String | Vaatamiste arv |
| `stat_likes` | Int/String | Meeldimiste arv |
| `stat_comments` | Int/String | Kommentaaride arv |
| `stat_shares` | Int/String | Jagamiste arv |
| **Client Feedback** | | |
| `client_name` | Text | Tagasiside andja nimi |
| `client_role` | Text | Tagasiside andja amet |
| `client_avatar_url` | Text | Kliendi pilt/logo |
| `client_quote` | Text | Tagasiside tekst |
| **Settings** | | |
| `is_visible` | Boolean | Kas projekt on avalik? |
| `published_at` | Timestamp | Järjestamiseks |

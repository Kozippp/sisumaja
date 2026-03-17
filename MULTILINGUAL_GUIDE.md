# Multilingual Case Studies Migration Guide

## Tehtud muudatused

### 1. Andmebaasi muudatused (Supabase)

Lisatud on järgmised väljad `projects` tabelisse:
- `content_en` (JSONB) - inglise keelsed sisu segmendid
- `links_en` (JSONB) - inglise keelsed lingid
- `client_quote_en` (TEXT) - inglise keelne kliendi tagasiside
- `client_review_title_en` (TEXT) - inglise keelne tagasiside pealkiri

**OLULINE: Need väljad tuleb lisada käsitsi Supabase'i dashboardis!**

#### Kuidas lisada väljad:

1. Mine Supabase Dashboardi: https://supabase.com/dashboard
2. Vali oma projekt
3. Vali vasakult menüüst **SQL Editor**
4. Kopeeri ja kleebi järgmine SQL käsk:

```sql
-- Add multilingual support for content blocks and other fields
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS content_en JSONB,
ADD COLUMN IF NOT EXISTS links_en JSONB,
ADD COLUMN IF NOT EXISTS client_quote_en TEXT,
ADD COLUMN IF NOT EXISTS client_review_title_en TEXT;

-- Add comments for the new columns
COMMENT ON COLUMN projects.content_en IS 'English translation of content blocks (Sisu Segmendid)';
COMMENT ON COLUMN projects.links_en IS 'English translation of social media links';
COMMENT ON COLUMN projects.client_quote_en IS 'English translation of client testimonial quote';
COMMENT ON COLUMN projects.client_review_title_en IS 'English translation of client review title';
```

5. Vajuta **Run** või **CMD+Enter**
6. Kontrolli, et väljad on edukalt lisatud (peaks näitama "Success")

### 2. TypeScript tüübid

`src/types/database.types.ts` fail on juba uuendatud uute väljadega.

### 3. Admin vormi muudatused

- Lisatud **Language Toggle** (EST/EN) vormi ülaossa
- Kõik väljad mis vajavad tõlget näidatakse vastavalt valitud keelele
- Sisu Segmendid (Content Builder) ja Lingid (Links Builder) töötavad eraldi iga keele jaoks
- Lisatud **"Tõlgi inglise keelde (AI)"** nupp, mis automaatselt tõlgib kõik eestikeelsed väljad inglise keelde kasutades OpenAI GPT-4

### 4. Frontend muudatused

Case study leht (`/tehtud-tood/[slug]`) näitab nüüd inglise keelset sisu kui kasutaja on valinud inglise keele.

## Kuidas kasutada

### Admin lehel case study loomine:

1. **Täida eestikeelne versioon:**
   - Kontrolli, et Language Toggle on seatud "🇪🇪 Eesti" peale
   - Täida kõik väljad (pealkiri, kirjeldus, sisu segmendid, lingid, testimonial)
   - Salvesta

2. **Tõlgi inglise keelde AI-ga:**
   - Vajuta "Tõlgi inglise keelde (AI)" nuppu
   - Oota mõned sekundid kuni AI tõlgib
   - Vorm lülitub automaatselt inglise keele vaatele
   - Kontrolli üle tõlgitud sisu ja tee vajadusel parandusi
   - Salvesta

3. **Alternatiivne: Käsitsi tõlkimine:**
   - Lülita Language Toggle peale "🇬🇧 English"
   - Täida kõik väljad käsitsi inglise keeles
   - Meedialingid (pildid, videod) on samad mõlemas keeles
   - Salvesta

### Olemasolevate case study'de tõlkimine:

1. Mine admin dashboardi
2. Vali case study mida tahad tõlkida
3. Vajuta "Tõlgi inglise keelde (AI)" nuppu
4. Kontrolli üle tõlgitud sisu
5. Salvesta

## Mis on ühine mõlema keele vahel?

Järgmised väljad on jagatud (muutub ainult eesti keelsel vaatel):
- Slug (URL)
- Thumbnail pilt
- Project type
- Avalikustamise kuupäev
- Kliendi nimi ja amet
- Kliendi avatar
- Kliendi hinne (tärnide arv)
- Statistika
- Meedia failid (pildid, videod, URL-id)

## Mis on eraldi iga keele jaoks?

- Pealkiri
- Lühikirjeldus (SEO)
- Sisu segmendid (tekst ja pealkirjad, mitte meedia)
- Lingid (nupu tekstid, mitte URL-id)
- Kliendi tagasiside tsitaat
- Kliendi tagasiside pealkiri

## OpenAI API

Tõlkimiseks kasutatakse OpenAI GPT-4o mudelit, mis on parim kvaliteet/hinna suhe jaoks.
API võti on salvestatud `.env.local` failis muutujana `OPENAI_API_KEY`.

## Mida veel teha?

- **Olemasolevate case study'de tõlkimine:** Mine iga case study juurde admin lehel ja vajuta "Tõlgi inglise keelde (AI)" nuppu
- **Kontrolli tõlkeid:** AI on hea, aga mitte perfektne - kontrolli üle eriti tehnilised terminid ja brändispetsiifilised nimetused
- **Testi:** Vaata case study'd nii eesti kui inglise keeles veebilehel

## Probleemid?

Kui midagi ei tööta:
1. Kontrolli, et SQL käsud on edukalt käivitatud Supabase'is
2. Kontrolli, et OpenAI API võti on õige ja toimib
3. Kontrolli browser console'is vigu
4. Kontrolli server loge Next.js terminalis

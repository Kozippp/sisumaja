# Mitmekeelse toe lisamine

## Andmebaasi muudatused

Käivita järgnev SQL Supabase SQL Editoris:

```sql
-- Add multilingual support to projects table
-- Adding English translations for title and description

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add comment for the new columns
COMMENT ON COLUMN projects.title_en IS 'English translation of the project title';
COMMENT ON COLUMN projects.description_en IS 'English translation of the project description';
```

## Kuidas migratsiooni käivitada

1. Mine Supabase dashboardi: https://supabase.com/dashboard
2. Vali oma projekt
3. Mine SQL Editor lehele
4. Kopeeri ülaltoodud SQL kood
5. Käivita SQL

Alternatiivselt kasuta faili: `supabase/migrations/add_multilingual_projects.sql`

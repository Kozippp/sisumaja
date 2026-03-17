/**
 * Migration Script: Add multilingual content blocks to projects table
 * 
 * This script adds English translation fields for:
 * - content_en: English version of content blocks (Sisu Segmendid)
 * - links_en: English version of social media links
 * - client_quote_en: English version of client testimonial
 * - client_review_title_en: English version of review title
 * 
 * To run this migration:
 * 1. Go to Supabase Dashboard → SQL Editor
 * 2. Copy and paste the contents of supabase/migrations/add_multilingual_content_blocks.sql
 * 3. Click "Run"
 * 
 * After running the migration, regenerate types with:
 * npx supabase gen types typescript --project-id axcetvmpbzlpoosywmdp > src/types/database.types.ts
 */

export const MIGRATION_INSTRUCTIONS = `
Please run the following SQL in your Supabase SQL Editor:

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS content_en JSONB,
ADD COLUMN IF NOT EXISTS links_en JSONB,
ADD COLUMN IF NOT EXISTS client_quote_en TEXT,
ADD COLUMN IF NOT EXISTS client_review_title_en TEXT;

COMMENT ON COLUMN projects.content_en IS 'English translation of content blocks (Sisu Segmendid)';
COMMENT ON COLUMN projects.links_en IS 'English translation of social media links';
COMMENT ON COLUMN projects.client_quote_en IS 'English translation of client testimonial quote';
COMMENT ON COLUMN projects.client_review_title_en IS 'English translation of client review title';
`;

console.log(MIGRATION_INSTRUCTIONS);

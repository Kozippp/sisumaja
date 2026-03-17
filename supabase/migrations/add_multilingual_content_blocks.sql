-- Add multilingual support for content blocks and other fields
-- Adding English versions of content, links, and client testimonials

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

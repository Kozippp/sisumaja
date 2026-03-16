-- Add multilingual support to projects table
-- Adding English translations for title and description

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add comment for the new columns
COMMENT ON COLUMN projects.title_en IS 'English translation of the project title';
COMMENT ON COLUMN projects.description_en IS 'English translation of the project description';

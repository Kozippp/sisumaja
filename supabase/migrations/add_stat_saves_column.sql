-- Add stat_saves column for bookmark/saves count
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS stat_saves TEXT;

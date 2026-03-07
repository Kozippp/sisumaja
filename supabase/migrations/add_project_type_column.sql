-- Add project_type column to projects table
-- Values: 'youtube_ad' (default, existing), 'shorts', 'training'

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_type TEXT NOT NULL DEFAULT 'youtube_ad'
    CHECK (project_type IN ('youtube_ad', 'shorts', 'training'));

-- Add show_on_frontpage_shorts boolean column
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS show_on_frontpage_shorts BOOLEAN DEFAULT false;

-- Backfill: existing projects that have show_on_frontpage_youtube = true keep youtube_ad type
-- All existing projects are youtube_ad by default (the DEFAULT above handles this)

-- Update RLS policies if needed (existing policies already cover all rows)
-- No policy changes needed as existing policies use is_visible check

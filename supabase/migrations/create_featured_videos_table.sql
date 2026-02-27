-- Create featured_videos table for YouTube carousel
CREATE TABLE IF NOT EXISTS featured_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  view_count BIGINT DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_featured_videos_display_order ON featured_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_videos_visible ON featured_videos(is_visible);

-- Enable RLS
ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read visible videos
CREATE POLICY "Anyone can view visible featured videos"
  ON featured_videos
  FOR SELECT
  USING (is_visible = true);

-- Policy: Authenticated users can do everything (admin only in practice)
CREATE POLICY "Authenticated users can manage featured videos"
  ON featured_videos
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_featured_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_featured_videos_updated_at_trigger
  BEFORE UPDATE ON featured_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_featured_videos_updated_at();

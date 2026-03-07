-- Create shorts_videos table
CREATE TABLE IF NOT EXISTS public.shorts_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for ordering and filtering
CREATE INDEX IF NOT EXISTS idx_shorts_videos_display_order ON public.shorts_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_shorts_videos_visible ON public.shorts_videos(is_visible);

-- Enable Row Level Security
ALTER TABLE public.shorts_videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.shorts_videos
  FOR SELECT
  USING (is_visible = true);

-- Create policy for authenticated users to manage videos
CREATE POLICY "Allow authenticated users full access" ON public.shorts_videos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shorts_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_shorts_videos_updated_at
  BEFORE UPDATE ON public.shorts_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_shorts_videos_updated_at();

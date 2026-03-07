-- Create youtube_ad_videos table
CREATE TABLE IF NOT EXISTS public.youtube_ad_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.youtube_ad_videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.youtube_ad_videos
  FOR SELECT
  USING (is_active = true);

-- Create policy for authenticated users to manage videos
CREATE POLICY "Allow authenticated users full access" ON public.youtube_ad_videos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_youtube_ad_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_youtube_ad_videos_updated_at
  BEFORE UPDATE ON public.youtube_ad_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_youtube_ad_videos_updated_at();

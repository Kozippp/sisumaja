-- Create social_stats table to store dynamic follower and view counts
CREATE TABLE IF NOT EXISTS public.social_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  followers TEXT NOT NULL DEFAULT '15.4K',
  views TEXT NOT NULL DEFAULT '1M+',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values
INSERT INTO public.social_stats (followers, views)
VALUES ('15.4K', '1M+')
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE public.social_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.social_stats
  FOR SELECT
  USING (true);

-- Allow authenticated users to update (admin only)
CREATE POLICY "Allow authenticated users to update" ON public.social_stats
  FOR UPDATE
  USING (auth.role() = 'authenticated');

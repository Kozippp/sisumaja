-- Fix RLS policies for featured_videos table
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view visible featured videos" ON featured_videos;
DROP POLICY IF EXISTS "Authenticated users can manage featured videos" ON featured_videos;

-- For now, disable RLS to allow API routes to work
-- (In production, you should use service_role key for admin operations)
ALTER TABLE featured_videos DISABLE ROW LEVEL SECURITY;

-- Alternative: Keep RLS enabled but allow everything for anon key
-- This is acceptable since the admin panel requires login anyway
-- Uncomment these if you want to keep RLS enabled:

-- CREATE POLICY "Allow all operations on featured_videos"
--   ON featured_videos
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

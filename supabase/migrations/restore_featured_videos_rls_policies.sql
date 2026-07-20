-- Restore the access policies required by the featured YouTube videos carousel.
-- Public visitors may only read videos that are intended for display.
-- Signed-in admins may manage the list in the admin area.

ALTER TABLE public.featured_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visible featured videos" ON public.featured_videos;
DROP POLICY IF EXISTS "Public can view visible featured videos" ON public.featured_videos;
DROP POLICY IF EXISTS "Authenticated users can manage featured videos" ON public.featured_videos;

CREATE POLICY "Public can view visible featured videos"
  ON public.featured_videos
  FOR SELECT
  TO anon, authenticated
  USING (is_visible IS TRUE);

CREATE POLICY "Authenticated users can manage featured videos"
  ON public.featured_videos
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

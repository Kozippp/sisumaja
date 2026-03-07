-- Create storage bucket for youtube ad videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('youtube-ad-videos', 'youtube-ad-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for youtube-ad-videos bucket
CREATE POLICY "Allow public to view youtube ad videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'youtube-ad-videos');

CREATE POLICY "Allow authenticated users to upload youtube ad videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'youtube-ad-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update youtube ad videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'youtube-ad-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete youtube ad videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'youtube-ad-videos' AND auth.role() = 'authenticated');

-- Create storage bucket for shorts videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('shorts-videos', 'shorts-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for shorts-videos bucket
CREATE POLICY "Allow public to view shorts videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'shorts-videos');

CREATE POLICY "Allow authenticated users to upload shorts videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shorts-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update shorts videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'shorts-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete shorts videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'shorts-videos' AND auth.role() = 'authenticated');

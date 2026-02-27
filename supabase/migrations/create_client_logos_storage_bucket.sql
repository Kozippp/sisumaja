-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-logos',
  'client-logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to client logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload client logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update client logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete client logos" ON storage.objects;

-- Policy to allow anyone to read client logos
CREATE POLICY "Allow public read access to client logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'client-logos');

-- Policy to allow authenticated users to upload client logos
CREATE POLICY "Allow authenticated users to upload client logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-logos');

-- Policy to allow authenticated users to update client logos
CREATE POLICY "Allow authenticated users to update client logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'client-logos')
WITH CHECK (bucket_id = 'client-logos');

-- Policy to allow authenticated users to delete client logos
CREATE POLICY "Allow authenticated users to delete client logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'client-logos');

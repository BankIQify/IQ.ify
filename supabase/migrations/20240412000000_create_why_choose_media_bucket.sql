-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload why choose media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to why choose media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update why choose media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete why choose media" ON storage.objects;

-- Create storage bucket for why choose IQify media
INSERT INTO storage.buckets (id, name, public)
VALUES ('why-choose-iqify-media', 'why-choose-iqify-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload media
CREATE POLICY "Allow authenticated users to upload why choose media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'why-choose-iqify-media');

-- Create policy to allow public read access to media
CREATE POLICY "Allow public read access to why choose media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'why-choose-iqify-media');

-- Create policy to allow authenticated users to update their own media
CREATE POLICY "Allow authenticated users to update why choose media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'why-choose-iqify-media');

-- Create policy to allow authenticated users to delete their own media
CREATE POLICY "Allow authenticated users to delete why choose media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'why-choose-iqify-media');

-- Update CORS configuration for the bucket
UPDATE storage.buckets
SET public = true,
    file_size_limit = 104857600, -- 100MB
    allowed_mime_types = ARRAY['image/*', 'video/*']
WHERE id = 'why-choose-iqify-media'; 
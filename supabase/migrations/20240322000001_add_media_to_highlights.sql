-- Add media fields to highlights table
ALTER TABLE highlights
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video', 'gif')),
ADD COLUMN IF NOT EXISTS media_alt_text TEXT;

-- Create storage bucket for highlights media
INSERT INTO storage.buckets (id, name, public)
VALUES ('highlights-media', 'highlights-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload media
CREATE POLICY "Allow authenticated users to upload media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'highlights-media');

-- Create policy to allow public read access to media
CREATE POLICY "Allow public read access to media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'highlights-media'); 
-- Add media-related columns to differentiators table
ALTER TABLE differentiators
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video', 'gif')),
ADD COLUMN IF NOT EXISTS media_alt_text TEXT;

-- Create storage bucket for differentiators media
INSERT INTO storage.buckets (id, name, public)
VALUES ('differentiators-media', 'differentiators-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for differentiators media
CREATE POLICY "Allow public read access to differentiators media"
ON storage.objects FOR SELECT
USING (bucket_id = 'differentiators-media');

CREATE POLICY "Allow authenticated users to upload differentiators media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'differentiators-media'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update their own differentiators media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'differentiators-media'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete their own differentiators media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'differentiators-media'
  AND auth.role() = 'authenticated'
); 
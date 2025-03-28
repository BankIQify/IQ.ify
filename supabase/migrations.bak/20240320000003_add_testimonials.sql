-- Add testimonials column to homepage_content table
ALTER TABLE homepage_content
ADD COLUMN testimonials jsonb DEFAULT '[]'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN homepage_content.testimonials IS 'Array of student testimonials with name, avatar, and quote'; 
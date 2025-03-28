-- Add social_proof column to homepage_content table
ALTER TABLE homepage_content
ADD COLUMN social_proof jsonb DEFAULT '{
  "rating": "4.8 rating",
  "students": "Trusted by over 8,000+ students",
  "science": "Backed by cognitive science"
}'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN homepage_content.social_proof IS 'Social proof data including rating, number of students, and science backing'; 
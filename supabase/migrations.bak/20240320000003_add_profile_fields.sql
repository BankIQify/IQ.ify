-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN full_name text,
ADD COLUMN date_of_birth date,
ADD COLUMN country text,
ADD COLUMN city text,
ADD COLUMN education_level text,
ADD COLUMN subjects text[] DEFAULT '{}';

-- Add comment to explain the columns
COMMENT ON COLUMN profiles.full_name IS 'User''s full name';
COMMENT ON COLUMN profiles.date_of_birth IS 'User''s date of birth';
COMMENT ON COLUMN profiles.country IS 'User''s country of residence';
COMMENT ON COLUMN profiles.city IS 'User''s city of residence';
COMMENT ON COLUMN profiles.education_level IS 'User''s current education level';
COMMENT ON COLUMN profiles.subjects IS 'Array of subjects the user is interested in'; 
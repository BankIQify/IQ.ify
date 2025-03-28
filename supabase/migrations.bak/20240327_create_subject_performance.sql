-- Create enum for subject types
CREATE TYPE subject_type AS ENUM (
  'verbal_reasoning',
  'non_verbal_reasoning',
  'brain_training'
);

-- Create subject_performance table
CREATE TABLE IF NOT EXISTS subject_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject subject_type NOT NULL,
  average_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subject)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subject_performance_user_id ON subject_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_subject_performance_score ON subject_performance(average_score);

-- Enable RLS
ALTER TABLE subject_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own performance"
  ON subject_performance
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance"
  ON subject_performance
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update performance
CREATE OR REPLACE FUNCTION update_subject_performance(
  p_user_id UUID,
  p_subject subject_type,
  p_score DECIMAL
)
RETURNS void AS $$
BEGIN
  INSERT INTO subject_performance (
    user_id,
    subject,
    average_score,
    total_attempts,
    last_attempt_at
  )
  VALUES (
    p_user_id,
    p_subject,
    p_score,
    1,
    NOW()
  )
  ON CONFLICT (user_id, subject)
  DO UPDATE SET
    average_score = (
      (subject_performance.average_score * subject_performance.total_attempts + p_score) /
      (subject_performance.total_attempts + 1)
    ),
    total_attempts = subject_performance.total_attempts + 1,
    last_attempt_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql; 
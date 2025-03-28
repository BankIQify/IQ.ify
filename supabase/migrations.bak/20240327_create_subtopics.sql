-- Create enum for main subjects
CREATE TYPE main_subject AS ENUM (
  'verbal_reasoning',
  'non_verbal_reasoning',
  'brain_training'
);

-- Create subtopics table
CREATE TABLE IF NOT EXISTS subtopics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  main_subject main_subject NOT NULL,
  description TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subtopic performance table
CREATE TABLE IF NOT EXISTS subtopic_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id UUID REFERENCES subtopics(id) ON DELETE CASCADE,
  average_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subtopic_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subtopics_main_subject ON subtopics(main_subject);
CREATE INDEX IF NOT EXISTS idx_subtopic_performance_user_id ON subtopic_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_subtopic_performance_score ON subtopic_performance(average_score);

-- Enable RLS
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopic_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Subtopics are viewable by all users"
  ON subtopics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own performance"
  ON subtopic_performance FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update performance
CREATE OR REPLACE FUNCTION update_subtopic_performance(
  p_user_id UUID,
  p_subtopic_id UUID,
  p_score DECIMAL
)
RETURNS void AS $$
BEGIN
  INSERT INTO subtopic_performance (
    user_id,
    subtopic_id,
    average_score,
    total_attempts,
    last_attempt_at
  )
  VALUES (
    p_user_id,
    p_subtopic_id,
    p_score,
    1,
    NOW()
  )
  ON CONFLICT (user_id, subtopic_id)
  DO UPDATE SET
    average_score = (
      (subtopic_performance.average_score * subtopic_performance.total_attempts + p_score) /
      (subtopic_performance.total_attempts + 1)
    ),
    total_attempts = subtopic_performance.total_attempts + 1,
    last_attempt_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert initial subtopics
INSERT INTO subtopics (name, main_subject, description, path) VALUES
-- Verbal Reasoning Subtopics
('Vocabulary', 'verbal_reasoning', 'Enhance your word knowledge and understanding', '/practice/verbal/vocabulary'),
('Comprehension', 'verbal_reasoning', 'Improve reading and understanding complex texts', '/practice/verbal/comprehension'),
('Word Relationships', 'verbal_reasoning', 'Learn to identify connections between words', '/practice/verbal/word-relationships'),
('Verbal Problem Solving', 'verbal_reasoning', 'Solve complex word-based problems', '/practice/verbal/problem-solving'),

-- Non-Verbal Reasoning Subtopics
('Pattern Recognition', 'non_verbal_reasoning', 'Identify and complete visual patterns', '/practice/non-verbal/patterns'),
('Spatial Reasoning', 'non_verbal_reasoning', 'Understand spatial relationships and rotations', '/practice/non-verbal/spatial'),
('Sequence Completion', 'non_verbal_reasoning', 'Complete visual and numerical sequences', '/practice/non-verbal/sequences'),
('Visual Problem Solving', 'non_verbal_reasoning', 'Solve problems using visual logic', '/practice/non-verbal/problem-solving'),

-- Brain Training Subtopics
('Memory Games', 'brain_training', 'Enhance your short-term and working memory', '/brain-training/memory'),
('Speed Processing', 'brain_training', 'Improve your mental processing speed', '/brain-training/speed'),
('Focus Training', 'brain_training', 'Strengthen your concentration and attention', '/brain-training/focus'),
('Logic Puzzles', 'brain_training', 'Challenge yourself with complex logic problems', '/brain-training/logic'); 
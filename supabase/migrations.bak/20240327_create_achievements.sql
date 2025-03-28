-- Create achievement types enum
CREATE TYPE achievement_type AS ENUM ('sticker', 'medal', 'trophy');
CREATE TYPE achievement_tier AS ENUM ('bronze', 'silver', 'gold');
CREATE TYPE achievement_category AS ENUM (
  'general',
  'verbal_reasoning',
  'non_verbal_reasoning',
  'brain_training',
  'daily_streaks',
  'quiz_mastery',
  'game_master'
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type achievement_type NOT NULL,
  tier achievement_tier,
  category achievement_category NOT NULL,
  visual_asset TEXT NOT NULL,
  unlock_condition JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT FALSE,
  progress JSONB NOT NULL DEFAULT '{"current": 0, "target": 0}'::JSONB,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create achievement streaks table
CREATE TABLE IF NOT EXISTS achievement_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Achievements are viewable by all users"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own achievement progress"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievement progress"
  ON user_achievements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own streaks"
  ON achievement_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON achievement_streaks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_achievements_type ON achievements(type);
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_achievement_streaks_user ON achievement_streaks(user_id);

-- Function to update achievement progress
CREATE OR REPLACE FUNCTION update_achievement_progress(
  p_user_id UUID,
  p_achievement_id UUID,
  p_progress JSONB
) RETURNS void AS $$
BEGIN
  INSERT INTO user_achievements (
    user_id,
    achievement_id,
    progress,
    is_unlocked,
    unlocked_at
  )
  VALUES (
    p_user_id,
    p_achievement_id,
    p_progress,
    p_progress->>'current' >= p_progress->>'target',
    CASE 
      WHEN p_progress->>'current' >= p_progress->>'target' 
      THEN NOW() 
      ELSE NULL 
    END
  )
  ON CONFLICT (user_id, achievement_id)
  DO UPDATE SET
    progress = p_progress,
    is_unlocked = p_progress->>'current' >= p_progress->>'target',
    unlocked_at = CASE 
      WHEN p_progress->>'current' >= p_progress->>'target' AND user_achievements.unlocked_at IS NULL
      THEN NOW() 
      ELSE user_achievements.unlocked_at
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql; 
-- Create achievement types enum
CREATE TYPE achievement_type AS ENUM ('medal', 'trophy', 'sticker');

-- Create achievement categories enum
CREATE TYPE achievement_category AS ENUM (
    'general',
    'verbal_reasoning',
    'non_verbal_reasoning',
    'brain_training',
    'daily_streaks',
    'quiz_mastery',
    'game_master'
);

-- Create achievement tiers enum
CREATE TYPE achievement_tier AS ENUM ('bronze', 'silver', 'gold');

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type achievement_type NOT NULL,
    tier achievement_tier,
    category achievement_category NOT NULL,
    visual_asset TEXT NOT NULL,
    unlock_condition JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing
CREATE POLICY "Achievements are viewable by everyone"
    ON achievements
    FOR SELECT
    USING (true);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    is_unlocked BOOLEAN DEFAULT false,
    progress JSONB DEFAULT '{"current": 0, "target": 0}'::jsonb,
    unlocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own achievements"
    ON user_achievements
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
    ON user_achievements
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create achievement streaks table
CREATE TABLE IF NOT EXISTS achievement_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_type TEXT NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, streak_type)
);

-- Enable RLS
ALTER TABLE achievement_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own streaks"
    ON achievement_streaks
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
    ON achievement_streaks
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to update achievement progress
CREATE OR REPLACE FUNCTION update_achievement_progress(
    p_user_id UUID,
    p_achievement_id UUID,
    p_progress JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (p_user_id, p_achievement_id, p_progress)
    ON CONFLICT (user_id, achievement_id)
    DO UPDATE SET
        progress = p_progress,
        is_unlocked = CASE
            WHEN p_progress->>'current' >= p_progress->>'target' THEN true
            ELSE false
        END,
        unlocked_at = CASE
            WHEN p_progress->>'current' >= p_progress->>'target' THEN NOW()
            ELSE NULL
        END,
        updated_at = NOW();
END;
$$; 
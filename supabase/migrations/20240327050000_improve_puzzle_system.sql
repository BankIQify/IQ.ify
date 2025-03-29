-- Modify word_search_puzzles table to track usage instead of marking as used
ALTER TABLE word_search_puzzles
    DROP COLUMN IF EXISTS used_at,
    ADD COLUMN IF NOT EXISTS times_played INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_played_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS popularity_score FLOAT DEFAULT 0.0;

-- Create table to track individual user completions
CREATE TABLE IF NOT EXISTS puzzle_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    puzzle_id UUID REFERENCES word_search_puzzles(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    score INTEGER,
    time_taken INTEGER,
    difficulty TEXT,
    UNIQUE(user_id, puzzle_id)
);

-- Update the get_low_stock_themes function to consider puzzle distribution
CREATE OR REPLACE FUNCTION get_low_stock_themes()
RETURNS TABLE (
    theme text,
    difficulty text,
    count bigint,
    available_per_user numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH user_count AS (
        SELECT COUNT(DISTINCT id)::float as total_users 
        FROM auth.users
        WHERE last_sign_in_at > NOW() - INTERVAL '30 days'
    ),
    theme_counts AS (
        SELECT 
            gt.name as theme,
            wsp.difficulty,
            COUNT(*) as puzzle_count,
            COUNT(*) / GREATEST(uc.total_users, 1) as puzzles_per_user
        FROM word_search_puzzles wsp
        JOIN game_themes gt ON gt.id = wsp.theme_id
        CROSS JOIN user_count uc
        GROUP BY gt.name, wsp.difficulty, uc.total_users
    )
    SELECT 
        tc.theme,
        tc.difficulty,
        tc.puzzle_count,
        ROUND(tc.puzzles_per_user::numeric, 2) as available_per_user
    FROM theme_counts tc
    WHERE tc.puzzles_per_user < 5  -- Ensure at least 5 puzzles per user
    ORDER BY tc.puzzles_per_user ASC;
END;
$$;

-- Create a function to get the next puzzle for a user
CREATE OR REPLACE FUNCTION get_next_puzzle(
    p_user_id UUID,
    p_theme_id UUID,
    p_difficulty TEXT
)
RETURNS TABLE (
    puzzle_id UUID,
    grid JSONB,
    words JSONB,
    dimensions JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH user_completed AS (
        -- Get puzzles the user has already completed
        SELECT puzzle_id 
        FROM puzzle_completions 
        WHERE user_id = p_user_id
    )
    SELECT 
        wsp.id,
        wsp.grid,
        wsp.words,
        wsp.dimensions
    FROM word_search_puzzles wsp
    LEFT JOIN user_completed uc ON uc.puzzle_id = wsp.id
    WHERE 
        wsp.theme_id = p_theme_id
        AND wsp.difficulty = p_difficulty
        AND uc.puzzle_id IS NULL  -- User hasn't completed this puzzle
    ORDER BY 
        wsp.times_played ASC,  -- Prefer less played puzzles
        wsp.popularity_score DESC  -- But also consider popular ones
    LIMIT 1;

    -- Update puzzle usage statistics
    UPDATE word_search_puzzles
    SET 
        times_played = times_played + 1,
        last_played_at = NOW()
    WHERE id = (SELECT puzzle_id FROM get_next_puzzle LIMIT 1);
END;
$$;

-- Create a view for puzzle statistics with better metrics
CREATE OR REPLACE VIEW puzzle_statistics AS
WITH puzzle_stats AS (
    SELECT
        gt.name as theme,
        wsp.difficulty,
        COUNT(*) as total_puzzles,
        AVG(wsp.times_played) as avg_times_played,
        MAX(wsp.last_played_at) as last_played,
        COUNT(*) FILTER (WHERE wsp.times_played = 0) as never_played,
        (
            SELECT COUNT(DISTINCT id)::float 
            FROM auth.users 
            WHERE last_sign_in_at > NOW() - INTERVAL '30 days'
        ) as active_users
    FROM word_search_puzzles wsp
    JOIN game_themes gt ON gt.id = wsp.theme_id
    GROUP BY gt.name, wsp.difficulty
)
SELECT
    theme,
    difficulty,
    total_puzzles,
    ROUND(avg_times_played::numeric, 2) as avg_plays,
    never_played,
    ROUND((total_puzzles / GREATEST(active_users, 1))::numeric, 2) as puzzles_per_user,
    last_played,
    CASE 
        WHEN (total_puzzles / GREATEST(active_users, 1)) < 3 THEN 'critical'
        WHEN (total_puzzles / GREATEST(active_users, 1)) < 5 THEN 'warning'
        ELSE 'healthy'
    END as stock_status
FROM puzzle_stats; 
-- Drop existing function first
DROP FUNCTION IF EXISTS get_low_stock_themes();

-- Update the get_low_stock_themes function with new threshold
CREATE OR REPLACE FUNCTION get_low_stock_themes()
RETURNS TABLE (
    theme text,
    difficulty text,
    game_type text,
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
        -- Word Search Puzzles
        SELECT 
            gt.name as theme,
            wsp.difficulty,
            'word_search'::text as game_type,
            COUNT(*) as puzzle_count,
            COUNT(*) / GREATEST(uc.total_users, 1) as puzzles_per_user
        FROM word_search_puzzles wsp
        JOIN game_themes gt ON gt.id = wsp.theme_id
        CROSS JOIN user_count uc
        GROUP BY gt.name, wsp.difficulty, uc.total_users
        
        UNION ALL
        
        -- Other Game Puzzles (from game_puzzles table)
        SELECT 
            gt.name as theme,
            gp.difficulty,
            gp.game_type::text,
            COUNT(*) as puzzle_count,
            COUNT(*) / GREATEST(uc.total_users, 1) as puzzles_per_user
        FROM game_puzzles gp
        JOIN game_themes gt ON gt.id = gp.theme_id
        CROSS JOIN user_count uc
        GROUP BY gt.name, gp.difficulty, gp.game_type, uc.total_users
    )
    SELECT 
        tc.theme,
        tc.difficulty,
        tc.game_type,
        tc.puzzle_count,
        ROUND(tc.puzzles_per_user::numeric, 2) as available_per_user
    FROM theme_counts tc
    WHERE tc.puzzles_per_user < 20  -- Updated threshold to 20 puzzles per user
    ORDER BY tc.puzzles_per_user ASC;
END;
$$;

-- Drop existing view if it exists
DROP VIEW IF EXISTS puzzle_statistics;

-- Update the puzzle statistics view
CREATE OR REPLACE VIEW puzzle_statistics AS
WITH puzzle_stats AS (
    -- Word Search Stats
    SELECT
        gt.name as theme,
        wsp.difficulty,
        'word_search'::text as game_type,
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
    
    UNION ALL
    
    -- Other Games Stats
    SELECT
        gt.name as theme,
        gp.difficulty,
        gp.game_type::text,
        COUNT(*) as total_puzzles,
        AVG(COALESCE((gp.puzzle_data->>'times_played')::int, 0)) as avg_times_played,
        MAX((gp.puzzle_data->>'last_played_at')::timestamptz) as last_played,
        COUNT(*) FILTER (WHERE COALESCE((gp.puzzle_data->>'times_played')::int, 0) = 0) as never_played,
        (
            SELECT COUNT(DISTINCT id)::float 
            FROM auth.users 
            WHERE last_sign_in_at > NOW() - INTERVAL '30 days'
        ) as active_users
    FROM game_puzzles gp
    JOIN game_themes gt ON gt.id = gp.theme_id
    GROUP BY gt.name, gp.difficulty, gp.game_type
)
SELECT
    theme,
    difficulty,
    game_type,
    total_puzzles,
    ROUND(avg_times_played::numeric, 2) as avg_plays,
    never_played,
    ROUND((total_puzzles / GREATEST(active_users, 1))::numeric, 2) as puzzles_per_user,
    last_played,
    CASE 
        WHEN (total_puzzles / GREATEST(active_users, 1)) < 10 THEN 'critical'
        WHEN (total_puzzles / GREATEST(active_users, 1)) < 20 THEN 'warning'
        ELSE 'healthy'
    END as stock_status
FROM puzzle_stats;

-- Add tracking columns to game_puzzles if they don't exist
ALTER TABLE game_puzzles
ADD COLUMN IF NOT EXISTS puzzle_data JSONB DEFAULT jsonb_build_object(
    'times_played', 0,
    'last_played_at', NULL,
    'popularity_score', 0.0
); 
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_puzzle_counts();

-- Create or replace the function
CREATE OR REPLACE FUNCTION get_puzzle_counts()
RETURNS TABLE (
    game_type text,
    difficulty text,
    count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get counts from game_puzzles table
    RETURN QUERY
    SELECT 
        gp.game_type::text,
        gp.difficulty,
        COUNT(*)::bigint
    FROM game_puzzles gp
    GROUP BY gp.game_type, gp.difficulty
    
    UNION ALL
    
    -- Get counts from word_search_puzzles table
    SELECT 
        'word_search'::text as game_type,
        wsp.difficulty,
        COUNT(*)::bigint
    FROM word_search_puzzles wsp
    WHERE wsp.used_at IS NULL  -- Only count unused puzzles
    GROUP BY wsp.difficulty;
END;
$$; 
-- Create function to get themes with low stock
CREATE OR REPLACE FUNCTION get_low_stock_themes()
RETURNS TABLE (
    theme text,
    difficulty text,
    count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH theme_counts AS (
        SELECT 
            gt.name as theme,
            wsp.difficulty,
            COUNT(*) as puzzle_count
        FROM word_search_puzzles wsp
        JOIN game_themes gt ON gt.id = wsp.theme_id
        WHERE wsp.used_at IS NULL
        GROUP BY gt.name, wsp.difficulty
    )
    SELECT 
        tc.theme,
        tc.difficulty,
        tc.puzzle_count as count
    FROM theme_counts tc
    WHERE tc.puzzle_count < 20
    ORDER BY tc.puzzle_count ASC;
END;
$$;

-- Create a view for puzzle statistics
CREATE OR REPLACE VIEW puzzle_statistics AS
WITH puzzle_stats AS (
    SELECT
        gt.name as theme,
        wsp.difficulty,
        COUNT(*) as total_puzzles,
        COUNT(*) FILTER (WHERE wsp.used_at IS NULL) as available_puzzles,
        MAX(wsp.created_at) as last_generated
    FROM word_search_puzzles wsp
    JOIN game_themes gt ON gt.id = wsp.theme_id
    GROUP BY gt.name, wsp.difficulty
)
SELECT
    theme,
    difficulty,
    total_puzzles,
    available_puzzles,
    last_generated,
    CASE 
        WHEN available_puzzles < 10 THEN 'critical'
        WHEN available_puzzles < 20 THEN 'warning'
        ELSE 'healthy'
    END as stock_status
FROM puzzle_stats; 
-- Create word search puzzles table
CREATE TABLE IF NOT EXISTS word_search_puzzles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID REFERENCES game_themes(id),
    difficulty VARCHAR NOT NULL,
    grid JSONB NOT NULL,
    words JSONB NOT NULL,
    dimensions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ,
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'moderate', 'challenging'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE word_search_puzzles ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing
CREATE POLICY "Word search puzzles are viewable by everyone"
    ON word_search_puzzles
    FOR SELECT
    USING (true);

-- Create policy for updates (only service role can update)
CREATE POLICY "Only service role can update word search puzzles"
    ON word_search_puzzles
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create index for faster queries
CREATE INDEX idx_word_search_puzzles_theme_difficulty
    ON word_search_puzzles(theme_id, difficulty)
    WHERE used_at IS NULL; 
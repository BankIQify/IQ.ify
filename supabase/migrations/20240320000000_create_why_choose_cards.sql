-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON why_choose_cards;
DROP POLICY IF EXISTS "Allow admin write access" ON why_choose_cards;

-- Create why_choose_cards table
CREATE TABLE IF NOT EXISTS why_choose_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    media_alt_text TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE why_choose_cards ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON why_choose_cards
    FOR SELECT
    USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON why_choose_cards
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    );

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_why_choose_cards_order ON why_choose_cards(order_index); 
-- Create about_IQify_cards table
CREATE TABLE IF NOT EXISTS about_IQify_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_text TEXT NOT NULL,
    diagonal_text TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE about_IQify_cards ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON about_IQify_cards
    FOR SELECT
    USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON about_IQify_cards
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create index for ordering
CREATE INDEX idx_about_IQify_cards_order ON about_IQify_cards(order_index); 
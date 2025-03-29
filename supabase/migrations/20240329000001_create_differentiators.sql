-- Create differentiators table
CREATE TABLE IF NOT EXISTS differentiators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE differentiators ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Differentiators are viewable by everyone"
    ON differentiators
    FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert differentiators"
    ON differentiators
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update differentiators"
    ON differentiators
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete differentiators"
    ON differentiators
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create function to reorder differentiators
CREATE OR REPLACE FUNCTION reorder_differentiators(p_differentiator_id UUID, p_new_order INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- First, make space for the new position by incrementing orders
    UPDATE differentiators
    SET order_index = order_index + 1,
        updated_at = NOW()
    WHERE order_index >= p_new_order
    AND id != p_differentiator_id;

    -- Then, set the new order for the target differentiator
    UPDATE differentiators
    SET order_index = p_new_order,
        updated_at = NOW()
    WHERE id = p_differentiator_id;
END;
$$; 
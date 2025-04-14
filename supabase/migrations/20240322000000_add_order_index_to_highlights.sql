-- Add order_index column to highlights table
ALTER TABLE highlights
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Create a function to update order_index
CREATE OR REPLACE FUNCTION update_highlights_order()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a new row, set its order_index to the current count
  IF TG_OP = 'INSERT' THEN
    NEW.order_index := (SELECT COALESCE(MAX(order_index), -1) + 1 FROM highlights);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set order_index
DROP TRIGGER IF EXISTS set_highlights_order ON highlights;
CREATE TRIGGER set_highlights_order
  BEFORE INSERT ON highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_highlights_order();

-- Update existing rows to have sequential order_index
DO $$
DECLARE
  r RECORD;
  i INTEGER := 0;
BEGIN
  FOR r IN SELECT id FROM highlights ORDER BY created_at
  LOOP
    UPDATE highlights SET order_index = i WHERE id = r.id;
    i := i + 1;
  END LOOP;
END $$; 
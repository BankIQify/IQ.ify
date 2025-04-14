-- Add color column to differentiators table
ALTER TABLE differentiators
ADD COLUMN color TEXT NOT NULL DEFAULT 'yellow';

-- Update existing records to have a default color
UPDATE differentiators
SET color = CASE 
  WHEN order_index % 3 = 0 THEN 'yellow'
  WHEN order_index % 3 = 1 THEN 'blue'
  ELSE 'pink'
END
WHERE color IS NULL; 
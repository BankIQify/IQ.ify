-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  rating NUMERIC(3,1) NOT NULL,
  active_users INTEGER NOT NULL,
  award_text TEXT NOT NULL,
  bubble_text TEXT NOT NULL,
  primary_button_text TEXT NOT NULL,
  secondary_button_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON hero_content
  FOR SELECT USING (true);

CREATE POLICY "Admin write access" ON hero_content
  FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON hero_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default content
INSERT INTO hero_content (
  id,
  title,
  subtitle,
  rating,
  active_users,
  award_text,
  bubble_text,
  primary_button_text,
  secondary_button_text
) VALUES (
  '1',
  'Connecting the Cognitive Dots To A Boundless Mind',
  'Personalised learning experiences, expert-led questions, and interactive content to help you achieve your educational goals.',
  4.8,
  5000,
  'Best Cognitive App 2023',
  'Grounded in neuroscience. Powered by personalised learning insights',
  'Get Started',
  'Try Practice Questions'
) ON CONFLICT (id) DO NOTHING; 
-- Create homepage_content table
CREATE TABLE homepage_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  testimonials JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view homepage content"
  ON homepage_content FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify homepage content"
  ON homepage_content FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert initial content
INSERT INTO homepage_content (
  hero_title,
  hero_subtitle,
  features,
  testimonials
) VALUES (
  'Master the 11+ Exam with IQify',
  'Personalised practice and AI-powered learning to help your child succeed',
  '[
    {
      "title": "Adaptive Learning",
      "description": "Our AI system adjusts to your child''s learning pace and style",
      "icon": "brain"
    },
    {
      "title": "Comprehensive Coverage",
      "description": "Full coverage of all 11+ exam topics and question types",
      "icon": "book-open"
    },
    {
      "title": "Progress Tracking",
      "description": "Detailed insights into your child''s strengths and areas for improvement",
      "icon": "line-chart"
    }
  ]'::jsonb,
  '[
    {
      "name": "Sarah Johnson",
      "role": "Parent",
      "image": "/testimonials/sarah.jpg",
      "quote": "IQify helped my daughter gain confidence and improve her scores significantly."
    },
    {
      "name": "Michael Chen",
      "role": "Education Consultant",
      "image": "/testimonials/michael.jpg",
      "quote": "The most comprehensive and effective 11+ preparation platform I''ve seen."
    }
  ]'::jsonb
); 
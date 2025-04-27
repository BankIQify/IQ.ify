-- Create webhook_data table
CREATE TABLE IF NOT EXISTS webhook_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for webhook_data
ALTER TABLE webhook_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhook data is viewable by authenticated users"
    ON webhook_data FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Webhook data is manageable by admin users"
    ON webhook_data FOR ALL
    USING (auth.role() = 'admin');

-- Add RLS policies for questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by authenticated users"
    ON questions FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Questions are manageable by admin and data input users"
    ON questions FOR ALL
    USING (auth.role() = 'admin' OR auth.role() = 'data_input');

-- Create trigger functions for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_webhook_data_updated_at
    BEFORE UPDATE ON webhook_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create webhook_data table
CREATE TABLE IF NOT EXISTS webhook_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE webhook_data ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Webhook data is viewable by authenticated users"
    ON webhook_data FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create policy for admin users
CREATE POLICY "Webhook data is manageable by admin users"
    ON webhook_data FOR ALL
    USING (auth.role() = 'admin');

-- Create trigger for updated_at
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

-- Create a table to track allowed pages for data input role
CREATE TABLE IF NOT EXISTS data_input_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert allowed pages for data input role
INSERT INTO data_input_access (page_name, display_name)
VALUES 
    ('manual-upload', 'Manual Upload'),
    ('ai-webhooks', 'Question Editor'),
    ('dashboard', 'Dashboard');

-- Create a view to check allowed pages
CREATE OR REPLACE VIEW data_input_allowed_pages AS
SELECT 
    page_name,
    display_name
FROM data_input_access;

-- Grant access to the allowed pages view
GRANT SELECT ON data_input_allowed_pages TO data_input;

-- Create a policy to restrict access based on role
CREATE POLICY data_input_page_access ON data_input_access
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.email = 'datateam.iqify@gmail.com'
        )
    );

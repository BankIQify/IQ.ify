-- Ensure user_roles table exists
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create a function to check admin status without using user_roles table
CREATE OR REPLACE FUNCTION is_admin_check()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies with the new admin check
CREATE POLICY "Users can view their own roles"
    ON user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON user_roles
    FOR SELECT
    USING (is_admin_check());

CREATE POLICY "Admins can manage roles"
    ON user_roles
    FOR ALL
    USING (is_admin_check());

-- Grant permissions
GRANT ALL ON user_roles TO authenticated;

-- Note: After running this migration, you need to manually add the admin role for your user.
-- Replace YOUR_USER_ID with your actual user ID from auth.users table:
/*
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
*/ 
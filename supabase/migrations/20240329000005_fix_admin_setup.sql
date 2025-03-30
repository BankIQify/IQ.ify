-- First ensure the user_roles table exists
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create admin check function first
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

-- Add missing fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create a function to sync auth.users data to profiles
CREATE OR REPLACE FUNCTION sync_auth_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the profile with auth user data
    UPDATE profiles
    SET 
        email = NEW.email,
        last_sign_in_at = NEW.last_sign_in_at,
        created_at = NEW.created_at
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync auth user data to profile
DROP TRIGGER IF EXISTS sync_auth_user_trigger ON auth.users;
CREATE TRIGGER sync_auth_user_trigger
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_auth_user_to_profile();

-- Sync existing users
UPDATE profiles p
SET 
    email = u.email,
    last_sign_in_at = u.last_sign_in_at,
    created_at = u.created_at
FROM auth.users u
WHERE p.id = u.id;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Profiles are viewable by admin users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
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

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by admin users"
    ON profiles
    FOR SELECT
    USING (is_admin_check());

CREATE POLICY "Users can view their own profile"
    ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
    ON profiles
    FOR UPDATE
    USING (is_admin_check());

-- Grant permissions
GRANT ALL ON user_roles TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Add admin role for bankiqify@gmail.com
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'bankiqify@gmail.com';

    -- If we found the user, insert the admin role if it doesn't exist
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Added admin role for user ID: %', admin_user_id;
    ELSE
        RAISE EXCEPTION 'User with email bankiqify@gmail.com not found';
    END IF;
END;
$$; 
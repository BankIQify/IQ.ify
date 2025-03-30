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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles are viewable by admin users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for admin view access
CREATE POLICY "Profiles are viewable by admin users"
    ON profiles
    FOR SELECT
    USING (is_admin_check());

-- Policy for user view access
CREATE POLICY "Users can view their own profile"
    ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy for user update access
CREATE POLICY "Users can update their own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy for admin update access
CREATE POLICY "Admins can update any profile"
    ON profiles
    FOR UPDATE
    USING (is_admin_check());

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated; 
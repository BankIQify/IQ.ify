-- First, ensure public schema is accessible
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant access to profiles table
GRANT ALL ON profiles TO postgres, anon, authenticated, service_role;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by admin users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create more permissive policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Ensure user_roles table is properly accessible
GRANT ALL ON user_roles TO postgres, anon, authenticated, service_role;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

-- Create more permissive policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
    ON user_roles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON user_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Ensure sequences are accessible
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Add initial admin user if not exists
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
        
        -- Also ensure they have a profile
        INSERT INTO profiles (id, email, role)
        VALUES (admin_user_id, 'bankiqify@gmail.com', 'admin')
        ON CONFLICT (id) DO UPDATE
        SET role = 'admin';
        
        RAISE NOTICE 'Added/Updated admin role and profile for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'User with email bankiqify@gmail.com not found';
    END IF;
END;
$$; 
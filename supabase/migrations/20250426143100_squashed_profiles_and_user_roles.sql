-- SQUASHED MIGRATION: Consolidates all incremental changes to profiles, user_roles, and related policies/functions

-- 1. Create or update profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create or update user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. Function to sync auth.users to profiles
CREATE OR REPLACE FUNCTION sync_auth_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        email = NEW.email,
        last_sign_in_at = NEW.last_sign_in_at,
        created_at = NEW.created_at
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger for syncing auth.users to profiles
DROP TRIGGER IF EXISTS sync_auth_user_trigger ON auth.users;
CREATE TRIGGER sync_auth_user_trigger
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION sync_auth_user_to_profile();

-- 5. Admin check function
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

-- 6. Row Level Security (RLS) and policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by admin users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- 7. RLS and policies for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

CREATE POLICY "Users can view their own roles"
    ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
    ON user_roles FOR SELECT USING (is_admin_check());
CREATE POLICY "Admins can manage roles"
    ON user_roles FOR ALL USING (is_admin_check());

-- 8. Grant permissions
GRANT ALL ON profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON user_roles TO postgres, anon, authenticated, service_role;

-- 9. Sync existing users to profiles
UPDATE profiles p
SET 
    email = u.email,
    last_sign_in_at = u.last_sign_in_at,
    created_at = u.created_at
FROM auth.users u
WHERE p.id = u.id;

-- 10. Insert admin role for bankiqify@gmail.com
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'bankiqify@gmail.com';
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

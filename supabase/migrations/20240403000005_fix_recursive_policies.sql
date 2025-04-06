-- First, disable RLS temporarily to ensure we can modify the policies
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.user_roles;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create a security definer function that doesn't use RLS internally
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = $1
        AND role = 'admin'
    );
$$;

-- Create new, simplified policies that don't cause recursion
CREATE POLICY "Allow users to see their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
    );

CREATE POLICY "Allow admins full access"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (
        public.check_is_admin(auth.uid())
    );

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Ensure the admin role exists for bankiqify@gmail.com
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID for bankiqify@gmail.com
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'bankiqify@gmail.com';

    IF admin_user_id IS NOT NULL THEN
        -- Add admin role if it doesn't exist
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;

        RAISE NOTICE 'Admin role verified for user %', admin_user_id;
    ELSE
        RAISE NOTICE 'User bankiqify@gmail.com not found';
    END IF;
END;
$$;

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT EXECUTE ON FUNCTION public.check_is_admin TO authenticated; 
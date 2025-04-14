-- First, check if the user exists
SELECT id, email FROM auth.users WHERE email = 'bankiqify@gmail.com';

-- Check current roles
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'bankiqify@gmail.com';

-- Fix the admin role
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID for bankiqify@gmail.com
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'bankiqify@gmail.com';

    -- If the user exists
    IF admin_user_id IS NOT NULL THEN
        -- Remove any existing roles for this user
        DELETE FROM public.user_roles WHERE user_id = admin_user_id;

        -- Add admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin');

        -- Verify the role was added
        IF EXISTS (
            SELECT 1 
            FROM public.user_roles 
            WHERE user_id = admin_user_id 
            AND role = 'admin'
        ) THEN
            RAISE NOTICE 'Admin role verified for user %', admin_user_id;
        ELSE
            RAISE EXCEPTION 'Failed to add admin role for user %', admin_user_id;
        END IF;
    ELSE
        RAISE EXCEPTION 'Admin user not found';
    END IF;
END $$;

-- Fix RLS policies to prevent infinite recursion
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

    -- Create simplified policies
    CREATE POLICY "Users can view their own roles"
        ON public.user_roles
        FOR SELECT
        USING (auth.uid() = user_id);

    -- Grant necessary permissions
    GRANT ALL ON public.user_roles TO authenticated;
    GRANT ALL ON public.user_roles TO service_role;
END $$;

-- Verify the fix
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'bankiqify@gmail.com'; 
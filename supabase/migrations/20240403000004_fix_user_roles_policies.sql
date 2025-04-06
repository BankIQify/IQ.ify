-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Temporarily disable RLS to ensure we can add the admin role
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Ensure the admin user has the role
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

        RAISE NOTICE 'Admin role ensured for user %', admin_user_id;
    ELSE
        RAISE EXCEPTION 'User bankiqify@gmail.com not found';
    END IF;
END;
$$;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create simplified policies that ensure basic access works
CREATE POLICY "Enable read access for all authenticated users"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable all access for admin users"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Verify the admin role exists and is queryable
DO $$
DECLARE
    role_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN auth.users u ON ur.user_id = u.id
        WHERE u.email = 'bankiqify@gmail.com'
        AND ur.role = 'admin'
    ) INTO role_exists;

    IF role_exists THEN
        RAISE NOTICE 'Admin role verified and queryable';
    ELSE
        RAISE EXCEPTION 'Admin role verification failed';
    END IF;
END;
$$; 
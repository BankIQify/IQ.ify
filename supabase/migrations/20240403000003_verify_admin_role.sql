-- Verify and ensure admin role for bankiqify@gmail.com
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
        -- Ensure user_roles table exists
        CREATE TABLE IF NOT EXISTS public.user_roles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(user_id, role)
        );

        -- Add admin role if it doesn't exist
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;

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

        -- Ensure RLS is enabled
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

        -- Recreate RLS policies
        DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
        DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
        DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

        CREATE POLICY "Users can view their own roles"
            ON public.user_roles
            FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Admins can view all roles"
            ON public.user_roles
            FOR SELECT
            USING (EXISTS (
                SELECT 1 
                FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
            ));

        CREATE POLICY "Admins can manage roles"
            ON public.user_roles
            FOR ALL
            USING (EXISTS (
                SELECT 1 
                FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
            ));

        -- Grant necessary permissions
        GRANT ALL ON public.user_roles TO authenticated;
        GRANT ALL ON public.user_roles TO service_role;

    ELSE
        RAISE EXCEPTION 'User bankiqify@gmail.com not found in auth.users';
    END IF;
END;
$$; 
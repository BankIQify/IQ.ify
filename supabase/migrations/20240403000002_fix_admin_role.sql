-- First ensure the user_roles table exists
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin_check()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add the admin user and role
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
        -- Ensure profile exists
        INSERT INTO public.profiles (id, email)
        VALUES (admin_user_id, 'bankiqify@gmail.com')
        ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email;

        -- Add admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;

        RAISE NOTICE 'Admin role added for user %', admin_user_id;
    ELSE
        RAISE NOTICE 'User bankiqify@gmail.com not found in auth.users';
    END IF;
END;
$$;

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON public.user_roles
    FOR SELECT
    USING (is_admin_check());

CREATE POLICY "Admins can manage roles"
    ON public.user_roles
    FOR ALL
    USING (is_admin_check()); 
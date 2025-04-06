-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION public.check_is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_user_session(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.end_user_session() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity(text, jsonb, boolean) TO authenticated;

-- Ensure profiles table permissions are correct
GRANT ALL ON public.profiles TO authenticated;

-- Create or replace the check_is_admin function with proper security
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_roles.user_id = $1 
        AND user_roles.role = 'admin'
    );
END;
$$; 
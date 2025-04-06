-- Create a security definer function that doesn't use RLS internally
CREATE OR REPLACE FUNCTION public.check_user_role(user_id uuid, role_name text)
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
        AND role::text = $2::text
    );
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_user_role TO authenticated; 
-- Grant necessary permissions for auth schema
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO anon, authenticated;
GRANT ALL ON auth.refresh_tokens TO anon, authenticated;

-- Grant execute permission on auth functions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;

-- Ensure auth schema sequences are accessible
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated;

-- Additional grants for auth-related operations
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON auth.users TO service_role;

-- Ensure public schema functions can access auth schema
ALTER FUNCTION public.is_admin_check() SET search_path = public, auth;

-- Recreate the trigger function with explicit schema references
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    created_at = EXCLUDED.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_user_to_profile(); 
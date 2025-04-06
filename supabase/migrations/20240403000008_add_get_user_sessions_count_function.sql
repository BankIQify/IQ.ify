-- Create function to count user sessions
CREATE OR REPLACE FUNCTION public.get_user_sessions_count(user_ids uuid[])
RETURNS TABLE (
    user_id uuid,
    total_sessions bigint,
    last_activity timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.user_id,
        COUNT(DISTINCT us.id) as total_sessions,
        MAX(COALESCE(us.ended_at, us.started_at)) as last_activity
    FROM 
        user_sessions us
    WHERE 
        us.user_id = ANY(user_ids)
    GROUP BY 
        us.user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_sessions_count(uuid[]) TO authenticated; 
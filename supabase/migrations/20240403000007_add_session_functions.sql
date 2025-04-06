-- Wrap everything in a transaction
BEGIN;

DO $$ 
BEGIN
    -- Drop all existing policies first
    DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
    DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.user_sessions;
    DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
    DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
    DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;
EXCEPTION 
    WHEN OTHERS THEN 
    -- If there's an error dropping policies, we'll just continue
    NULL;
END $$;

-- Create user_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    ip_address TEXT,
    user_agent TEXT,
    duration_minutes INTEGER
);

-- Create user_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    success BOOLEAN DEFAULT true
);

-- Function to start a user session
CREATE OR REPLACE FUNCTION public.start_user_session(
    p_user_agent TEXT,
    p_ip_address TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO user_sessions (
        user_id,
        user_agent,
        ip_address
    ) VALUES (
        auth.uid(),
        p_user_agent,
        p_ip_address
    );
END;
$$;

-- Function to end a user session
CREATE OR REPLACE FUNCTION public.end_user_session()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE user_sessions
    SET 
        ended_at = now(),
        duration_minutes = EXTRACT(EPOCH FROM (now() - started_at))/60
    WHERE 
        user_id = auth.uid() 
        AND ended_at IS NULL;
END;
$$;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_activity_type TEXT,
    p_activity_details JSONB DEFAULT '{}'::jsonb,
    p_success BOOLEAN DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO user_activities (
        user_id,
        activity_type,
        activity_details,
        success
    ) VALUES (
        auth.uid(),
        p_activity_type,
        p_activity_details,
        p_success
    );
END;
$$;

-- Enable RLS on the tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Create policies for user_sessions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_sessions' AND policyname = 'Users can view their own sessions'
    ) THEN
        CREATE POLICY "Users can view their own sessions"
            ON public.user_sessions
            FOR SELECT
            TO authenticated
            USING (user_id = auth.uid() OR public.check_is_admin(auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_sessions' AND policyname = 'Users can insert their own sessions'
    ) THEN
        CREATE POLICY "Users can insert their own sessions"
            ON public.user_sessions
            FOR INSERT
            TO authenticated
            WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_sessions' AND policyname = 'Users can update their own sessions'
    ) THEN
        CREATE POLICY "Users can update their own sessions"
            ON public.user_sessions
            FOR UPDATE
            TO authenticated
            USING (user_id = auth.uid());
    END IF;

    -- Create policies for user_activities
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_activities' AND policyname = 'Users can view their own activities'
    ) THEN
        CREATE POLICY "Users can view their own activities"
            ON public.user_activities
            FOR SELECT
            TO authenticated
            USING (user_id = auth.uid() OR public.check_is_admin(auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_activities' AND policyname = 'Users can insert their own activities'
    ) THEN
        CREATE POLICY "Users can insert their own activities"
            ON public.user_activities
            FOR INSERT
            TO authenticated
            WITH CHECK (user_id = auth.uid());
    END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_activities TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_user_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.end_user_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity TO authenticated;

COMMIT; 
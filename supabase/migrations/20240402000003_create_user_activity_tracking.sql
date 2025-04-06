-- Create user_sessions table to track login sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER GENERATED ALWAYS AS 
        (EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))/60)::INTEGER STORED,
    ip_address TEXT,
    user_agent TEXT
);

-- Create user_activities table to track specific actions
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    activity_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT true
);

-- Add RLS policies
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
    ON public.user_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
    ON public.user_sessions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Policies for user_activities
CREATE POLICY "Users can view their own activities"
    ON public.user_activities
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities"
    ON public.user_activities
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Grant access to authenticated users
GRANT ALL ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_activities TO authenticated;

-- Create function to start a new session
CREATE OR REPLACE FUNCTION public.start_user_session(
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session_id UUID;
BEGIN
    -- End any existing active sessions for the user
    UPDATE public.user_sessions
    SET ended_at = NOW()
    WHERE user_id = auth.uid()
    AND ended_at IS NULL;
    
    -- Create new session
    INSERT INTO public.user_sessions (user_id, user_agent, ip_address)
    VALUES (auth.uid(), p_user_agent, p_ip_address)
    RETURNING id INTO v_session_id;
    
    RETURN v_session_id;
END;
$$;

-- Create function to end a session
CREATE OR REPLACE FUNCTION public.end_user_session(
    p_session_id UUID DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_session_id IS NULL THEN
        -- End all active sessions for the user
        UPDATE public.user_sessions
        SET ended_at = NOW()
        WHERE user_id = auth.uid()
        AND ended_at IS NULL;
    ELSE
        -- End specific session
        UPDATE public.user_sessions
        SET ended_at = NOW()
        WHERE id = p_session_id
        AND user_id = auth.uid();
    END IF;
END;
$$;

-- Create function to log activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_activity_type TEXT,
    p_activity_details JSONB DEFAULT '{}',
    p_success BOOLEAN DEFAULT true
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_activity_id UUID;
    v_session_id UUID;
BEGIN
    -- Get current active session
    SELECT id INTO v_session_id
    FROM public.user_sessions
    WHERE user_id = auth.uid()
    AND ended_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1;
    
    -- Log activity
    INSERT INTO public.user_activities (
        user_id,
        session_id,
        activity_type,
        activity_details,
        success
    )
    VALUES (
        auth.uid(),
        v_session_id,
        p_activity_type,
        p_activity_details,
        p_success
    )
    RETURNING id INTO v_activity_id;
    
    RETURN v_activity_id;
END;
$$; 
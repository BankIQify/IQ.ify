-- Create games table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create game_attempts table
CREATE TABLE IF NOT EXISTS public.game_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exams table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exam_attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    passed BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exam_subtopic_attempts table
CREATE TABLE IF NOT EXISTS public.exam_subtopic_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    subtopic_id UUID REFERENCES public.subtopics(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create question_sections table
CREATE TABLE IF NOT EXISTS public.question_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sub_topics table
CREATE TABLE IF NOT EXISTS public.sub_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    section_id UUID REFERENCES public.question_sections(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content JSONB NOT NULL,
    question_type TEXT NOT NULL,
    sub_topic_id UUID REFERENCES public.sub_topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subtopic_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies for games
CREATE POLICY "Games are viewable by everyone"
    ON public.games
    FOR SELECT
    USING (true);

-- Create policies for game_attempts
CREATE POLICY "Users can view their own game attempts"
    ON public.game_attempts
    FOR SELECT
    USING (auth.uid() = user_id OR public.check_is_admin(auth.uid()));

CREATE POLICY "Users can insert their own game attempts"
    ON public.game_attempts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for exams
CREATE POLICY "Exams are viewable by everyone"
    ON public.exams
    FOR SELECT
    USING (true);

-- Create policies for exam_attempts
CREATE POLICY "Users can view their own exam attempts"
    ON public.exam_attempts
    FOR SELECT
    USING (auth.uid() = user_id OR public.check_is_admin(auth.uid()));

CREATE POLICY "Users can insert their own exam attempts"
    ON public.exam_attempts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for exam_subtopic_attempts
CREATE POLICY "Users can view their own subtopic attempts"
    ON public.exam_subtopic_attempts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.exam_attempts ea
            WHERE ea.id = exam_attempt_id
            AND ea.user_id = auth.uid()
        )
        OR public.check_is_admin(auth.uid())
    );

CREATE POLICY "Users can insert their own subtopic attempts"
    ON public.exam_subtopic_attempts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.exam_attempts ea
            WHERE ea.id = exam_attempt_id
            AND ea.user_id = auth.uid()
        )
    );

-- Create policies for question_sections
CREATE POLICY "Anyone can view question sections"
    ON public.question_sections
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for sub_topics
CREATE POLICY "Anyone can view sub topics"
    ON public.sub_topics
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for questions
CREATE POLICY "Anyone can view questions"
    ON public.questions
    FOR SELECT
    TO authenticated
    USING (true);

-- Grant permissions to authenticated users
GRANT ALL ON public.games TO authenticated;
GRANT ALL ON public.game_attempts TO authenticated;
GRANT ALL ON public.exams TO authenticated;
GRANT ALL ON public.exam_attempts TO authenticated;
GRANT ALL ON public.exam_subtopic_attempts TO authenticated;
GRANT ALL ON public.question_sections TO authenticated;
GRANT ALL ON public.sub_topics TO authenticated;
GRANT ALL ON public.questions TO authenticated;

-- Add some sample data
INSERT INTO public.question_sections (name, category, description)
VALUES 
    ('Verbal Reasoning', 'verbal', 'Questions testing verbal reasoning skills'),
    ('Non-Verbal Reasoning', 'non_verbal', 'Questions testing non-verbal reasoning skills'),
    ('Brain Training', 'brain_training', 'Questions for brain training exercises');

INSERT INTO public.sub_topics (name, section_id)
SELECT 
    'Sample Sub-topic',
    id
FROM public.question_sections;

INSERT INTO public.questions (content, question_type, sub_topic_id)
SELECT 
    '{"question": "What is 2 + 2?", "options": ["3", "4", "5"], "answer": "4"}'::jsonb,
    'multiple_choice',
    id
FROM public.sub_topics
LIMIT 1; 
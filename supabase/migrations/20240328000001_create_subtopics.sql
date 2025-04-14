-- Create subtopics table
CREATE TABLE IF NOT EXISTS subtopics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    main_subject TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_subtopic_performance table
CREATE TABLE IF NOT EXISTS user_subtopic_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subtopic_id UUID,
    exam_id UUID,  -- Optional reference to the specific exam
    score INTEGER NOT NULL,
    improvement_suggestions TEXT,
    last_tested TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subtopic_id, exam_id),
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subtopic_performance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Subtopics are viewable by everyone"
    ON subtopics
    FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own performance"
    ON user_subtopic_performance
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create function to get user performance with subjects
CREATE OR REPLACE FUNCTION get_user_performance_with_subjects(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    subtopic_id UUID,
    score INTEGER,
    improvement_suggestions TEXT,
    last_tested TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    main_subject TEXT,
    subtopic_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        usp.id,
        usp.user_id,
        usp.subtopic_id,
        usp.score,
        usp.improvement_suggestions,
        usp.last_tested,
        usp.created_at,
        usp.updated_at,
        s.main_subject,
        s.name as subtopic_name
    FROM user_subtopic_performance usp
    JOIN subtopics s ON s.id = usp.subtopic_id
    WHERE usp.user_id = p_user_id
    ORDER BY usp.score ASC
    LIMIT 3;
END;
$$;

-- Create function to update user subtopic performance
CREATE OR REPLACE FUNCTION update_user_subtopic_performance(
    p_user_id UUID,
    p_subtopic_id UUID,
    p_exam_id UUID,
    p_score INTEGER,
    p_improvement_suggestions TEXT DEFAULT NULL
)
RETURNS user_subtopic_performance
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        INSERT INTO user_subtopic_performance (
            user_id,
            subtopic_id,
            exam_id,
            score,
            improvement_suggestions
        )
        VALUES (
            p_user_id,
            p_subtopic_id,
            p_exam_id,
            p_score,
            COALESCE(
                p_improvement_suggestions,
                CASE 
                    WHEN p_score < 50 THEN 'Focus on understanding core concepts and practicing basic problems.'
                    WHEN p_score < 60 THEN 'Continue practicing with medium difficulty problems to build confidence.'
                    WHEN p_score < 75 THEN 'Challenge yourself with harder problems to master this topic.'
                    ELSE 'Excellent work! Help others and maintain your expertise.'
                END
            )
        )
        ON CONFLICT (user_id, subtopic_id, exam_id)
        DO UPDATE SET
            score = EXCLUDED.score,
            improvement_suggestions = EXCLUDED.improvement_suggestions,
            last_tested = NOW(),
            updated_at = NOW()
        RETURNING *
    );
END;
$$; 
-- Create a role for data input access
CREATE ROLE data_input;

-- Grant specific permissions to the data input role
GRANT USAGE ON SCHEMA public TO data_input;
GRANT SELECT ON public.profiles TO data_input;
GRANT SELECT ON public.questions TO data_input;
GRANT SELECT ON public.subjects TO data_input;
GRANT SELECT ON public.subheadings TO data_input;

-- Create the data input user
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'datateam.iqify@gmail.com') THEN
        INSERT INTO auth.users (email, role)
        VALUES ('datateam.iqify@gmail.com', 'data_input');
    END IF;
END $$;

-- Create a view for the dashboard statistics
CREATE OR REPLACE VIEW data_input_dashboard AS
SELECT 
    s.name as subject,
    COUNT(q.id) as total_questions,
    jsonb_agg(
        jsonb_build_object(
            'subheading', sh.name,
            'question_count', COUNT(q.id) FILTER (WHERE q.subheading_id = sh.id)
        )
    ) as subheadings
FROM subjects s
LEFT JOIN subheadings sh ON s.id = sh.subject_id
LEFT JOIN questions q ON q.subheading_id = sh.id
GROUP BY s.id, s.name
ORDER BY s.name;

-- Grant access to the dashboard view
GRANT SELECT ON data_input_dashboard TO data_input;

-- Create a policy to restrict access to specific pages
CREATE POLICY data_input_policy ON auth.users
    FOR SELECT
    USING (email = 'datateam.iqify@gmail.com');

-- Create a policy for the dashboard view
CREATE POLICY data_input_dashboard_policy ON data_input_dashboard
    FOR SELECT
    USING (true);

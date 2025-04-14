-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.get_activity_summary();
DROP FUNCTION IF EXISTS public.get_game_activities();
DROP FUNCTION IF EXISTS public.get_exam_activities();

-- Create updated activity summary function
CREATE OR REPLACE FUNCTION public.get_activity_summary()
RETURNS TABLE (
  total_users INTEGER,
  active_users INTEGER,
  total_sessions INTEGER,
  average_session_duration NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT user_id)::INTEGER as total_users,
    COUNT(DISTINCT CASE WHEN ended_at > NOW() - INTERVAL '7 days' THEN user_id END)::INTEGER as active_users,
    COUNT(*)::INTEGER as total_sessions,
    AVG(duration_minutes)::NUMERIC as average_session_duration
  FROM user_sessions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated game activities function
CREATE OR REPLACE FUNCTION public.get_game_activities()
RETURNS TABLE (
  game_name TEXT,
  total_plays INTEGER,
  average_score NUMERIC,
  unique_players INTEGER,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.name as game_name,
    COUNT(*)::INTEGER as total_plays,
    AVG(ga.score)::NUMERIC as average_score,
    COUNT(DISTINCT ga.user_id)::INTEGER as unique_players,
    (COUNT(*) FILTER (WHERE ga.completed = true)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC * 100) as completion_rate
  FROM game_attempts ga
  JOIN games g ON g.id = ga.game_id
  GROUP BY g.name
  ORDER BY total_plays DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated exam activities function
CREATE OR REPLACE FUNCTION public.get_exam_activities()
RETURNS TABLE (
  exam_type TEXT,
  total_attempts INTEGER,
  average_score NUMERIC,
  pass_rate NUMERIC,
  top_subtopics JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH exam_stats AS (
    SELECT 
      e.type as exam_type,
      COUNT(*)::INTEGER as total_attempts,
      AVG(ea.score)::NUMERIC as average_score,
      (COUNT(*) FILTER (WHERE ea.passed = true)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC * 100) as pass_rate
    FROM exam_attempts ea
    JOIN exams e ON e.id = ea.exam_id
    GROUP BY e.type
  ),
  subtopic_stats AS (
    SELECT 
      e.type as exam_type,
      s.name as subtopic_name,
      COUNT(*) as attempts,
      AVG(esa.score) as average_score
    FROM exam_subtopic_attempts esa
    JOIN exam_attempts ea ON ea.id = esa.exam_attempt_id
    JOIN exams e ON e.id = ea.exam_id
    JOIN subtopics s ON s.id = esa.subtopic_id
    GROUP BY e.type, s.name
  )
  SELECT 
    es.exam_type,
    es.total_attempts,
    es.average_score,
    es.pass_rate,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', ss.subtopic_name,
          'attempts', ss.attempts,
          'average_score', ss.average_score
        )
        ORDER BY ss.attempts DESC
        LIMIT 5
      )
      FROM subtopic_stats ss
      WHERE ss.exam_type = es.exam_type
    ) as top_subtopics
  FROM exam_stats es
  ORDER BY es.total_attempts DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_activity_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_game_activities() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_exam_activities() TO authenticated; 
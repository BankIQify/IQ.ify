-- Add initial stickers
INSERT INTO achievements (title, description, type, category, visual_asset, unlock_condition) VALUES
  ('First Steps', 'Complete your first verbal reasoning test', 'sticker', 'verbal_reasoning', '/achievements/stickers/verbal_reasoning/first_steps.png', 
    '{"type": "count", "target": 1, "metric": "verbal_tests_completed"}'::jsonb),
  ('Word Wizard', 'Score 80% or higher on a verbal test', 'sticker', 'verbal_reasoning', '/achievements/stickers/verbal_reasoning/word_wizard.png',
    '{"type": "score", "target": 80, "metric": "verbal_test_score"}'::jsonb),
  ('Pattern Pro', 'Complete 5 non-verbal reasoning tests', 'sticker', 'non_verbal_reasoning', '/achievements/stickers/non_verbal/pattern_pro.png',
    '{"type": "count", "target": 5, "metric": "non_verbal_tests_completed"}'::jsonb);

-- Add initial medals
INSERT INTO achievements (title, description, type, tier, category, visual_asset, unlock_condition) VALUES
  ('Verbal Virtuoso', 'Achieve an average score of 85% in verbal reasoning', 'medal', 'gold', 'verbal_reasoning', '/achievements/medals/verbal_reasoning/virtuoso.png',
    '{"type": "score", "target": 85, "metric": "verbal_average_score"}'::jsonb),
  ('Pattern Master', 'Complete 20 non-verbal reasoning tests', 'medal', 'silver', 'non_verbal_reasoning', '/achievements/medals/non_verbal/master.png',
    '{"type": "count", "target": 20, "metric": "non_verbal_tests_completed"}'::jsonb),
  ('Brain Trainer', 'Complete daily brain training for 7 days', 'medal', 'bronze', 'brain_training', '/achievements/medals/brain_training/trainer.png',
    '{"type": "streak", "target": 7, "metric": "daily_brain_training"}'::jsonb),
  ('Dedication', 'Log in for 10 consecutive days', 'medal', 'silver', 'daily_streaks', '/achievements/medals/streaks/dedication.png',
    '{"type": "streak", "target": 10, "metric": "daily_login"}'::jsonb);

-- Add initial trophies
INSERT INTO achievements (title, description, type, category, visual_asset, unlock_condition) VALUES
  ('Quiz Champion', 'Score 90% or higher on 10 different quizzes', 'trophy', 'quiz_mastery', '/achievements/trophies/quiz_mastery/champion.png',
    '{"type": "count", "target": 10, "metric": "high_score_quizzes"}'::jsonb),
  ('Game Guru', 'Win 50 brain training games', 'trophy', 'game_master', '/achievements/trophies/game_master/guru.png',
    '{"type": "count", "target": 50, "metric": "games_won"}'::jsonb),
  ('Brain Master', 'Achieve mastery in all brain training categories', 'trophy', 'brain_training', '/achievements/trophies/brain_training/master.png',
    '{"type": "count", "target": 5, "metric": "brain_categories_mastered"}'::jsonb);

-- Add some placeholder achievements for testing
INSERT INTO user_achievements (user_id, achievement_id, is_unlocked, progress)
SELECT 
  auth.uid(),
  achievements.id,
  FALSE,
  '{"current": 0, "target": ' || (unlock_condition->>'target')::text || '}'::jsonb
FROM achievements
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid()
); 
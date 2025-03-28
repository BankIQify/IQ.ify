-- Insert initial achievements
INSERT INTO achievements (title, description, type, tier, category, visual_asset, unlock_condition) VALUES
-- Medals
('Quick Thinker', 'Complete 5 quizzes in under 10 minutes each', 'medal', 'bronze', 'quiz_mastery', '/medals/quick-thinker.png', '{"type": "count", "target": 5, "metric": "quick_quizzes"}'),
('Speed Demon', 'Complete 15 quizzes in under 8 minutes each', 'medal', 'silver', 'quiz_mastery', '/medals/speed-demon.png', '{"type": "count", "target": 15, "metric": "quick_quizzes"}'),
('Time Lord', 'Complete 30 quizzes in under 5 minutes each', 'medal', 'gold', 'quiz_mastery', '/medals/time-lord.png', '{"type": "count", "target": 30, "metric": "quick_quizzes"}'),

-- Trophies
('Brain Training Novice', 'Complete your first set of brain training exercises', 'trophy', NULL, 'brain_training', '/trophies/brain-novice.png', '{"type": "count", "target": 1, "metric": "brain_training_completed"}'),
('Brain Training Master', 'Complete 50 brain training exercises', 'trophy', NULL, 'brain_training', '/trophies/brain-master.png', '{"type": "count", "target": 50, "metric": "brain_training_completed"}'),
('Perfect Score Champion', 'Achieve 10 perfect scores in quizzes', 'trophy', NULL, 'quiz_mastery', '/trophies/perfect-score.png', '{"type": "count", "target": 10, "metric": "perfect_scores"}'),

-- Stickers
('First Steps', 'Complete your first quiz', 'sticker', NULL, 'general', '/stickers/first-steps.png', '{"type": "count", "target": 1, "metric": "quizzes_completed"}'),
('Rising Star', 'Achieve a 7-day study streak', 'sticker', NULL, 'daily_streaks', '/stickers/rising-star.png', '{"type": "streak", "target": 7, "metric": "daily_login"}'),
('Math Whiz', 'Score 90%+ in 5 math quizzes', 'sticker', NULL, 'quiz_mastery', '/stickers/math-whiz.png', '{"type": "count", "target": 5, "metric": "high_score_math"}'); 
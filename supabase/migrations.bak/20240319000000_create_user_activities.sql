-- Create enum for activity types
CREATE TYPE activity_type AS ENUM (
  'practice_test',
  'brain_game',
  'verbal_reasoning',
  'achievement'
);

-- Create user_activities table
CREATE TABLE user_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type activity_type NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  path TEXT NOT NULL,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,
  gradient_from TEXT NOT NULL,
  gradient_to TEXT NOT NULL,
  border_color TEXT NOT NULL,
  text_color TEXT NOT NULL,
  icon_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX user_activities_user_id_idx ON user_activities(user_id);
CREATE INDEX user_activities_type_idx ON user_activities(type);
CREATE INDEX user_activities_access_count_idx ON user_activities(access_count DESC);

-- Create function to update last_accessed and access_count
CREATE OR REPLACE FUNCTION update_activity_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed = NOW();
  NEW.access_count = OLD.access_count + 1;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update activity access
CREATE TRIGGER update_activity_access_trigger
  BEFORE UPDATE ON user_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_access();

-- Create RLS policies
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities"
  ON user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON user_activities FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 
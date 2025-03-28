export type ActivityType = 
  | 'practice_test'
  | 'brain_game'
  | 'verbal_reasoning'
  | 'achievement';

export interface UserActivity {
  id: string;
  type: ActivityType;
  title: string;
  icon: string;
  path: string;
  lastAccessed: string;
  accessCount: number;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
}

export interface QuickAction {
  type: ActivityType;
  title: string;
  icon: string;
  path: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
} 
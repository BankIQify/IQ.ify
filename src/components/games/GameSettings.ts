export type Difficulty = 'easy' | 'moderate' | 'challenging';

export type GameType = 'word_search' | 'memory' | 'puzzle' | 'quiz' | 'rope_untangle';

export interface GameSettings {
  difficulty: Difficulty;
  gameType: GameType;
  theme?: string;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  challenging: 'Challenging',
};

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  word_search: 'Word Search',
  memory: 'Memory',
  puzzle: 'Puzzle',
  quiz: 'Quiz',
  rope_untangle: 'Rope Untangle',
}; 

// Define common types for the 24 Game
export interface TwentyFourPuzzle {
  id: string;
  numbers: number[];
  solution?: string;
}

// This must match the values in the game_puzzle_type enum in the database
export type TwentyFourGameType = "twenty_four";

// This defines the valid game types for the use-game-state hook
export const GAME_TYPES = [
  "word_search",
  "crossword",
  "sudoku",
  "twenty_four",
  "memory",
  "geography",
  "times_tables",
  "iq_test"
] as const;

export type GameType = typeof GAME_TYPES[number];

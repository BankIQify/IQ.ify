
// Define common types for the 24 Game
export interface TwentyFourPuzzle {
  id: string;
  numbers: number[];
  solution?: string;
}

// Use the correct game_type from the database enum
// This must match the values in the game_puzzle_type enum in the database
export type TwentyFourGameType = "twenty_four";

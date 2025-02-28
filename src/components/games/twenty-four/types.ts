
// Define common types for the 24 Game
export interface TwentyFourPuzzle {
  id: string;
  numbers: number[];
  solution?: string;
}

// Add this type to the database game types
export type GameType = "word_search" | "crossword" | "sudoku" | "memory" | "geography" | "times_tables" | "iq_test" | "twenty_four";

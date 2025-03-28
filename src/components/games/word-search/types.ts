
import type { Difficulty } from "@/components/games/GameSettings";
import type { Json } from "@/integrations/supabase/types";

export interface WordToFind {
  word: string;
  found: boolean;
}

export interface WordSearchPuzzleData {
  grid: string[][];
  words: string[];
}

export interface WordSearchPuzzle {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: WordSearchPuzzleData;
  theme?: {
    name: string;
  };
}

export interface RawPuzzleData {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: Json;
  game_themes: {
    name: string;
  };
}

export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface GameContextProps {
  grid: string[][];
  words: WordToFind[];
  selectedCells: [number, number][];
  gridDimensions: GridDimensions;
  isGameComplete: boolean;
  handleCellClick: (row: number, col: number) => void;
  checkSelection: () => void;
}


import type { Difficulty } from "@/components/games/GameSettings";
import type { Json } from "@/integrations/supabase/types";

export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
  userInput: string;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

export interface CrosswordPuzzleData {
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
}

export interface CrosswordPuzzle {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: CrosswordPuzzleData;
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

export interface GameContextProps {
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
  selectedCell: [number, number] | null;
  isAcross: boolean;
  correctAnswers: number;
  totalAnswers: number;
  handleCellClick: (row: number, col: number) => void;
  handleKeyPress: (event: React.KeyboardEvent, row: number, col: number) => void;
}

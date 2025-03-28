
import type { Difficulty } from "@/components/games/GameSettings";

export interface DifficultyConfig {
  minWordLength: number;
  maxWordLength: number;
  minWordCount: number;
  maxWordCount: number;
  gridSize: number;
}

export function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case "easy":
      return { 
        minWordLength: 3, 
        maxWordLength: 5,
        minWordCount: 5,
        maxWordCount: 8,
        gridSize: 8
      };
    case "medium":
      return { 
        minWordLength: 4, 
        maxWordLength: 6,
        minWordCount: 6,
        maxWordCount: 10,
        gridSize: 10
      };
    case "hard":
      return { 
        minWordLength: 5, 
        maxWordLength: 10,
        minWordCount: 8,
        maxWordCount: 15,
        gridSize: 12
      };
    default:
      return { 
        minWordLength: 4, 
        maxWordLength: 6,
        minWordCount: 6,
        maxWordCount: 10,
        gridSize: 10
      };
  }
}

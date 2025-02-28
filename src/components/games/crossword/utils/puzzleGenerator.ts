
import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordCell, CrosswordClue, CrosswordPuzzleData } from "../types";

export const generateDummyCrossword = (difficulty: Difficulty): CrosswordPuzzleData => {
  // Create dummy game based on difficulty
  const { minWordLength, maxWordLength, minWordCount } = getDifficultyConfig(difficulty);
  const wordCount = minWordCount;
  
  // Example 5x5 crossword
  const gridSize = Math.max(5, Math.min(8, Math.floor(minWordLength * 1.5)));
  const exampleGrid: CrosswordCell[][] = Array(gridSize).fill(null).map(() =>
    Array(gridSize).fill(null).map(() => ({
      letter: '',
      isBlack: false,
      userInput: ''
    }))
  );

  // Add some black cells and numbers
  exampleGrid[0][2].isBlack = true;
  exampleGrid[2][2].isBlack = true;
  exampleGrid[4 % gridSize][2].isBlack = true;

  // Add numbers to cells
  exampleGrid[0][0].number = 1;
  exampleGrid[0][3].number = 2;
  exampleGrid[1][0].number = 3;
  exampleGrid[3 % gridSize][0].number = 4;

  // Generate word lengths appropriate for difficulty
  const generateWord = (len: number) => 
    Array(len).fill(0).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
  
  const exampleClues: CrosswordClue[] = [];
  
  // Generate appropriate number of clues based on difficulty
  for (let i = 1; i <= wordCount; i++) {
    const wordLen = Math.floor(Math.random() * 
      (maxWordLength - minWordLength + 1)) + minWordLength;
    
    const direction = i % 2 === 0 ? 'across' : 'down';
    const word = generateWord(wordLen);
    
    exampleClues.push({
      number: i,
      clue: `Example clue ${i} (${wordLen} letters)`,
      answer: word,
      direction
    });
  }

  return {
    grid: exampleGrid,
    clues: exampleClues
  };
};

// Helper function to get difficulty configuration
function getDifficultyConfig(difficulty: Difficulty) {
  switch (difficulty) {
    case "easy":
      return { 
        minWordLength: 3, 
        maxWordLength: 5,
        minWordCount: 5,
        maxWordCount: 8
      };
    case "medium":
      return { 
        minWordLength: 4, 
        maxWordLength: 6,
        minWordCount: 6,
        maxWordCount: 10
      };
    case "hard":
      return { 
        minWordLength: 5, 
        maxWordLength: 10,
        minWordCount: 8,
        maxWordCount: 15
      };
    default:
      return { 
        minWordLength: 4, 
        maxWordLength: 6,
        minWordCount: 6,
        maxWordCount: 10
      };
  }
}


import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordPuzzleData } from "../types";
import { wordLists } from "./wordLists";
import { getDifficultyConfig } from "./difficultyConfig";
import { filterWordsByDifficulty, selectRandomWords } from "./wordSelection";
import { 
  createCrosswordGrid, 
  canPlaceWord, 
  placeWord, 
  findIntersection, 
  fillEmptyCellsWithBlack 
} from "./gridOperations";
import { 
  addNumbersToGrid, 
  createClues, 
  type WordPlacement 
} from "./clueGeneration";

// Main function to generate a crossword puzzle
export const generateDummyCrossword = (difficulty: Difficulty, themeId: string = "general"): CrosswordPuzzleData => {
  const config = getDifficultyConfig(difficulty);
  const gridSize = config.gridSize;
  
  // Get word list for the selected theme, fall back to general if theme doesn't exist
  const themeWords = wordLists[themeId] || wordLists.general;
  
  // Filter words based on difficulty
  const filteredWords = filterWordsByDifficulty(themeWords, config.minWordLength, config.maxWordLength);
  
  // Determine number of words to include
  const wordCount = Math.min(
    Math.floor(Math.random() * (config.maxWordCount - config.minWordCount + 1)) + config.minWordCount,
    filteredWords.length
  );
  
  // Select random words
  const selectedWords = selectRandomWords(filteredWords, wordCount);
  
  // Sort words by length (longest first) to make placement easier
  selectedWords.sort((a, b) => b.word.length - a.word.length);
  
  // Create empty grid
  const grid = createCrosswordGrid(gridSize);
  
  // Place first word horizontally in the middle of the grid
  const firstWord = selectedWords[0].word;
  const middleRow = Math.floor(gridSize / 2);
  const startCol = Math.floor((gridSize - firstWord.length) / 2);
  
  placeWord(grid, firstWord, middleRow, startCol, true);
  
  // Track word placements
  const wordPlacements: WordPlacement[] = [
    { word: firstWord, row: middleRow, col: startCol, isAcross: true, clue: selectedWords[0].clue }
  ];
  
  // Try to place remaining words with intersections
  for (let i = 1; i < selectedWords.length; i++) {
    const currentWord = selectedWords[i].word;
    let placed = false;
    
    // Try to find intersections with already placed words
    const intersection = findIntersection(wordPlacements, currentWord);
    
    if (intersection && canPlaceWord(grid, currentWord, intersection.row, intersection.col, intersection.isAcross)) {
      placeWord(grid, currentWord, intersection.row, intersection.col, intersection.isAcross);
      wordPlacements.push({ 
        word: currentWord, 
        row: intersection.row, 
        col: intersection.col, 
        isAcross: intersection.isAcross,
        clue: selectedWords[i].clue
      });
      placed = true;
    } else {
      // If no intersection, try random placement
      const maxAttempts = 30;
      
      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const isAcross = Math.random() > 0.5;
        const maxRow = isAcross ? gridSize - 1 : gridSize - currentWord.length;
        const maxCol = isAcross ? gridSize - currentWord.length : gridSize - 1;
        
        const row = Math.floor(Math.random() * (maxRow + 1));
        const col = Math.floor(Math.random() * (maxCol + 1));
        
        if (canPlaceWord(grid, currentWord, row, col, isAcross)) {
          placeWord(grid, currentWord, row, col, isAcross);
          wordPlacements.push({ 
            word: currentWord, 
            row, 
            col, 
            isAcross,
            clue: selectedWords[i].clue 
          });
          placed = true;
        }
      }
    }
    
    // If word can't be placed after all attempts, just skip it
    if (!placed) {
      console.log(`Could not place word: ${currentWord}`);
    }
  }
  
  // Add numbers to grid cells
  addNumbersToGrid(grid, wordPlacements);
  
  // Create clues
  const clues = createClues(wordPlacements);
  
  // Fill remaining empty cells with black
  fillEmptyCellsWithBlack(grid);
  
  return {
    grid,
    clues
  };
};

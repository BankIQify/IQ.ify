
import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordPuzzleData } from "../types";
import { wordLists } from "./wordLists";
import { getDifficultyConfig } from "./difficultyConfig";
import { filterWordsByDifficulty, selectRandomWords } from "./wordSelection";
import { 
  createCrosswordGrid, 
  canPlaceWord, 
  placeWord, 
  findIntersection
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
  
  // Try to place remaining words with intersections - more aggressive crossword pattern
  for (let i = 1; i < selectedWords.length; i++) {
    const currentWord = selectedWords[i].word;
    let placed = false;
    
    // Try to find intersections with already placed words - try more aggressively
    for (let attempt = 0; attempt < 10 && !placed; attempt++) { // Increased attempts for better intersection
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
        break;
      }
    }
    
    if (!placed) {
      // If no intersection, try random placement with many attempts
      const maxAttempts = 100; // Increased from 50
      
      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const isAcross = Math.random() > 0.5;
        const maxRow = isAcross ? gridSize - 1 : gridSize - currentWord.length;
        const maxCol = isAcross ? gridSize - currentWord.length : gridSize - 1;
        
        // Try to place words closer to the center for better connectivity
        const rowOffset = Math.floor(gridSize / 3); // Reduced to keep words closer
        const colOffset = Math.floor(gridSize / 3);
        const row = Math.max(0, Math.min(maxRow, Math.floor(gridSize / 2) - rowOffset + Math.floor(Math.random() * (rowOffset * 2))));
        const col = Math.max(0, Math.min(maxCol, Math.floor(gridSize / 2) - colOffset + Math.floor(Math.random() * (colOffset * 2))));
        
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
  
  // Trim the grid to remove unused rows and columns
  // First, find the used boundaries of the grid
  let minRow = gridSize;
  let maxRow = 0;
  let minCol = gridSize;
  let maxCol = 0;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col].letter !== '') {
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        minCol = Math.min(minCol, col);
        maxCol = Math.max(maxCol, col);
      }
    }
  }
  
  // Add a 1-cell buffer around the used area
  minRow = Math.max(0, minRow - 1);
  maxRow = Math.min(gridSize - 1, maxRow + 1);
  minCol = Math.max(0, minCol - 1);
  maxCol = Math.min(gridSize - 1, maxCol + 1);
  
  // Create a new, smaller grid with only the used area
  const trimmedSize = {
    rows: maxRow - minRow + 1,
    cols: maxCol - minCol + 1
  };
  
  const trimmedGrid = createCrosswordGrid(Math.max(trimmedSize.rows, trimmedSize.cols));
  
  // Copy the used area to the new grid
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const newRow = row - minRow;
      const newCol = col - minCol;
      
      if (newRow < trimmedSize.rows && newCol < trimmedSize.cols) {
        trimmedGrid[newRow][newCol] = { ...grid[row][col] };
      }
    }
  }
  
  // Update clue positions to match the new grid coordinates
  const updatedClues = clues.map(clue => {
    // Find the corresponding word placement
    const placement = wordPlacements.find(p => 
      p.word === clue.answer && 
      p.isAcross === (clue.direction === 'across')
    );
    
    if (placement) {
      // Find the cell with the clue number in the old grid
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (grid[row][col].number === clue.number) {
            // Update the clue with the new coordinates
            return {
              ...clue,
              row: row - minRow,
              col: col - minCol
            };
          }
        }
      }
    }
    
    return clue;
  });
  
  // Mark only truly isolated cells as black
  // A cell is isolated if it's not part of any word
  for (let row = 0; row < trimmedSize.rows; row++) {
    for (let col = 0; col < trimmedSize.cols; col++) {
      if (trimmedGrid[row][col].letter === '') {
        // By default, consider it non-black (will be part of the puzzle)
        trimmedGrid[row][col].isBlack = false;
        
        // Check if this empty cell is part of a potential word
        let isPartOfWord = false;
        
        // Check if there's at least one letter to the left or right (part of a horizontal word)
        if ((col > 0 && trimmedGrid[row][col-1].letter !== '') || 
            (col < trimmedSize.cols-1 && trimmedGrid[row][col+1].letter !== '')) {
          isPartOfWord = true;
        }
        
        // Check if there's at least one letter above or below (part of a vertical word)
        if ((row > 0 && trimmedGrid[row-1][col].letter !== '') || 
            (row < trimmedSize.rows-1 && trimmedGrid[row+1][col].letter !== '')) {
          isPartOfWord = true;
        }
        
        // If it's not part of any word, it can be black
        if (!isPartOfWord) {
          trimmedGrid[row][col].isBlack = true;
        }
      }
    }
  }
  
  // Add numbers to the trimmed grid
  addNumbersToGrid(trimmedGrid, wordPlacements.map(p => ({
    ...p,
    row: p.row - minRow,
    col: p.col - minCol
  })));
  
  return {
    grid: trimmedGrid,
    clues: updatedClues
  };
};

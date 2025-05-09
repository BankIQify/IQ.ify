
import type { CrosswordCell } from "../types";

// Create a crossword grid
export function createCrosswordGrid(gridSize: number): CrosswordCell[][] {
  return Array(gridSize).fill(null).map(() =>
    Array(gridSize).fill(null).map(() => ({
      letter: '',
      isBlack: false,
      userInput: ''
    }))
  );
}

// Check if a word can be placed at specific coordinates
export function canPlaceWord(grid: CrosswordCell[][], word: string, row: number, col: number, isAcross: boolean): boolean {
  const gridSize = grid.length;
  
  // Check if word fits within grid boundaries
  if (isAcross) {
    if (col + word.length > gridSize) return false;
  } else {
    if (row + word.length > gridSize) return false;
  }
  
  // Check if position is valid for each letter of the word
  for (let i = 0; i < word.length; i++) {
    const r = isAcross ? row : row + i;
    const c = isAcross ? col + i : col;
    
    // Check if cell is already occupied by a different letter
    if (grid[r][c].letter !== '' && grid[r][c].letter !== word[i]) {
      return false;
    }
    
    // Check adjacent cells (but allow crossings)
    if (grid[r][c].letter === '') {
      // For horizontal words
      if (isAcross) {
        // Check left adjacent (not for first letter)
        if (i === 0 && c > 0 && grid[r][c-1].letter !== '') {
          return false;
        }
        
        // Check right adjacent (not for last letter)
        if (i === word.length-1 && c < gridSize-1 && grid[r][c+1].letter !== '') {
          return false;
        }
        
        // Don't check above/below adjacency to allow crossings
      } 
      // For vertical words
      else {
        // Check above adjacent (not for first letter)
        if (i === 0 && r > 0 && grid[r-1][c].letter !== '') {
          return false;
        }
        
        // Check below adjacent (not for last letter)
        if (i === word.length-1 && r < gridSize-1 && grid[r+1][c].letter !== '') {
          return false;
        }
        
        // Don't check left/right adjacency to allow crossings
      }
    }
  }
  
  return true;
}

// Place a word on the grid
export function placeWord(grid: CrosswordCell[][], word: string, row: number, col: number, isAcross: boolean): void {
  for (let i = 0; i < word.length; i++) {
    const r = isAcross ? row : row + i;
    const c = isAcross ? col + i : col;
    grid[r][c].letter = word[i];
  }
}

// Find intersections between words
export function findIntersection(
  placedWords: { word: string; row: number; col: number; isAcross: boolean }[], 
  newWord: string
): { word: string; row: number; col: number; isAcross: boolean } | null {
  // Shuffle the placed words to try different ones first
  const shuffledWords = [...placedWords].sort(() => Math.random() - 0.5);
  
  for (const placedWord of shuffledWords) {
    // Try multiple positions in the new word for better variety
    const newWordLetters = newWord.split('');
    for (let newWordPos = 0; newWordPos < newWordLetters.length; newWordPos++) {
      
      // Try each letter in the placed word
      for (let i = 0; i < placedWord.word.length; i++) {
        const r = placedWord.isAcross ? placedWord.row : placedWord.row + i;
        const c = placedWord.isAcross ? placedWord.col + i : placedWord.col;
        const letterInPlacedWord = placedWord.word[i];
        
        // Check if this letter in the placed word matches the current position in the new word
        if (letterInPlacedWord === newWordLetters[newWordPos]) {
          // Calculate where the new word would start if placed at this intersection
          const newWordRow = placedWord.isAcross 
            ? r - (placedWord.isAcross ? 0 : newWordPos) 
            : r - newWordPos;
          const newWordCol = placedWord.isAcross 
            ? c - (placedWord.isAcross ? newWordPos : 0) 
            : c - newWordPos;
          
          // Ensure the start position is within bounds
          if (newWordRow >= 0 && newWordCol >= 0) {
            const isAcross = !placedWord.isAcross; // Place perpendicular to existing word
            
            return { word: newWord, row: newWordRow, col: newWordCol, isAcross };
          }
        }
      }
    }
  }
  
  return null;
}

// Fill remaining empty cells with black cells, but be more selective
export function fillEmptyCellsWithBlack(grid: CrosswordCell[][]): void {
  const gridSize = grid.length;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col].letter === '') {
        // Only make a cell black if it has no filled neighbors
        // This creates a more connected puzzle with fewer black cells
        let hasFilledNeighbor = false;
        
        // Check all 8 neighboring cells
        for (let r = Math.max(0, row-1); r <= Math.min(gridSize-1, row+1); r++) {
          for (let c = Math.max(0, col-1); c <= Math.min(gridSize-1, col+1); c++) {
            if (r !== row || c !== col) { // Skip the cell itself
              if (grid[r][c].letter !== '') {
                hasFilledNeighbor = true;
                break;
              }
            }
          }
          if (hasFilledNeighbor) break;
        }
        
        // Only make it black if isolated
        grid[row][col].isBlack = !hasFilledNeighbor;
      }
    }
  }
}

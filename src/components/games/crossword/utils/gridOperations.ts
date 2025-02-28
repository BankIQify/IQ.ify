
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
    
    // Check adjacent cells (but not at crossing points)
    if (grid[r][c].letter === '') {
      // Check above
      if (r > 0 && !isAcross && grid[r-1][c].letter !== '' && i > 0) return false;
      // Check below
      if (r < gridSize-1 && !isAcross && grid[r+1][c].letter !== '' && i < word.length-1) return false;
      // Check left
      if (c > 0 && isAcross && grid[r][c-1].letter !== '' && i > 0) return false;
      // Check right
      if (c < gridSize-1 && isAcross && grid[r][c+1].letter !== '' && i < word.length-1) return false;
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
  for (const placedWord of placedWords) {
    for (let i = 0; i < placedWord.word.length; i++) {
      const r = placedWord.isAcross ? placedWord.row : placedWord.row + i;
      const c = placedWord.isAcross ? placedWord.col + i : placedWord.col;
      const letter = placedWord.word[i];
      
      const intersectionIndex = newWord.indexOf(letter);
      if (intersectionIndex !== -1) {
        const newWordRow = placedWord.isAcross ? r : r - intersectionIndex;
        const newWordCol = placedWord.isAcross ? c - intersectionIndex : c;
        const isAcross = !placedWord.isAcross;
        
        if (newWordRow >= 0 && newWordCol >= 0) {
          return { word: newWord, row: newWordRow, col: newWordCol, isAcross };
        }
      }
    }
  }
  
  return null;
}

// Fill remaining empty cells with black cells
export function fillEmptyCellsWithBlack(grid: CrosswordCell[][]): void {
  const gridSize = grid.length;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col].letter === '') {
        grid[row][col].isBlack = true;
      }
    }
  }
}

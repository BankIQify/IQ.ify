
import type { CrosswordCell, CrosswordClue } from "../types";
import { WordClue } from "./wordLists";

export interface WordPlacement {
  word: string;
  row: number;
  col: number;
  isAcross: boolean;
  clue: string;
}

// Add numbers to grid cells at the start of words
export function addNumbersToGrid(
  grid: CrosswordCell[][], 
  wordPlacements: { word: string; row: number; col: number; isAcross: boolean }[]
): void {
  let number = 1;
  const numberedCells: Set<string> = new Set();
  
  wordPlacements.sort((a, b) => {
    // Sort by row first, then by column
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  for (const placement of wordPlacements) {
    const cellKey = `${placement.row},${placement.col}`;
    if (!numberedCells.has(cellKey)) {
      grid[placement.row][placement.col].number = number;
      numberedCells.add(cellKey);
      number++;
    }
  }
}

// Create clues from word placements and numbers
export function createClues(wordPlacements: WordPlacement[]): CrosswordClue[] {
  const clues: CrosswordClue[] = [];
  const numberedCells: Map<string, number> = new Map();
  let number = 1;
  
  wordPlacements.sort((a, b) => {
    // Sort by row first, then by column
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  for (const placement of wordPlacements) {
    const cellKey = `${placement.row},${placement.col}`;
    let clueNumber = numberedCells.get(cellKey);
    
    if (clueNumber === undefined) {
      clueNumber = number;
      numberedCells.set(cellKey, number);
      number++;
    }
    
    clues.push({
      number: clueNumber,
      clue: placement.clue,
      answer: placement.word,
      direction: placement.isAcross ? 'across' : 'down'
    });
  }
  
  return clues;
}

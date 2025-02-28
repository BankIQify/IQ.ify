
import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordCell, CrosswordClue, CrosswordPuzzleData } from "../types";

// Word lists for different themes
const wordLists: Record<string, { word: string; clue: string }[]> = {
  general: [
    { word: "APPLE", clue: "Red or green fruit" },
    { word: "BOOK", clue: "Reading material with pages" },
    { word: "CAT", clue: "Small feline pet" },
    { word: "DOG", clue: "Man's best friend" },
    { word: "EARTH", clue: "Our planet" },
    { word: "FISH", clue: "Aquatic creature with fins" },
    { word: "GAME", clue: "Activity played for fun" },
    { word: "HOUSE", clue: "Place to live" },
    { word: "ICE", clue: "Frozen water" },
    { word: "JUMP", clue: "To leap or spring upward" },
    { word: "KEY", clue: "Used to open a lock" },
    { word: "LAMP", clue: "Light source" },
    { word: "MUSIC", clue: "Combination of sounds in harmony" },
    { word: "NIGHT", clue: "Opposite of day" },
    { word: "OCEAN", clue: "Large body of saltwater" },
    { word: "PENCIL", clue: "Writing tool with lead" },
    { word: "QUEEN", clue: "Female monarch" },
    { word: "RIVER", clue: "Natural flowing watercourse" },
    { word: "SUN", clue: "Star at the center of our solar system" },
    { word: "TABLE", clue: "Furniture with a flat top and legs" },
    { word: "UMBRELLA", clue: "Protection from rain" },
    { word: "WINDOW", clue: "Opening in a wall to let in light" },
    { word: "XYLOPHONE", clue: "Musical instrument with wooden bars" },
    { word: "YELLOW", clue: "Color of a lemon" },
    { word: "ZOO", clue: "Collection of animals for public viewing" }
  ]
};

// Helper function to get difficulty configuration
function getDifficultyConfig(difficulty: Difficulty) {
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

// Filter words based on difficulty
function filterWordsByDifficulty(words: { word: string; clue: string }[], minLength: number, maxLength: number) {
  return words.filter(w => w.word.length >= minLength && w.word.length <= maxLength);
}

// Select random words from a filtered list
function selectRandomWords(filteredWords: { word: string; clue: string }[], count: number) {
  const selectedWords: { word: string; clue: string }[] = [];
  const maxAttempts = filteredWords.length;
  let attempts = 0;
  
  while (selectedWords.length < count && attempts < maxAttempts) {
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const word = filteredWords[randomIndex];
    
    // Check if word has already been selected
    if (!selectedWords.some(w => w.word === word.word)) {
      selectedWords.push(word);
    }
    
    attempts++;
  }
  
  return selectedWords;
}

// Create a crossword grid
function createCrosswordGrid(gridSize: number): CrosswordCell[][] {
  return Array(gridSize).fill(null).map(() =>
    Array(gridSize).fill(null).map(() => ({
      letter: '',
      isBlack: false,
      userInput: ''
    }))
  );
}

// Check if a word can be placed at specific coordinates
function canPlaceWord(grid: CrosswordCell[][], word: string, row: number, col: number, isAcross: boolean): boolean {
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
function placeWord(grid: CrosswordCell[][], word: string, row: number, col: number, isAcross: boolean): void {
  for (let i = 0; i < word.length; i++) {
    const r = isAcross ? row : row + i;
    const c = isAcross ? col + i : col;
    grid[r][c].letter = word[i];
  }
}

// Find intersections between words
function findIntersection(placedWords: { word: string; row: number; col: number; isAcross: boolean }[], newWord: string): { word: string; row: number; col: number; isAcross: boolean } | null {
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

// Add numbers to grid cells at the start of words
function addNumbersToGrid(grid: CrosswordCell[][], wordPlacements: { word: string; row: number; col: number; isAcross: boolean }[]): void {
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
function createClues(wordPlacements: { word: string; row: number; col: number; isAcross: boolean; clue: string }[]): CrosswordClue[] {
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

// Fill remaining empty cells with black cells
function fillEmptyCellsWithBlack(grid: CrosswordCell[][]): void {
  const gridSize = grid.length;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col].letter === '') {
        grid[row][col].isBlack = true;
      }
    }
  }
}

// Main function to generate a crossword puzzle
export const generateDummyCrossword = (difficulty: Difficulty): CrosswordPuzzleData => {
  const config = getDifficultyConfig(difficulty);
  const gridSize = config.gridSize;
  
  // Filter words based on difficulty
  const filteredWords = filterWordsByDifficulty(wordLists.general, config.minWordLength, config.maxWordLength);
  
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
  const wordPlacements: { word: string; row: number; col: number; isAcross: boolean; clue: string }[] = [
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

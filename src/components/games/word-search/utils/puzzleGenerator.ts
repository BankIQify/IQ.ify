
import type { Difficulty } from "@/components/games/GameSettings";
import type { GridDimensions, WordToFind } from "../types";

export const generateDynamicPuzzle = (difficulty: Difficulty): {
  grid: string[][];
  words: WordToFind[];
  gridDimensions: GridDimensions;
} => {
  // Define difficulty-specific parameters
  let minWordLength: number;
  let maxWordLength: number;
  let minWordCount: number;
  let maxWordCount: number;
  let blankPercentage: number;
  let rows: number;
  let cols: number;

  switch (difficulty) {
    case "easy":
      minWordLength = 3;
      maxWordLength = 5;
      minWordCount = 5;
      maxWordCount = 8;
      blankPercentage = 0.05; // 5% of cells will be blank
      rows = 8;
      cols = 10; // Non-square grid
      break;
    case "medium":
      minWordLength = 4;
      maxWordLength = 6;
      minWordCount = 6;
      maxWordCount = 10;
      blankPercentage = 0.1; // 10% of cells will be blank
      rows = 10;
      cols = 12; // Non-square grid
      break;
    case "hard":
      minWordLength = 5;
      maxWordLength = 10;
      minWordCount = 8;
      maxWordCount = 15;
      blankPercentage = 0.15; // 15% of cells will be blank
      rows = 12;
      cols = 14; // Non-square grid
      break;
    default:
      minWordLength = 3;
      maxWordLength = 5;
      minWordCount = 5;
      maxWordCount = 8;
      blankPercentage = 0.05;
      rows = 8;
      cols = 10;
  }

  // Sample words based on difficulty
  const sampleWords = [
    // 3-letter words
    "CAT", "DOG", "BAT", "RUN", "SUN", "FUN", "PEN", "HAT", "MAP", "BUG",
    // 4-letter words
    "BEAR", "FISH", "BIRD", "DUCK", "FROG", "LION", "WOLF", "GOAT", "DEER", "HAWK",
    // 5-letter words
    "TIGER", "EAGLE", "SNAKE", "SHARK", "WHALE", "ZEBRA", "PANDA", "KOALA", "MOUSE", "CAMEL",
    // 6-letter words
    "MONKEY", "BEAVER", "JAGUAR", "LIZARD", "TOUCAN", "TURTLE", "RABBIT", "COUGAR", "WALRUS", "PUFFIN",
    // 7+ letter words
    "ELEPHANT", "ALLIGATOR", "CROCODILE", "BUTTERFLY", "FLAMINGO", "KANGAROO", "SQUIRREL", "PENGUIN", "HEDGEHOG", "CHIMPANZEE",
    "HIPPOPOTAMUS", "RHINOCEROS", "ORANGUTAN"
  ];

  // Filter words based on length requirements
  const eligibleWords = sampleWords.filter(word => 
    word.length >= minWordLength && word.length <= maxWordLength
  );

  // Randomly select number of words to include
  const wordCount = Math.floor(Math.random() * (maxWordCount - minWordCount + 1)) + minWordCount;
  
  // Randomly pick words
  const shuffledWords = [...eligibleWords].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, wordCount);
  
  // Create empty grid with dimensions
  const dynamicGrid: string[][] = Array(rows).fill(null).map(() => 
    Array(cols).fill('')
  );
  
  // Place words in the grid
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // diagonal up-left
    [1, -1],  // diagonal down-left
    [-1, 1]   // diagonal up-right
  ];
  
  // Function to check if a word can be placed
  const canPlaceWord = (word: string, row: number, col: number, dRow: number, dCol: number): boolean => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      
      // Check if out of bounds
      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
        return false;
      }
      
      // Check if cell is occupied with a different letter
      if (dynamicGrid[newRow][newCol] !== '' && dynamicGrid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };
  
  // Place words in the grid
  selectedWords.forEach(word => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Pick a random direction
      const dirIndex = Math.floor(Math.random() * directions.length);
      const [dRow, dCol] = directions[dirIndex];
      
      // Pick a random starting position
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      if (canPlaceWord(word, row, col, dRow, dCol)) {
        // Place the word
        for (let i = 0; i < word.length; i++) {
          const newRow = row + i * dRow;
          const newCol = col + i * dCol;
          dynamicGrid[newRow][newCol] = word[i];
        }
        placed = true;
      }
    }
    
    // If couldn't place the word after max attempts, skip it
    if (!placed) {
      console.log(`Couldn't place word: ${word}`);
    }
  });
  
  // Add blank spaces (represented by null)
  const totalCells = rows * cols;
  const numBlankCells = Math.floor(totalCells * blankPercentage);
  
  let blanksAdded = 0;
  while (blanksAdded < numBlankCells) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // Only make cells blank if they don't contain a word letter
    if (dynamicGrid[row][col] === '') {
      dynamicGrid[row][col] = ' '; // Using space to represent blank
      blanksAdded++;
    }
  }
  
  // Fill remaining empty cells with random letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (dynamicGrid[row][col] === '') {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        dynamicGrid[row][col] = randomLetter;
      }
    }
  }
  
  return {
    grid: dynamicGrid,
    words: selectedWords.map(word => ({ word, found: false })),
    gridDimensions: { rows, cols }
  };
};

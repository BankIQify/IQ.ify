import type { Difficulty } from "@/components/games/GameSettings";
import type { GridDimensions } from "../types";

const DIFFICULTY_SETTINGS = {
  easy: {
    gridSize: { rows: 8, cols: 8 },
    maxWords: 8,
    wordLength: { min: 3, max: 5 },
  },
  moderate: {
    gridSize: { rows: 10, cols: 10 },
    maxWords: 10,
    wordLength: { min: 4, max: 6 },
  },
  challenging: {
    gridSize: { rows: 12, cols: 12 },
    maxWords: 12,
    wordLength: { min: 5, max: 12 },
  },
};

const WORD_LISTS = {
  animals: [
    'CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'TIGER', 'BEAR', 'WOLF', 'DEER', 'FROG',
    'EAGLE', 'SNAKE', 'HORSE', 'ZEBRA', 'PANDA', 'KOALA', 'MONKEY', 'GIRAFFE', 'ELEPHANT', 'PENGUIN'
  ],
  sports: [
    'GOLF', 'SWIM', 'JUMP', 'RACE', 'SURF', 'RUGBY', 'TENNIS', 'SOCCER', 'HOCKEY', 'BOXING',
    'CRICKET', 'CYCLING', 'RUNNING', 'SKATING', 'BASEBALL', 'FOOTBALL', 'CLIMBING', 'VOLLEYBALL'
  ],
  space: [
    'STAR', 'MOON', 'MARS', 'SUN', 'EARTH', 'VENUS', 'SATURN', 'METEOR', 'GALAXY', 'COMET',
    'JUPITER', 'NEPTUNE', 'ASTEROID', 'UNIVERSE', 'SPACESHIP', 'TELESCOPE', 'SATELLITE'
  ],
  nature: [
    'TREE', 'LEAF', 'ROSE', 'RAIN', 'SNOW', 'CLOUD', 'RIVER', 'BEACH', 'FLOWER', 'FOREST',
    'MOUNTAIN', 'VOLCANO', 'RAINBOW', 'WATERFALL', 'SUNSHINE', 'BLOSSOM', 'GARDEN'
  ],
  music: [
    'JAZZ', 'ROCK', 'BEAT', 'SONG', 'BAND', 'PIANO', 'GUITAR', 'VIOLIN', 'DRUMS', 'FLUTE',
    'TRUMPET', 'CONCERT', 'MELODY', 'RHYTHM', 'ORCHESTRA', 'SYMPHONY', 'HARMONY'
  ],
  technology: [
    'WIFI', 'CHIP', 'CODE', 'DATA', 'PHONE', 'ROBOT', 'LAPTOP', 'TABLET', 'CAMERA', 'SCREEN',
    'COMPUTER', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'KEYBOARD', 'PROCESSOR', 'NETWORK'
  ],
  ocean: [
    'WAVE', 'REEF', 'SEAL', 'CRAB', 'SHARK', 'WHALE', 'CORAL', 'SQUID', 'SHELL', 'BEACH',
    'DOLPHIN', 'OCTOPUS', 'SEAWEED', 'STARFISH', 'JELLYFISH', 'SEAHORSE', 'PLANKTON'
  ],
  weather: [
    'RAIN', 'SNOW', 'WIND', 'HAIL', 'STORM', 'SUNNY', 'CLOUD', 'FROST', 'FOGGY', 'THUNDER',
    'RAINBOW', 'TORNADO', 'BLIZZARD', 'HURRICANE', 'LIGHTNING', 'SUNSHINE'
  ],
  countries: [
    'USA', 'UK', 'SPAIN', 'ITALY', 'CHINA', 'JAPAN', 'INDIA', 'BRAZIL', 'EGYPT', 'FRANCE',
    'CANADA', 'MEXICO', 'RUSSIA', 'GERMANY', 'TURKEY', 'GREECE', 'PORTUGAL', 'THAILAND'
  ],
  food: [
    'PIE', 'HAM', 'RICE', 'FISH', 'MEAT', 'BREAD', 'PASTA', 'PIZZA', 'SALAD', 'SOUP',
    'BURGER', 'SUSHI', 'TACO', 'CURRY', 'NOODLE', 'WAFFLE', 'PANCAKE', 'SANDWICH'
  ],
  colors: [
    'RED', 'BLUE', 'PINK', 'GOLD', 'GREY', 'BLACK', 'WHITE', 'GREEN', 'BROWN', 'PURPLE',
    'YELLOW', 'ORANGE', 'SILVER', 'BRONZE', 'CRIMSON', 'MAGENTA', 'INDIGO'
  ],
  jobs: [
    'CHEF', 'COOK', 'MAID', 'PILOT', 'NURSE', 'ACTOR', 'JUDGE', 'ARTIST', 'DOCTOR', 'LAWYER',
    'TEACHER', 'DENTIST', 'ENGINEER', 'SCIENTIST', 'ARCHITECT', 'DESIGNER', 'MECHANIC'
  ],
  emotions: [
    'HAPPY', 'GLAD', 'CALM', 'LOVE', 'PEACE', 'ANGRY', 'BRAVE', 'PROUD', 'QUIET', 'SCARED',
    'EXCITED', 'NERVOUS', 'CHEERFUL', 'GRATEFUL', 'HOPEFUL', 'PEACEFUL'
  ],
  fantasy: [
    'WAND', 'HERO', 'MYTH', 'TROLL', 'FAIRY', 'MAGIC', 'WITCH', 'DWARF', 'GIANT', 'DRAGON',
    'WIZARD', 'UNICORN', 'MERMAID', 'PHOENIX', 'PEGASUS', 'GOBLIN', 'VAMPIRE'
  ],
  science: [
    'ATOM', 'CELL', 'GENE', 'HEAT', 'WAVE', 'FORCE', 'LIGHT', 'SOUND', 'SPACE', 'ENERGY',
    'GRAVITY', 'MAGNET', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'MOLECULE', 'ELECTRON'
  ]
};

const DIRECTIONS = [
  [0, 1],   // right
  [1, 0],   // down
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal up-right
];

const generateEmptyGrid = (rows: number, cols: number): string[][] => {
  return Array(rows).fill(null).map(() => Array(cols).fill(''));
};

const canPlaceWord = (
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  dirRow: number,
  dirCol: number
): boolean => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dirRow;
    const col = startCol + i * dirCol;

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return false;
    }

    if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
      return false;
    }
  }

  return true;
};

const placeWord = (
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  dirRow: number,
  dirCol: number
): void => {
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dirRow;
    const col = startCol + i * dirCol;
    grid[row][col] = word[i];
  }
};

const fillEmptyCells = (grid: string[][]): void => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
};

export const generateWordSearchPuzzle = (difficulty: Difficulty, theme: string = 'animals') => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const dimensions: GridDimensions = settings.gridSize;
  const grid = generateEmptyGrid(dimensions.rows, dimensions.cols);
  
  // Select random words based on difficulty and theme
  const allWords = WORD_LISTS[theme as keyof typeof WORD_LISTS] || WORD_LISTS.animals;
  const selectedWords = allWords
    .filter(word => 
      word.length >= settings.wordLength.min && 
      word.length <= settings.wordLength.max
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, settings.maxWords);

  // Place each word
  for (const word of selectedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startRow = Math.floor(Math.random() * dimensions.rows);
      const startCol = Math.floor(Math.random() * dimensions.cols);

      if (canPlaceWord(grid, word, startRow, startCol, direction[0], direction[1])) {
        placeWord(grid, word, startRow, startCol, direction[0], direction[1]);
        placed = true;
      }

      attempts++;
    }
  }

  // Fill remaining empty cells
  fillEmptyCells(grid);

  return {
    grid,
    words: selectedWords,
    dimensions,
  };
};

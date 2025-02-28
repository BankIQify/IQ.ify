
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";
import type { Json } from "@/integrations/supabase/types";
import { useGameState } from "@/hooks/use-game-state";
import { Trophy, Check, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WordToFind {
  word: string;
  found: boolean;
}

interface WordSearchPuzzleData {
  grid: string[][];
  words: string[];
}

interface WordSearchPuzzle {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: WordSearchPuzzleData;
  theme?: {
    name: string;
  };
}

interface RawPuzzleData {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: Json;
  game_themes: {
    name: string;
  };
}

export const WordSearchGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<WordToFind[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [puzzles, setPuzzles] = useState<WordSearchPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gridDimensions, setGridDimensions] = useState({ rows: 8, cols: 8 });
  
  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
  });

  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      fetchPuzzlesByTheme(selectedTheme, difficulty);
    }
  }, [selectedTheme, difficulty]);

  useEffect(() => {
    if (puzzles.length > 0 && !currentPuzzle) {
      // Select a random puzzle from available ones
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      setCurrentPuzzle(puzzles[randomIndex]);
    }
  }, [puzzles, currentPuzzle]);

  useEffect(() => {
    if (currentPuzzle) {
      initializeGameFromPuzzle(currentPuzzle);
    } else {
      // Fallback to dynamically generated puzzle based on difficulty
      generateDynamicPuzzle(difficulty);
    }
  }, [currentPuzzle, difficulty]);

  useEffect(() => {
    // Check if game is complete
    if (words.length > 0 && words.every(w => w.found)) {
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  }, [words]);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from("game_themes")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setThemes(data || []);
      
      if (data && data.length > 0) {
        setSelectedTheme(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzle themes. Using generated puzzles.",
      });
      generateDynamicPuzzle(difficulty);
    } finally {
      setLoading(false);
    }
  };

  const fetchPuzzlesByTheme = async (themeId: string, difficulty: Difficulty) => {
    try {
      const { data, error } = await supabase
        .from("game_puzzles")
        .select("id, theme_id, difficulty, puzzle_data, game_themes(name)")
        .eq("theme_id", themeId)
        .eq("difficulty", difficulty)
        .eq("game_type", "word_search");

      if (error) throw error;
      
      // Transform the data to match our expected format
      const formattedPuzzles: WordSearchPuzzle[] = (data || []).map((raw: RawPuzzleData) => {
        // Safely parse the puzzle_data which is Json type from database
        const puzzleData = typeof raw.puzzle_data === 'string' 
          ? JSON.parse(raw.puzzle_data) 
          : raw.puzzle_data;
          
        return {
          id: raw.id,
          theme_id: raw.theme_id,
          difficulty: raw.difficulty,
          puzzle_data: puzzleData as WordSearchPuzzleData,
          theme: {
            name: raw.game_themes.name
          }
        };
      });
      
      setPuzzles(formattedPuzzles);
      
      // Reset current puzzle when theme or difficulty changes
      setCurrentPuzzle(null);
      
      // If no puzzles found, generate a dynamic one
      if (formattedPuzzles.length === 0) {
        generateDynamicPuzzle(difficulty);
      }
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzles. Using generated puzzles.",
      });
      generateDynamicPuzzle(difficulty);
    }
  };

  const initializeGameFromPuzzle = (puzzle: WordSearchPuzzle) => {
    const puzzleGrid = puzzle.puzzle_data.grid;
    const puzzleWords = puzzle.puzzle_data.words.map(word => ({
      word,
      found: false
    }));

    setGrid(puzzleGrid);
    setWords(puzzleWords);
    setSelectedCells([]);
    setIsGameComplete(false);
    
    // Set grid dimensions based on the puzzle grid
    setGridDimensions({
      rows: puzzleGrid.length,
      cols: puzzleGrid[0].length
    });
    
    gameState.startGame();
  };

  const generateDynamicPuzzle = (difficulty: Difficulty) => {
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
    
    // Set grid dimensions state
    setGridDimensions({ rows, cols });
    
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
    
    // Set the grid and words states
    setGrid(dynamicGrid);
    setWords(selectedWords.map(word => ({ word, found: false })));
    setSelectedCells([]);
    setIsGameComplete(false);
    gameState.startGame();
  };

  const handleCellClick = (row: number, col: number) => {
    // Skip blank cells
    if (grid[row][col] === ' ') return;
    
    if (!gameState.isActive) {
      gameState.startGame();
    }
    
    setSelectedCells((prev) => {
      if (prev.some(([r, c]) => r === row && c === col)) {
        return prev.filter(([r, c]) => !(r === row && c === col));
      }
      return [...prev, [row, col]];
    });
  };

  const checkSelection = () => {
    if (selectedCells.length < 2) return;

    const selectedWord = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');

    const foundWord = words.find(
      ({ word, found }) => !found && (word === selectedWord || word === selectedWord.split('').reverse().join(''))
    );

    if (foundWord) {
      setWords(words.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      ));
      
      gameState.updateScore(foundWord.word.length * 5);
      
      toast({
        title: "Word Found!",
        description: `You found "${foundWord.word}"!`,
        variant: "default",
      });
    }

    setSelectedCells([]);
    
    // Check if all words are found
    const remainingWords = words.filter(w => !w.found).length - (foundWord ? 1 : 0);
    if (remainingWords === 0) {
      toast({
        title: "Congratulations!",
        description: "You found all the words!",
        variant: "default",
      });
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleNewPuzzle = () => {
    if (puzzles.length > 1) {
      // Select a different puzzle
      let newPuzzle;
      do {
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        newPuzzle = puzzles[randomIndex];
      } while (newPuzzle.id === currentPuzzle?.id);
      
      setCurrentPuzzle(newPuzzle);
    } else {
      // Generate a new dynamic puzzle
      generateDynamicPuzzle(difficulty);
    }
    
    gameState.resetGame();
  };

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  const wordsFoundPercentage = (words.filter(w => w.found).length / words.length) * 100;

  // Function to determine cell color based on various conditions
  const getCellColor = (rowIndex: number, colIndex: number) => {
    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
    const isBlank = grid[rowIndex][colIndex] === ' ';
    
    if (isBlank) {
      return "bg-slate-200 cursor-default";
    }
    
    if (isSelected) {
      return "bg-pastel-purple/70 text-white";
    }
    
    // Create a checkered pattern for non-blank cells
    return (rowIndex + colIndex) % 2 === 0 
      ? "bg-white hover:bg-pastel-purple/10 cursor-pointer" 
      : "bg-slate-50 hover:bg-pastel-purple/10 cursor-pointer";
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pastel-blue/20 to-pastel-green/20 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-48">
              <Select value={selectedTheme} onValueChange={handleSelectTheme}>
                <SelectTrigger className="border-none bg-white/50 shadow-sm">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleNewPuzzle} 
              variant="outline"
              className="bg-white shadow-sm border-none hover:bg-white/90"
            >
              New Puzzle
            </Button>
          </div>
          
          {gameState.isActive && (
            <div className="flex gap-2 items-center">
              <Clock className="h-4 w-4 text-primary" />
              <span>{gameState.timer}s</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Words found: {words.filter(w => w.found).length} of {words.length}</span>
            <span>Score: {gameState.score}</span>
          </div>
          <Progress value={wordsFoundPercentage} className="h-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <div 
                className={`grid gap-0 bg-white`} 
                style={{ 
                  gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`
                }}
              >
                {grid.map((row, rowIndex) => (
                  row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "aspect-square flex items-center justify-center text-lg font-medium border border-slate-100",
                        "transition-all duration-200 transform hover:scale-105",
                        getCellColor(rowIndex, colIndex)
                      )}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {letter !== ' ' ? letter : ''}
                    </div>
                  ))
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-pastel-blue/30 to-pastel-purple/30 border-b">
              <h3 className="text-xl font-semibold">Words to Find</h3>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-6">
                {words.map(({ word, found }) => (
                  <div
                    key={word}
                    className={cn(
                      "px-4 py-2 rounded-full border transition-all duration-300",
                      found 
                        ? "bg-pastel-green/30 border-pastel-green text-green-700 line-through" 
                        : "border-slate-200 hover:border-pastel-purple/50 hover:bg-pastel-purple/5"
                    )}
                  >
                    {word}
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={checkSelection} 
                className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue text-white hover:opacity-90"
                disabled={selectedCells.length < 2}
              >
                <Check className="h-4 w-4 mr-2" />
                Check Selection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isGameComplete && (
        <div className="animate-scale-in fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-6">
                You found all {words.length} words and scored {gameState.score} points!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-pastel-blue/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Time Taken</p>
                  <p className="text-xl font-medium">{300 - gameState.timer}s</p>
                </div>
                <div className="bg-pastel-purple/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-xl font-medium">{gameState.score}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleNewPuzzle} 
                  className="flex-1 bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
                >
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

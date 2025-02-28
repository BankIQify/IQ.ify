
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";
import type { Json } from "@/integrations/supabase/types";
import { useGameState } from "@/hooks/use-game-state";

interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
  userInput: string;
}

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

interface CrosswordPuzzleData {
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
}

interface CrosswordPuzzle {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: CrosswordPuzzleData;
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

export const CrosswordGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isAcross, setIsAcross] = useState(true);
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [puzzles, setPuzzles] = useState<CrosswordPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  
  const { updateScore, startGame, pauseGame, isActive } = useGameState({
    gameType: 'crossword',
    initialTimer: 600, // 10 minutes
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
      // Fallback to dummy data if no puzzles are available
      initializeDummyGame();
    }
  }, [currentPuzzle]);

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
        description: "Failed to load puzzle themes. Using default puzzles.",
      });
      initializeDummyGame();
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyConfig = () => {
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
  };

  const fetchPuzzlesByTheme = async (themeId: string, difficulty: Difficulty) => {
    try {
      const { data, error } = await supabase
        .from("game_puzzles")
        .select("id, theme_id, difficulty, puzzle_data, game_themes(name)")
        .eq("theme_id", themeId)
        .eq("difficulty", difficulty)
        .eq("game_type", "crossword");

      if (error) throw error;
      
      // Transform the data to match our expected format
      const formattedPuzzles: CrosswordPuzzle[] = (data || []).map((raw: RawPuzzleData) => {
        // Safely parse the puzzle_data which is Json type from database
        const puzzleData = typeof raw.puzzle_data === 'string' 
          ? JSON.parse(raw.puzzle_data) 
          : raw.puzzle_data;
          
        return {
          id: raw.id,
          theme_id: raw.theme_id,
          difficulty: raw.difficulty,
          puzzle_data: puzzleData as CrosswordPuzzleData,
          theme: {
            name: raw.game_themes.name
          }
        };
      });
      
      // Filter puzzles based on word count and word length according to difficulty
      const { minWordLength, maxWordLength, minWordCount, maxWordCount } = getDifficultyConfig();
      
      const filteredPuzzles = formattedPuzzles.filter(puzzle => {
        if (!puzzle.puzzle_data || !puzzle.puzzle_data.clues) return false;
        
        const wordCount = puzzle.puzzle_data.clues.length;
        const wordsInRange = puzzle.puzzle_data.clues.filter(clue => {
          const wordLength = clue.answer.length;
          return wordLength >= minWordLength && wordLength <= maxWordLength;
        }).length;
        
        // Check if word count is within range and most words match length requirements
        return wordCount >= minWordCount && 
               wordCount <= maxWordCount && 
               wordsInRange >= wordCount * 0.7; // At least 70% of words should match length criteria
      });
      
      // If we have filtered puzzles, use them; otherwise fallback to all puzzles
      setPuzzles(filteredPuzzles.length > 0 ? filteredPuzzles : formattedPuzzles);
      
      // Reset current puzzle when theme or difficulty changes
      setCurrentPuzzle(null);
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzles. Using default puzzles.",
      });
      initializeDummyGame();
    }
  };

  const initializeGameFromPuzzle = (puzzle: CrosswordPuzzle) => {
    setGrid(puzzle.puzzle_data.grid);
    setClues(puzzle.puzzle_data.clues);
    setSelectedCell(null);
    setCorrectAnswers(0);
    setTotalAnswers(puzzle.puzzle_data.clues.length);
    
    // Start the game timer when puzzle is loaded
    if (!isActive) {
      startGame();
    }
  };

  const initializeDummyGame = () => {
    // Create dummy game based on difficulty
    const { minWordLength, maxWordLength, minWordCount } = getDifficultyConfig();
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

    setGrid(exampleGrid);
    setClues(exampleClues);
    setSelectedCell(null);
    setCorrectAnswers(0);
    setTotalAnswers(exampleClues.length);
    
    // Start the game timer
    if (!isActive) {
      startGame();
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;

    if (selectedCell?.[0] === row && selectedCell?.[1] === col) {
      setIsAcross(!isAcross);
    } else {
      setSelectedCell([row, col]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, row: number, col: number) => {
    if (event.key === 'Backspace') {
      updateCell(row, col, '');
      moveToNextCell(row, col, true);
    } else if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
      updateCell(row, col, event.key.toUpperCase());
      moveToNextCell(row, col);
    }
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    const prevValue = newGrid[row][col].userInput;
    newGrid[row][col] = { ...newGrid[row][col], userInput: value };
    setGrid(newGrid);
    
    // Check if the cell is now correct and it was previously incorrect or empty
    const isCorrect = value !== '' && value === newGrid[row][col].letter;
    const wasPreviouslyCorrect = prevValue !== '' && prevValue === newGrid[row][col].letter;
    
    if (isCorrect && !wasPreviouslyCorrect) {
      // Increment score
      updateScore(1);
      setCorrectAnswers(prev => prev + 1);
      
      // Check if this completes a word
      checkWordCompletion(row, col);
    } else if (!isCorrect && wasPreviouslyCorrect) {
      // Decrement score if cell was correct and now is incorrect
      updateScore(-1);
      setCorrectAnswers(prev => prev - 1);
    }
    
    // Check if puzzle is complete
    checkPuzzleCompletion();
  };

  const checkWordCompletion = (row: number, col: number) => {
    // This would be a more complex function to check if an entire word is now complete
    // For simplicity, we're just checking cell by cell
  };

  const moveToNextCell = (row: number, col: number, isBackspace = false) => {
    if (isAcross) {
      const nextCol = isBackspace ? col - 1 : col + 1;
      if (nextCol >= 0 && nextCol < grid[0].length && !grid[row][nextCol].isBlack) {
        setSelectedCell([row, nextCol]);
      }
    } else {
      const nextRow = isBackspace ? row - 1 : row + 1;
      if (nextRow >= 0 && nextRow < grid.length && !grid[nextRow][col].isBlack) {
        setSelectedCell([nextRow, col]);
      }
    }
  };

  const checkPuzzleCompletion = () => {
    // Check if all cells are filled correctly
    let isComplete = true;
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        if (!cell.isBlack && (cell.userInput === '' || cell.userInput !== cell.letter)) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }
    
    if (isComplete) {
      // Pause the game and show completion message
      pauseGame();
      
      toast({
        title: "Congratulations!",
        description: "You've solved the crossword puzzle!",
        variant: "default",
      });
    }
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleNewPuzzle = () => {
    if (puzzles.length <= 1) return;
    
    // Select a different puzzle
    let newPuzzle;
    do {
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      newPuzzle = puzzles[randomIndex];
    } while (newPuzzle.id === currentPuzzle?.id);
    
    setCurrentPuzzle(newPuzzle);
  };

  const handleHint = () => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    const cell = grid[row][col];
    
    if (cell.isBlack || cell.userInput === cell.letter) return;
    
    updateCell(row, col, cell.letter);
    
    toast({
      title: "Hint Used",
      description: `Letter "${cell.letter}" has been revealed.`,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-48">
            <Select value={selectedTheme} onValueChange={handleSelectTheme}>
              <SelectTrigger>
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
            disabled={puzzles.length <= 1}
          >
            New Puzzle
          </Button>
          
          <Button 
            onClick={handleHint} 
            variant="outline"
            disabled={!selectedCell}
          >
            Get Hint
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="font-medium">
            {currentPuzzle?.theme?.name && (
              <span>Theme: <span className="text-primary">{currentPuzzle.theme.name}</span></span>
            )}
          </div>
          
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {correctAnswers}/{totalAnswers} Filled
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardContent className="p-4">
              <div className={`grid grid-cols-${grid[0]?.length || 5} gap-0.5 bg-gray-200 p-0.5`}>
                {grid.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square relative ${
                        cell.isBlack ? 'bg-black' : 'bg-white'
                      } ${
                        selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                          ? 'bg-blue-100'
                          : ''
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell.number && (
                        <span className="absolute top-0 left-0 text-xs pl-0.5">
                          {cell.number}
                        </span>
                      )}
                      {!cell.isBlack && (
                        <input
                          type="text"
                          maxLength={1}
                          value={cell.userInput}
                          className="w-full h-full text-center text-lg font-medium bg-transparent focus:outline-none uppercase"
                          onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
                          readOnly
                        />
                      )}
                    </div>
                  ))
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Across</h3>
                  <div className="space-y-2">
                    {clues
                      .filter((clue) => clue.direction === 'across')
                      .map((clue) => (
                        <div key={`across-${clue.number}`}>
                          {clue.number}. {clue.clue}
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Down</h3>
                  <div className="space-y-2">
                    {clues
                      .filter((clue) => clue.direction === 'down')
                      .map((clue) => (
                        <div key={`down-${clue.number}`}>
                          {clue.number}. {clue.clue}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

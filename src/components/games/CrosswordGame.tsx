
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";

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

interface CrosswordPuzzle {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: {
    grid: CrosswordCell[][];
    clues: CrosswordClue[];
  };
  theme?: {
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
      const formattedPuzzles = data?.map(puzzle => ({
        ...puzzle,
        theme: puzzle.game_themes
      })) || [];
      
      setPuzzles(formattedPuzzles);
      
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
  };

  const initializeDummyGame = () => {
    // Example 5x5 crossword
    const exampleGrid: CrosswordCell[][] = Array(5).fill(null).map(() =>
      Array(5).fill(null).map(() => ({
        letter: '',
        isBlack: false,
        userInput: ''
      }))
    );

    // Add some black cells and numbers
    exampleGrid[0][2].isBlack = true;
    exampleGrid[2][2].isBlack = true;
    exampleGrid[4][2].isBlack = true;

    // Add numbers to cells
    exampleGrid[0][0].number = 1;
    exampleGrid[0][3].number = 2;
    exampleGrid[1][0].number = 3;
    exampleGrid[3][0].number = 4;

    const exampleClues: CrosswordClue[] = [
      { number: 1, clue: "Feline friend", answer: "CAT", direction: "across" },
      { number: 2, clue: "Color of the sky", answer: "BLUE", direction: "across" },
      { number: 1, clue: "Writing tool", answer: "PEN", direction: "down" },
      { number: 3, clue: "Ocean", answer: "SEA", direction: "down" }
    ];

    setGrid(exampleGrid);
    setClues(exampleClues);
    setSelectedCell(null);
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
    newGrid[row][col] = { ...newGrid[row][col], userInput: value };
    setGrid(newGrid);
    
    // Check if puzzle is solved
    checkPuzzleCompletion();
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
        
        <div className="font-medium">
          {currentPuzzle?.theme?.name && (
            <span>Theme: <span className="text-primary">{currentPuzzle.theme.name}</span></span>
          )}
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


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
      // Fallback to dummy data if no puzzles are available
      initializeDummyGame();
    }
  }, [currentPuzzle]);

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
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzles. Using default puzzles.",
      });
      initializeDummyGame();
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
    gameState.startGame();
  };

  const initializeDummyGame = () => {
    // For now, using a simple example grid and words
    const exampleGrid = [
      ['C', 'A', 'T', 'D', 'O', 'G', 'H', 'I'],
      ['H', 'P', 'E', 'N', 'M', 'L', 'K', 'J'],
      ['I', 'Q', 'R', 'S', 'B', 'I', 'R', 'D'],
      ['C', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C'],
      ['K', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['E', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      ['N', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
      ['Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F']
    ];

    const exampleWords = [
      { word: 'CAT', found: false },
      { word: 'DOG', found: false },
      { word: 'BIRD', found: false },
      { word: 'CHICKEN', found: false }
    ];

    setGrid(exampleGrid);
    setWords(exampleWords);
    setSelectedCells([]);
    setIsGameComplete(false);
    gameState.startGame();
  };

  const handleCellClick = (row: number, col: number) => {
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
    if (puzzles.length <= 1) return;
    
    // Select a different puzzle
    let newPuzzle;
    do {
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      newPuzzle = puzzles[randomIndex];
    } while (newPuzzle.id === currentPuzzle?.id);
    
    setCurrentPuzzle(newPuzzle);
    gameState.resetGame();
  };

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  const wordsFoundPercentage = (words.filter(w => w.found).length / words.length) * 100;

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
              disabled={puzzles.length <= 1}
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
              <div className="grid grid-cols-8 gap-0 bg-white">
                {grid.map((row, rowIndex) => (
                  row.map((letter, colIndex) => {
                    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
                    const cellColor = isSelected 
                      ? "bg-pastel-purple/70 text-white" 
                      : (rowIndex + colIndex) % 2 === 0 ? "bg-white hover:bg-pastel-purple/10" : "bg-slate-50 hover:bg-pastel-purple/10";
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cn(
                          "aspect-square flex items-center justify-center text-lg font-medium cursor-pointer border border-slate-100",
                          "transition-all duration-200 transform hover:scale-105",
                          cellColor
                        )}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {letter}
                      </div>
                    );
                  })
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

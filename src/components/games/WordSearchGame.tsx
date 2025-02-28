
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";

interface WordToFind {
  word: string;
  found: boolean;
}

interface WordSearchPuzzle {
  id: string;
  theme_id: string;
  difficulty: string;
  puzzle_data: {
    grid: string[][];
    words: string[];
  };
  theme?: {
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
        .eq("game_type", "word_search");

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

  const initializeGameFromPuzzle = (puzzle: WordSearchPuzzle) => {
    const puzzleGrid = puzzle.puzzle_data.grid;
    const puzzleWords = puzzle.puzzle_data.words.map(word => ({
      word,
      found: false
    }));

    setGrid(puzzleGrid);
    setWords(puzzleWords);
    setSelectedCells([]);
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
  };

  const handleCellClick = (row: number, col: number) => {
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
      
      toast({
        title: "Word Found!",
        description: `You found "${foundWord.word}"!`,
        variant: "default",
      });
    }

    setSelectedCells([]);
    
    // Check if all words are found
    const allFound = words.every(w => w.found);
    if (allFound) {
      toast({
        title: "Congratulations!",
        description: "You found all the words!",
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
              <div className="grid grid-cols-8 gap-0.5 bg-gray-200 p-0.5">
                {grid.map((row, rowIndex) => (
                  row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square bg-white flex items-center justify-center text-lg font-medium cursor-pointer
                        ${selectedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-blue-100' : ''}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {letter}
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
              <h3 className="text-xl font-semibold mb-4">Words to Find</h3>
              <div className="flex flex-wrap gap-2">
                {words.map(({ word, found }) => (
                  <div
                    key={word}
                    className={`px-4 py-2 rounded-full border ${
                      found ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300'
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button onClick={checkSelection} className="w-full">
                  Check Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

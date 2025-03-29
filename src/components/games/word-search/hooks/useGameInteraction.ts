import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import type { WordToFind } from "../types";

export const useGameInteraction = (
  grid: string[][],
  words: WordToFind[],
  setWords: React.Dispatch<React.SetStateAction<WordToFind[]>>,
  gameState: ReturnType<typeof import("@/hooks/use-game-state").useGameState>
) => {
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Check if game is complete
  useEffect(() => {
    if (words.length > 0 && words.every(w => w.found)) {
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  }, [words, gameState]);

  const handleCellClick = useCallback((row: number, col: number) => {
    // Skip blank cells
    if (grid[row][col] === ' ') return;
    
    if (!gameState.isActive) {
      gameState.startGame();
    }
    
    setSelectedCells((prev) => {
      // For drag selection, we want to replace the selection rather than toggle
      return [[row, col]];
    });
  }, [grid, gameState]);

  const checkSelection = useCallback(() => {
    if (selectedCells.length < 2) return;

    // Get the word in both forward and reverse directions
    const selectedWord = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');
    
    const reversedWord = selectedWord.split('').reverse().join('');

    // Check both forward and reversed words
    const foundWord = words.find(
      ({ word, found }) => !found && (word === selectedWord || word === reversedWord)
    );

    if (foundWord) {
      setWords(words.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      ));
      
      // Award points based on word length and difficulty
      const points = foundWord.word.length * 10;
      gameState.updateScore(points);
      
      toast({
        title: "Word Found!",
        description: `You found "${foundWord.word}"! (+${points} points)`,
        variant: "default",
      });
    }

    setSelectedCells([]);
    
    // Check if all words are found
    const remainingWords = words.filter(w => !w.found).length - (foundWord ? 1 : 0);
    if (remainingWords === 0) {
      const finalScore = gameState.score;
      toast({
        title: "🎉 Congratulations!",
        description: `You found all the words! Final score: ${finalScore}`,
        variant: "default",
      });
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  }, [selectedCells, grid, words, setWords, gameState]);

  // Add a function to update selection during drag
  const updateSelection = useCallback((cells: [number, number][]) => {
    setSelectedCells(cells);
  }, []);

  return {
    selectedCells,
    isGameComplete,
    handleCellClick,
    checkSelection,
    updateSelection
  };
};

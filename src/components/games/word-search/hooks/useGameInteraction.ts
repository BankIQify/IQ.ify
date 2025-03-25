
import { useState, useEffect } from "react";
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

  return {
    selectedCells,
    isGameComplete,
    handleCellClick,
    checkSelection
  };
};

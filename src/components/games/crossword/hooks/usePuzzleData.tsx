
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordPuzzle } from "../utils/types";
import { fetchThemes, fetchPuzzlesByTheme } from "../utils/puzzleDataFetcher";
import { generateDummyCrossword } from "../utils/puzzleGenerator";

export function usePuzzleData(difficulty: Difficulty) {
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [puzzles, setPuzzles] = useState<CrosswordPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchThemes().then(themesData => {
      setThemes(themesData);
      
      if (themesData.length > 0) {
        setSelectedTheme(themesData[0].id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      fetchPuzzlesByTheme(selectedTheme, difficulty).then(puzzlesData => {
        setPuzzles(puzzlesData);
        setCurrentPuzzle(null);
      });
    }
  }, [selectedTheme, difficulty]);

  useEffect(() => {
    if (puzzles.length > 0 && !currentPuzzle) {
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      setCurrentPuzzle(puzzles[randomIndex]);
    } else if (puzzles.length === 0 && !currentPuzzle && selectedTheme) {
      generateDummyPuzzle();
    }
  }, [puzzles, currentPuzzle, selectedTheme]);

  const generateDummyPuzzle = () => {
    let themeKey = "general";
    
    const selectedThemeObj = themes.find(t => t.id === selectedTheme);
    if (selectedThemeObj) {
      const themeName = selectedThemeObj.name.toLowerCase();
      
      if (themeName.includes("animal")) themeKey = "animals";
      else if (themeName.includes("food")) themeKey = "food";
      else if (themeName.includes("science")) themeKey = "science";
      else if (themeName.includes("nature")) themeKey = "geography";
      else if (themeName.includes("countr")) themeKey = "geography";
      else if (themeName.includes("technolog")) themeKey = "science";
      else if (themeName.includes("music")) themeKey = "general";
      else if (themeName.includes("movie")) themeKey = "general";
      else if (themeName.includes("history")) themeKey = "general";
      
      console.log(`Using word list for theme: ${themeKey} (original theme: ${themeName})`);
    }
    
    // Generate a new puzzle with proper crossword layout
    const dummyPuzzleData = generateDummyCrossword(difficulty, themeKey);
    
    const dummyPuzzle: CrosswordPuzzle = {
      id: `dummy-${Date.now()}`,
      theme_id: selectedTheme,
      difficulty: difficulty,
      puzzle_data: dummyPuzzleData,
      theme: selectedThemeObj ? { name: selectedThemeObj.name } : undefined
    };
    
    setCurrentPuzzle(dummyPuzzle);
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };
  
  const handleNewPuzzle = (resetGameFn: () => void) => {
    if (puzzles.length <= 1) {
      generateDummyPuzzle();
      resetGameFn();
      return;
    }
    
    let newPuzzle;
    do {
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      newPuzzle = puzzles[randomIndex];
    } while (newPuzzle.id === currentPuzzle?.id);
    
    setCurrentPuzzle(newPuzzle);
    resetGameFn();
  };

  return {
    loading,
    themes,
    selectedTheme,
    puzzles,
    currentPuzzle,
    handleSelectTheme,
    handleNewPuzzle,
    generateDummyPuzzle,
  };
}

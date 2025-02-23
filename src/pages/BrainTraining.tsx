
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GameLayout } from "@/components/games/GameLayout";
import { GameSettings } from "@/components/games/GameSettings";
import type { Difficulty } from "@/components/games/GameSettings";
import { Puzzle, Grid, BookOpen, LayoutGrid } from "lucide-react";
import { MemoryGame } from "@/components/games/MemoryGame";
import { SudokuGame } from "@/components/games/SudokuGame";

const BrainTraining = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedGame, setSelectedGame] = useState<"word_search" | "crossword" | "sudoku" | "memory" | null>(null);

  if (selectedGame) {
    return (
      <div className="page-container">
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to games
        </button>
        <GameLayout
          title={selectedGame === "word_search" ? "Word Search" : 
                 selectedGame === "crossword" ? "Crossword" :
                 selectedGame === "memory" ? "Memory Game" : "Sudoku"}
          difficulty={difficulty}
        >
          {selectedGame === "memory" ? (
            <MemoryGame difficulty={difficulty} />
          ) : selectedGame === "sudoku" ? (
            <SudokuGame difficulty={difficulty} />
          ) : (
            <div className="grid place-items-center min-h-[400px]">
              <p className="text-muted-foreground">Game content will be displayed here</p>
            </div>
          )}
        </GameLayout>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
        Brain Training Games
      </h1>

      <Card className="p-6 mb-8">
        <GameSettings
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("word_search")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <BookOpen className="w-12 h-12 text-pastel-blue" />
            </div>
            <CardTitle>Word Search</CardTitle>
            <CardDescription>
              Challenge your vocabulary and attention to detail by finding hidden words in a grid of letters.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("crossword")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Puzzle className="w-12 h-12 text-pastel-purple" />
            </div>
            <CardTitle>Crossword</CardTitle>
            <CardDescription>
              Test your knowledge and problem-solving skills with interconnected word puzzles and clever clues.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("sudoku")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Grid className="w-12 h-12 text-pastel-green" />
            </div>
            <CardTitle>Sudoku</CardTitle>
            <CardDescription>
              Exercise your logical thinking by filling a 9x9 grid with numbers following specific rules.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("memory")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <LayoutGrid className="w-12 h-12 text-pastel-orange" />
            </div>
            <CardTitle>Memory Game</CardTitle>
            <CardDescription>
              Test your memory by matching pairs of cards in this classic concentration game.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default BrainTraining;

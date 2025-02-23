
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GameLayout } from "@/components/games/GameLayout";
import { GameSettings } from "@/components/games/GameSettings";
import type { Difficulty } from "@/components/games/GameSettings";
import { Puzzle, Grid, BookOpen, LayoutGrid, Globe2, Calculator, Brain } from "lucide-react";
import { MemoryGame } from "@/components/games/MemoryGame";
import { SudokuGame } from "@/components/games/SudokuGame";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { GeographyGame } from "@/components/games/GeographyGame";
import { TimesTablesGame } from "@/components/games/TimesTablesGame";
import { IQTestGame } from "@/components/games/IQTestGame";

const BrainTraining = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedGame, setSelectedGame] = useState<"word_search" | "crossword" | "sudoku" | "memory" | "geography" | "times_tables" | "iq_test" | null>(null);

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
                 selectedGame === "memory" ? "Memory Game" :
                 selectedGame === "geography" ? "Geography Quiz" :
                 selectedGame === "times_tables" ? "Times Tables Test" :
                 selectedGame === "iq_test" ? "IQ Test" :
                 "Sudoku"}
          difficulty={difficulty}
          settingsContent={selectedGame !== "times_tables" ? (
            <GameSettings
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
            />
          ) : undefined}
          showSettings={selectedGame !== "times_tables"}
        >
          {selectedGame === "memory" ? (
            <MemoryGame difficulty={difficulty} />
          ) : selectedGame === "sudoku" ? (
            <SudokuGame difficulty={difficulty} />
          ) : selectedGame === "word_search" ? (
            <WordSearchGame difficulty={difficulty} />
          ) : selectedGame === "crossword" ? (
            <CrosswordGame difficulty={difficulty} />
          ) : selectedGame === "geography" ? (
            <GeographyGame difficulty={difficulty} />
          ) : selectedGame === "times_tables" ? (
            <TimesTablesGame />
          ) : selectedGame === "iq_test" ? (
            <IQTestGame difficulty={difficulty} />
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

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("geography")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Globe2 className="w-12 h-12 text-pastel-green" />
            </div>
            <CardTitle>Geography Quiz</CardTitle>
            <CardDescription>
              Test your knowledge of countries and their capitals by identifying flags from around the world.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("times_tables")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Calculator className="w-12 h-12 text-pastel-blue" />
            </div>
            <CardTitle>Times Tables Test</CardTitle>
            <CardDescription>
              Practice multiplication and division with a rapid-fire times tables test.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedGame("iq_test")}
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Brain className="w-12 h-12 text-pastel-purple" />
            </div>
            <CardTitle>IQ Test</CardTitle>
            <CardDescription>
              Challenge your intelligence with pattern recognition, logical reasoning, and numerical sequence puzzles.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default BrainTraining;

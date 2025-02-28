
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { TimesTablesGame } from "@/components/games/TimesTablesGame";
import { SudokuGame } from "@/components/games/SudokuGame";
import { TwentyFourGame } from "@/components/games/TwentyFourGame";
import { useState } from "react";
import type { Difficulty } from "@/components/games/GameSettings";
import { Puzzle, BookOpen, Grid, Calculator, Hash } from "lucide-react";

export default function BrainTraining() {
  const defaultDifficulty: Difficulty = "easy";
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  // Function to render the selected game component
  const renderGame = () => {
    switch (selectedGame) {
      case "word-search":
        return <WordSearchGame difficulty={defaultDifficulty} />;
      case "crossword":
        return <CrosswordGame difficulty={defaultDifficulty} />;
      case "times-tables":
        return <TimesTablesGame difficulty={defaultDifficulty} />;
      case "sudoku":
        return <SudokuGame difficulty={defaultDifficulty} />;
      case "twenty-four":
        return <TwentyFourGame difficulty={defaultDifficulty} />;
      default:
        return null;
    }
  };
  
  // Function to go back to the game selection
  const handleBackToGames = () => {
    setSelectedGame(null);
  };
  
  // Game card configuration
  const games = [
    {
      id: "word-search",
      title: "Word Search",
      description: "Find hidden words in a grid of letters",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    },
    {
      id: "crossword",
      title: "Crossword",
      description: "Fill in words based on clues in a crossword puzzle grid",
      icon: <Puzzle className="h-8 w-8 text-purple-500" />,
    },
    {
      id: "times-tables",
      title: "Times Tables",
      description: "Practice multiplication tables with rapid-fire questions",
      icon: <Calculator className="h-8 w-8 text-green-500" />,
    },
    {
      id: "sudoku",
      title: "Sudoku",
      description: "Fill the grid with numbers following logical rules",
      icon: <Grid className="h-8 w-8 text-orange-500" />,
    },
    {
      id: "twenty-four",
      title: "24 Game",
      description: "Use four numbers and arithmetic operations to make 24",
      icon: <Hash className="h-8 w-8 text-pink-500" />,
    },
  ];
  
  return (
    <div className="page-container">
      <h1 className="section-title mb-6">Brain Training Games</h1>
      
      {selectedGame ? (
        <div>
          <Button 
            variant="outline" 
            onClick={handleBackToGames} 
            className="mb-4"
          >
            ← Back to Games
          </Button>
          {renderGame()}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{game.title}</CardTitle>
                  {game.icon}
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">Play Game</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

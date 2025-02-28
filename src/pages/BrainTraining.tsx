
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GameLayout } from "@/components/games/GameLayout";
import { GameSettings } from "@/components/games/GameSettings";
import type { Difficulty } from "@/components/games/GameSettings";
import { Puzzle, Grid, BookOpen, LayoutGrid, Globe2, Calculator, Brain, Sparkles } from "lucide-react";
import { MemoryGame } from "@/components/games/MemoryGame";
import { SudokuGame } from "@/components/games/SudokuGame";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { GeographyGame } from "@/components/games/GeographyGame";
import { TimesTablesGame } from "@/components/games/TimesTablesGame";
import IQTestGame from "@/components/games/IQTestGame";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const BrainTraining = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedGame, setSelectedGame] = useState<"word_search" | "crossword" | "sudoku" | "memory" | "geography" | "times_tables" | "iq_test" | null>(null);

  if (!user) {
    toast({
      title: "Access Denied",
      description: "You must be logged in to access Brain Training games.",
      variant: "destructive"
    });
    navigate("/");
    return null;
  }

  if (selectedGame) {
    return (
      <div className="page-container">
        <button 
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-pastel-purple/30 hover:bg-pastel-purple/50 transition-colors rounded-full text-sm"
        >
          <span>← Back to games</span>
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
      <div className="relative mb-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
          Brain Training Games
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Enhance your cognitive abilities with our collection of brain training games designed to challenge your mind.
        </p>
        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-pastel-purple/30 rounded-full blur-3xl opacity-70"></div>
      </div>

      <Card className="p-6 mb-12 border border-pastel-purple/30 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Difficulty Settings</h2>
        </div>
        <GameSettings
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GameCard
          icon={<BookOpen className="w-12 h-12 text-blue-500" />}
          title="Word Search"
          color="blue"
          description="Challenge your vocabulary and attention to detail by finding hidden words in a grid of letters."
          onClick={() => setSelectedGame("word_search")}
        />

        <GameCard
          icon={<Puzzle className="w-12 h-12 text-purple-500" />}
          title="Crossword"
          color="purple"
          description="Test your knowledge and problem-solving skills with interconnected word puzzles and clever clues."
          onClick={() => setSelectedGame("crossword")}
        />

        <GameCard
          icon={<Grid className="w-12 h-12 text-green-500" />}
          title="Sudoku"
          color="green"
          description="Exercise your logical thinking by filling a 9x9 grid with numbers following specific rules."
          onClick={() => setSelectedGame("sudoku")}
        />

        <GameCard
          icon={<LayoutGrid className="w-12 h-12 text-orange-500" />}
          title="Memory Game"
          color="orange"
          description="Test your memory by matching pairs of cards in this classic concentration game."
          onClick={() => setSelectedGame("memory")}
        />

        <GameCard
          icon={<Globe2 className="w-12 h-12 text-green-500" />}
          title="Geography Quiz"
          color="teal"
          description="Test your knowledge of countries and their capitals by identifying flags from around the world."
          onClick={() => setSelectedGame("geography")}
        />

        <GameCard
          icon={<Calculator className="w-12 h-12 text-blue-500" />}
          title="Times Tables Test"
          color="blue"
          description="Practice multiplication and division with a rapid-fire times tables test."
          onClick={() => setSelectedGame("times_tables")}
        />

        <GameCard
          icon={<Brain className="w-12 h-12 text-purple-500" />}
          title="IQ Test"
          color="pink"
          description="Challenge your intelligence with pattern recognition, logical reasoning, and numerical sequence puzzles."
          onClick={() => setSelectedGame("iq_test")}
        />
      </div>
    </div>
  );
};

interface GameCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange" | "teal" | "pink";
  onClick: () => void;
}

const GameCard = ({ icon, title, description, color, onClick }: GameCardProps) => {
  const getGradient = () => {
    switch (color) {
      case "blue":
        return "from-pastel-blue/50 to-pastel-blue/10";
      case "purple":
        return "from-pastel-purple/50 to-pastel-purple/10";
      case "green":
        return "from-pastel-green/50 to-pastel-green/10";
      case "orange":
        return "from-pastel-orange/50 to-pastel-orange/10";
      case "teal":
        return "from-pastel-green/50 to-pastel-blue/10";
      case "pink":
        return "from-pastel-pink/50 to-pastel-pink/10";
      default:
        return "from-pastel-blue/50 to-pastel-blue/10";
    }
  };

  return (
    <Card 
      className={`overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${getGradient()} border-none`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full p-4 bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="mt-2 leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default BrainTraining;

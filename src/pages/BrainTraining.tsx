import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { TimesTablesGame } from "@/components/games/TimesTablesGame";
import { SudokuGame } from "@/components/games/SudokuGame";
import { TwentyFourGame } from "@/components/games/TwentyFourGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { GeographyGame } from "@/components/games/GeographyGame";
import { RopeUntangleGame } from "@/components/games/RopeUntangleGame";
import IQTestGame from "@/components/games/IQTestGame";
import { useState } from "react";
import type { Difficulty } from "@/components/games/GameSettings";
import { Puzzle, BookOpen, Grid, Calculator, Hash, Brain, Globe, Lightbulb, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BrainTraining() {
  const defaultDifficulty: Difficulty = "easy";
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  
  // Function to render the selected game component
  const renderGame = () => {
    switch (selectedGame) {
      case "word-search":
        return <WordSearchGame difficulty={defaultDifficulty} />;
      case "crossword":
        return <CrosswordGame difficulty={defaultDifficulty} />;
      case "times-tables":
        return <TimesTablesGame />;
      case "sudoku":
        return <SudokuGame difficulty={defaultDifficulty} />;
      case "twenty-four":
        return <TwentyFourGame difficulty={defaultDifficulty} />;
      case "memory":
        return <MemoryGame difficulty={defaultDifficulty} />;
      case "geography":
        return <GeographyGame difficulty={defaultDifficulty} />;
      case "iq-test":
        return <IQTestGame difficulty={defaultDifficulty} />;
      case "rope-untangle":
        return <RopeUntangleGame difficulty={defaultDifficulty} />;
      default:
        return null;
    }
  };
  
  // Function to go back to game selection
  const handleBackToGames = () => {
    setSelectedGame(null);
  };
  
  // Game card configuration
  const games = [
    {
      id: "word-search",
      title: "Word Search",
      description: "Find hidden words in a grid of letters",
      icon: <BookOpen className="h-8 w-8" />,
      gradient: "from-[#00FF94] to-[#0047FF]",
      hoverGradient: "from-[#00FF94]/90 to-[#0047FF]/90",
    },
    {
      id: "crossword",
      title: "Crossword",
      description: "Fill in words based on clues in a crossword puzzle grid",
      icon: <Puzzle className="h-8 w-8" />,
      gradient: "from-[#FF00E5] to-[#0047FF]",
      hoverGradient: "from-[#FF00E5]/90 to-[#0047FF]/90",
    },
    {
      id: "times-tables",
      title: "Times Tables",
      description: "Practise multiplication tables with rapid-fire questions",
      icon: <Calculator className="h-8 w-8" />,
      gradient: "from-[#FFE500] to-[#00FF94]",
      hoverGradient: "from-[#FFE500]/90 to-[#00FF94]/90",
    },
    {
      id: "sudoku",
      title: "Sudoku",
      description: "Fill the grid with numbers following logical rules",
      icon: <Grid className="h-8 w-8" />,
      gradient: "from-[#FF00E5] to-[#FFE500]",
      hoverGradient: "from-[#FF00E5]/90 to-[#FFE500]/90",
    },
    {
      id: "twenty-four",
      title: "24 Game",
      description: "Use four numbers and arithmetic operations to make 24",
      icon: <Hash className="h-8 w-8" />,
      gradient: "from-[#00FF94] to-[#FFE500]",
      hoverGradient: "from-[#00FF94]/90 to-[#FFE500]/90",
    },
    {
      id: "memory",
      title: "Memory Game",
      description: "Test your memory by matching pairs of cards",
      icon: <Brain className="h-8 w-8" />,
      gradient: "from-[#0047FF] to-[#FF00E5]",
      hoverGradient: "from-[#0047FF]/90 to-[#FF00E5]/90",
    },
    {
      id: "geography",
      title: "Geography Quiz",
      description: "Challenge your knowledge of world geography",
      icon: <Globe className="h-8 w-8" />,
      gradient: "from-[#FFE500] to-[#FF00E5]",
      hoverGradient: "from-[#FFE500]/90 to-[#FF00E5]/90",
    },
    {
      id: "rope-untangle",
      title: "Untangled",
      description: "Untangle colourful ropes by moving pins to their matching holes",
      icon: <Link2 className="h-8 w-8" />,
      gradient: "from-[#0047FF] to-[#00FF94]",
      hoverGradient: "from-[#0047FF]/90 to-[#00FF94]/90",
    },
    {
      id: "iq-test",
      title: "IQ Test",
      description: "Challenge your logical and analytical thinking skills",
      icon: <Lightbulb className="h-8 w-8" />,
      gradient: "from-[#FF00E5] to-[#FFE500]",
      hoverGradient: "from-[#FF00E5]/90 to-[#FFE500]/90",
    },
  ];
  
  return (
    <div className="page-container">
      <motion.h1 
        className="section-title mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Brain Training Games
      </motion.h1>
      
      {selectedGame ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="outline" 
            onClick={handleBackToGames} 
            className="mb-4 hover:scale-105 transition-transform"
          >
            ← Back to Games
          </Button>
          {renderGame()}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredGame(game.id)}
              onHoverEnd={() => setHoveredGame(null)}
            >
              <Card 
                className={cn(
                  "cursor-pointer overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "shadow-lg hover:shadow-xl",
                  "border border-white/20 backdrop-blur-sm",
                  "bg-gradient-to-br",
                  hoveredGame === game.id ? game.hoverGradient : game.gradient
                )}
                onClick={() => setSelectedGame(game.id)}
              >
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-display">{game.title}</CardTitle>
                    <div className="text-white">{game.icon}</div>
                  </div>
                  <CardDescription className="text-white/90">{game.description}</CardDescription>
                </CardHeader>
                <CardFooter className="relative z-10">
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/40"
                  >
                    Play Game
                  </Button>
                </CardFooter>
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 mix-blend-overlay" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

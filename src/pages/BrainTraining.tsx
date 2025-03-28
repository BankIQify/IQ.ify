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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function BrainTraining() {
  const defaultDifficulty: Difficulty = "easy";
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const { user } = useAuth();
  
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

  const handleGameSelect = (gameId: string) => {
    if (!user) {
      toast.error("Please sign in to play games");
      return;
    }
    setSelectedGame(gameId);
  };
  
  // Game categories and their games
  const gameCategories = [
    {
      id: "brain-training",
      title: "Brain Training",
      description: "Enhance your cognitive abilities with these engaging exercises",
      games: [
        {
          id: "memory",
          title: "Memory Match",
          description: "Test your memory by matching pairs of cards",
          icon: <Brain className="h-8 w-8" />,
          gradient: "from-[#FF6B6B] to-[#4ECDC4]",
          hoverGradient: "from-[#FF6B6B]/90 to-[#4ECDC4]/90",
        },
        {
          id: "iq-test",
          title: "IQ Challenge",
          description: "Test your intelligence with pattern recognition puzzles",
          icon: <Lightbulb className="h-8 w-8" />,
          gradient: "from-[#A8E6CF] to-[#FFD3B6]",
          hoverGradient: "from-[#A8E6CF]/90 to-[#FFD3B6]/90",
        },
      ],
    },
    {
      id: "logic-games",
      title: "Logic Games",
      description: "Challenge your problem-solving skills",
      games: [
        {
          id: "crossword",
          title: "Crossword",
          description: "Fill in words based on clues in a crossword puzzle grid",
          icon: <Puzzle className="h-8 w-8" />,
          gradient: "from-[#FF00E5] to-[#0047FF]",
          hoverGradient: "from-[#FF00E5]/90 to-[#0047FF]/90",
        },
        {
          id: "sudoku",
          title: "Sudoku",
          description: "Fill the grid with numbers following specific rules",
          icon: <Grid className="h-8 w-8" />,
          gradient: "from-[#FF9A9E] to-[#FAD0C4]",
          hoverGradient: "from-[#FF9A9E]/90 to-[#FAD0C4]/90",
        },
        {
          id: "twenty-four",
          title: "24 Game",
          description: "Use four numbers to make 24 using basic operations",
          icon: <Calculator className="h-8 w-8" />,
          gradient: "from-[#FFE500] to-[#00FF94]",
          hoverGradient: "from-[#FFE500]/90 to-[#00FF94]/90",
        },
      ],
    },
    {
      id: "educational",
      title: "Educational Games",
      description: "Learn while you play",
      games: [
        {
          id: "word-search",
          title: "Word Search",
          description: "Find hidden words in a grid of letters",
          icon: <BookOpen className="h-8 w-8" />,
          gradient: "from-[#00FF94] to-[#0047FF]",
          hoverGradient: "from-[#00FF94]/90 to-[#0047FF]/90",
        },
        {
          id: "times-tables",
          title: "Times Tables",
          description: "Practise multiplication tables with rapid-fire questions",
          icon: <Calculator className="h-8 w-8" />,
          gradient: "from-[#FFD700] to-[#FFA500]",
          hoverGradient: "from-[#FFD700]/90 to-[#FFA500]/90",
        },
        {
          id: "geography",
          title: "Geography Quiz",
          description: "Test your knowledge of countries, capitals, and landmarks",
          icon: <Globe className="h-8 w-8" />,
          gradient: "from-[#4CAF50] to-[#8BC34A]",
          hoverGradient: "from-[#4CAF50]/90 to-[#8BC34A]/90",
        },
      ],
    },
    {
      id: "puzzle",
      title: "Puzzle Games",
      description: "Engaging puzzles to challenge your mind",
      games: [
        {
          id: "rope-untangle",
          title: "Rope Untangle",
          description: "Untangle the ropes by moving the pegs",
          icon: <Link2 className="h-8 w-8" />,
          gradient: "from-[#E040FB] to-[#7C4DFF]",
          hoverGradient: "from-[#E040FB]/90 to-[#7C4DFF]/90",
        },
      ],
    },
  ];

  if (selectedGame) {
    return (
      <div className="container mx-auto p-4">
        <Button
          variant="ghost"
          onClick={handleBackToGames}
          className="mb-4"
        >
          ← Back to Games
        </Button>
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Brain Training Games</h1>
      <Accordion type="single" collapsible className="w-full">
        {gameCategories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-xl font-semibold">
              {category.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {category.games.map((game) => (
                    <CarouselItem key={game.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="h-full"
                      >
                        <Card className="h-full border-2 hover:border-primary transition-colors">
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "p-2 rounded-lg bg-gradient-to-br",
                                game.gradient
                              )}>
                                {game.icon}
                              </div>
                              <CardTitle>{game.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{game.description}</CardDescription>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full"
                              onClick={() => handleGameSelect(game.id)}
                              disabled={!user}
                            >
                              {user ? "Play Now" : "Sign in to Play"}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

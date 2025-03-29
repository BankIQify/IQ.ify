import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  hoverGradient: string;
}

interface GameCarouselProps {
  games: Game[];
  onGameSelect: (gameId: string) => void;
  user: any | null;
}

export const GameCarousel = ({ games, onGameSelect, user }: GameCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const getVisibleGames = () => {
    const visibleGames = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + games.length) % games.length;
      visibleGames.push(games[index]);
    }
    return visibleGames;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
        aria-label="Previous game"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
        aria-label="Next game"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Container */}
      <div className="relative h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <div className="flex items-center justify-center h-full">
            {getVisibleGames().map((game, index) => {
              const isCenter = index === 1;
              const isLeft = index === 0;
              const isRight = index === 2;

              return (
                <motion.div
                  key={game.id}
                  initial={{ 
                    scale: isCenter ? 1 : 0.85,
                    opacity: isCenter ? 1 : 0.6,
                    x: isLeft ? -50 : isRight ? 50 : 0,
                  }}
                  animate={{ 
                    scale: isCenter ? 1 : 0.85,
                    opacity: isCenter ? 1 : 0.6,
                    x: isLeft ? -50 : isRight ? 50 : 0,
                  }}
                  exit={{ 
                    scale: 0.85,
                    opacity: 0.6,
                    x: isLeft ? -50 : isRight ? 50 : 0,
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 100
                  }}
                  className={cn(
                    "absolute transition-all duration-300",
                    isCenter ? "z-20" : "z-10",
                    isLeft ? "left-[25%]" : isRight ? "right-[25%]" : "left-1/2 -translate-x-1/2"
                  )}
                >
                  <Card className={cn(
                    "w-[280px] transition-all duration-300",
                    isCenter ? "scale-100" : "scale-90",
                    "bg-gradient-to-br",
                    game.gradient,
                    "hover:shadow-xl"
                  )}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg bg-white/20",
                          game.hoverGradient
                        )}>
                          {game.icon}
                        </div>
                        <CardTitle className="text-xl">{game.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/90">
                        {game.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => onGameSelect(game.id)}
                        disabled={!user}
                      >
                        {user ? "Play Now" : "Sign in to Play"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}; 
import { useState, useEffect } from "react";
import { Square, Circle, Triangle, Star, Trophy } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { AuthenticatedGameWrapper } from "./AuthenticatedGameWrapper";

type Shape = "square" | "circle" | "triangle" | "star";

interface Card {
  id: number;
  shape: Shape;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  difficulty: Difficulty;
}

const SHAPES: Shape[] = ["square", "circle", "triangle", "star"];

const ShapeIcon = ({ shape, className }: { shape: Shape; className?: string }) => {
  switch (shape) {
    case "square":
      return <Square className={className} />;
    case "circle":
      return <Circle className={className} />;
    case "triangle":
      return <Triangle className={className} />;
    case "star":
      return <Star className={className} />;
  }
};

export const MemoryGame = ({ difficulty }: MemoryGameProps) => {
  return (
    <AuthenticatedGameWrapper>
      <MemoryGameContent difficulty={difficulty} />
    </AuthenticatedGameWrapper>
  );
};

const MemoryGameContent = ({ difficulty }: MemoryGameProps) => {
  const { score, updateScore, timer, startGame, resetGame, isActive } = useGameState({
    initialTimer: 300,
    gameType: "word_search",
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const allShapes = [...SHAPES, ...SHAPES, ...SHAPES, ...SHAPES, 
                      ...SHAPES, ...SHAPES, ...SHAPES, ...SHAPES];
    const shuffledCards = allShapes
      .sort(() => Math.random() - 0.5)
      .map((shape, index) => ({
        id: index,
        shape,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsGameComplete(false);
    resetGame();
  };

  const handleCardClick = (id: number) => {
    if (!isActive) {
      startGame();
    }

    if (
      flippedCards.length === 2 ||
      flippedCards.includes(id) ||
      cards[id].isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].shape === cards[secondId].shape) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => {
          const newValue = prev + 1;
          if (newValue === 16) {
            setIsGameComplete(true);
          }
          return newValue;
        });
        updateScore(10);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const progressValue = (matchedPairs / 16) * 100;

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto p-4 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#0047FF]/20 to-[#FF00E5]/20 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Pairs Found</span>
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-[#00FF94] to-[#0047FF] bg-clip-text text-transparent"
            key={matchedPairs}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {matchedPairs} / 16
          </motion.span>
        </div>
        
        <div className="flex-1">
          <Progress 
            value={progressValue} 
            className="h-3 bg-white/10 [&>[role=progressbar]]:bg-gradient-to-r [&>[role=progressbar]]:from-[#00FF94] [&>[role=progressbar]]:to-[#0047FF]" 
          />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Score</span>
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-[#FF00E5] to-[#FFE500] bg-clip-text text-transparent"
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {score}
          </motion.span>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 max-w-3xl mx-auto"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "aspect-square cursor-pointer transition-all duration-500 transform perspective-1000",
              "rounded-xl overflow-hidden",
              card.isMatched && "opacity-80"
            )}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-full h-full">
              {/* Card Back */}
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-500",
                  "bg-gradient-to-br from-[#0047FF] to-[#FF00E5] rounded-xl",
                  "shadow-lg backdrop-blur-sm",
                  "flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-180 opacity-0"
                    : ""
                )}
              >
                <div className="w-2/3 h-2/3 bg-white/10 rounded-lg flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-white/20 rounded-md transform rotate-45" />
                </div>
              </div>

              {/* Card Front */}
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-500",
                  "bg-white/95 rounded-xl",
                  "shadow-xl backdrop-blur-sm",
                  "flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? ""
                    : "rotate-y-180 opacity-0"
                )}
              >
                <ShapeIcon
                  shape={card.shape}
                  className={cn(
                    "w-2/3 h-2/3 transition-all duration-300",
                    card.isMatched ? "text-green-500" : "text-purple-600"
                  )}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {isGameComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center space-y-4"
          >
            <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Congratulations!</h2>
            <p className="text-gray-600">
              You've completed the game with a score of {score}!
            </p>
            <Button
              onClick={initializeGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Play Again
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

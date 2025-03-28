<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { useState, useEffect } from "react";
import { Square, Circle, Triangle, Star, Trophy } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
=======
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916

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
<<<<<<< HEAD
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
          <span className="text-sm text-white/70">Pairs Found</span>
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
          <span className="text-sm text-white/70">Score</span>
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
        className="grid grid-cols-8 gap-3 max-w-3xl mx-auto"
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
=======
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-pastel-purple/20 to-pastel-blue/20 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Pairs Found</span>
          <span className="text-xl font-bold">{matchedPairs} / 16</span>
        </div>
        
        <div className="flex-1">
          <Progress value={progressValue} className="h-3 bg-pastel-gray/50" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 max-w-3xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "aspect-square cursor-pointer transition-all duration-500 transform perspective-1000 hover:scale-105",
              "shadow-md rounded-lg",
              card.isMatched && "opacity-80"
            )}
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
          >
            <div className="relative w-full h-full">
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-500",
<<<<<<< HEAD
                  "bg-gradient-to-br from-[#0047FF] to-[#FF00E5] border-2 border-white/20 rounded-xl flex items-center justify-center",
                  "shadow-lg backdrop-blur-sm",
=======
                  "bg-gradient-to-br from-pastel-purple/80 to-pastel-blue/80 border-2 border-white rounded-lg flex items-center justify-center",
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-180 opacity-0"
                    : ""
                )}
              >
                <div className="w-6 h-6 bg-white/30 rounded-full"></div>
              </div>
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-500 rotate-y-180",
<<<<<<< HEAD
                  "bg-gradient-to-br from-white/10 to-white/5 border-2 rounded-xl flex items-center justify-center",
                  "backdrop-blur-md",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-0 opacity-100"
                    : "opacity-0",
                  card.isMatched && "bg-gradient-to-br from-[#00FF94]/20 to-[#0047FF]/20"
=======
                  "bg-white border-2 rounded-lg flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-0 opacity-100"
                    : "opacity-0",
                  card.isMatched && "bg-pastel-green/20"
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
                )}
              >
                <ShapeIcon
                  shape={card.shape}
                  className={cn(
<<<<<<< HEAD
                    "w-8 h-8 transition-all duration-300",
                    card.shape === "square" && "text-[#0047FF]",
                    card.shape === "circle" && "text-[#FF00E5]",
                    card.shape === "triangle" && "text-[#00FF94]",
                    card.shape === "star" && "text-[#FFE500]"
=======
                    "w-8 h-8",
                    card.shape === "square" && "text-blue-500",
                    card.shape === "circle" && "text-red-500",
                    card.shape === "triangle" && "text-green-500",
                    card.shape === "star" && "text-yellow-500"
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
                  )}
                />
              </div>
            </div>
<<<<<<< HEAD
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {isGameComplete && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-[#0047FF] to-[#FF00E5] p-8 rounded-2xl shadow-2xl max-w-md mx-auto text-center border-2 border-white/20"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
              >
                <Trophy className="w-20 h-20 text-[#FFE500] mx-auto mb-6" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">Congratulations!</h3>
              <p className="text-lg text-white/90 mb-6">
                You've completed the game with a score of {score}!
              </p>
              <Button
                onClick={initializeGame}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 text-lg px-8 py-6"
                size="lg"
              >
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
=======
          </div>
        ))}
      </div>

      {isGameComplete && (
        <div className="mt-8 text-center animate-scale-in">
          <div className="bg-gradient-to-r from-pastel-green to-pastel-blue p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">Congratulations!</h3>
            <p className="text-lg text-white/90 mb-4">You've completed the game with a score of {score}!</p>
            <Button
              onClick={initializeGame}
              className="bg-white text-primary hover:bg-white/90 transition-colors"
              size="lg"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  );
};

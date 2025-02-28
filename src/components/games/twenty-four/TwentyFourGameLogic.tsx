
import { useState, useEffect } from "react";
import { fetchTwentyFourPuzzles, recordGameSession } from "./puzzleService";
import { evaluateExpression } from "./GameLogic";
import { useToast } from "@/hooks/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";
import type { TwentyFourPuzzle } from "./types";

interface TwentyFourGameLogicProps {
  gameState: ReturnType<typeof import("@/hooks/use-game-state").useGameState>;
  onGameCompleted: () => void;
  difficulty: Difficulty;
}

export const useTwentyFourGameLogic = ({
  gameState,
  onGameCompleted,
  difficulty
}: TwentyFourGameLogicProps) => {
  const [puzzles, setPuzzles] = useState<TwentyFourPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Fetch puzzles when the component mounts or difficulty changes
  useEffect(() => {
    if (gameState.isActive) {
      loadPuzzles();
    }
  }, [difficulty, gameState.isActive]);

  const loadPuzzles = async () => {
    setLoading(true);
    try {
      console.log(`Fetching puzzles with difficulty: ${difficulty}`);
      // Fetch puzzles with the current difficulty setting
      const loadedPuzzles = await fetchTwentyFourPuzzles(difficulty);
      console.log(`Fetched ${loadedPuzzles.length} puzzles`);
      
      if (loadedPuzzles.length === 0) {
        // If no puzzles found and we haven't retried too many times, try generating sample puzzles
        if (retryCount === 0) {
          toast({
            title: "Generating puzzles",
            description: "No puzzles found. Generating sample puzzles...",
          });
          
          try {
            // This will add sample puzzles to the database
            await import("./puzzleService").then(module => module.generateSamplePuzzles());
            setRetryCount(prev => prev + 1);
            
            // Try fetching again after generating samples
            setTimeout(() => loadPuzzles(), 1000);
            return;
          } catch (genError) {
            console.error("Error generating sample puzzles:", genError);
          }
        }
        
        toast({
          title: "No puzzles found",
          description: `No puzzles available for ${difficulty} difficulty. Try generating some puzzles first.`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Shuffle the puzzles to make the game more interesting
      const shuffledPuzzles = [...loadedPuzzles].sort(() => Math.random() - 0.5);
      
      setPuzzles(shuffledPuzzles);
      setLoading(false);
      
    } catch (error) {
      console.error("Error loading puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzles. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    setCurrentPuzzleIndex(0);
    setSolvedPuzzles([]);
    setUserAnswer("");
    setShowSolution(false);
    gameState.startGame();
  };

  const handleSubmitAnswer = () => {
    try {
      // Check if we have puzzles and are at a valid index
      if (!puzzles || !puzzles[currentPuzzleIndex]) {
        toast({
          title: "Error",
          description: "No puzzle available",
          variant: "destructive",
        });
        return;
      }

      // Use the imported evaluateExpression function
      const result = evaluateExpression(userAnswer, puzzles[currentPuzzleIndex].numbers);
      
      if (result === 24) {
        toast({
          title: "Correct!",
          description: "Your solution is correct!",
        });
        
        // Mark this puzzle as solved
        setSolvedPuzzles((prev) => [...prev, puzzles[currentPuzzleIndex].id]);
        
        // Award points based on difficulty
        const difficultyPoints = {
          easy: 10,
          medium: 15,
          hard: 20
        };
        
        gameState.updateScore(difficultyPoints[difficulty] || 10);
        
        // Move to the next puzzle
        moveToNextPuzzle();
      } else {
        toast({
          title: "Incorrect",
          description: `Your solution equals ${result}, not 24. Try again!`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid Expression",
        description: "Please enter a valid mathematical expression using only the given numbers.",
        variant: "destructive",
      });
    }
  };

  const moveToNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setUserAnswer("");
      setShowSolution(false);
    } else {
      // All puzzles completed
      finishGame();
    }
  };

  const finishGame = () => {
    // Record the game session in the database
    recordGameSession(
      gameState.score,
      gameState.timer
    );
    
    onGameCompleted();
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    // Penalty for seeing the solution
    gameState.updateScore(-5);
  };

  const handleSkipPuzzle = () => {
    // Penalty for skipping
    gameState.updateScore(-3);
    moveToNextPuzzle();
  };

  return {
    puzzles,
    currentPuzzleIndex,
    userAnswer,
    setUserAnswer,
    solvedPuzzles,
    showSolution,
    loading,
    handleStartGame,
    handleSubmitAnswer,
    handleShowSolution,
    handleSkipPuzzle,
    loadPuzzles
  };
};

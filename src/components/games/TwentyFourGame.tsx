
import { useState, useEffect } from "react";
import { GameLayout } from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/use-game-state";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GameInstructions } from "./twenty-four/GameInstructions";
import { PuzzleDisplay } from "./twenty-four/PuzzleDisplay";
import { GameControls } from "./twenty-four/GameControls";
import { GameCompletedModal } from "./twenty-four/GameCompletedModal";
import { evaluateExpression } from "./twenty-four/GameLogic";
import type { Difficulty } from "@/components/games/GameSettings";

export interface TwentyFourPuzzle {
  id: string;
  numbers: number[];
  solution?: string;
}

// Define props interface for the component
export interface TwentyFourGameProps {
  difficulty?: Difficulty;
}

export const TwentyFourGame = ({ difficulty = "easy" }: TwentyFourGameProps) => {
  const [puzzles, setPuzzles] = useState<TwentyFourPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showGameCompleted, setShowGameCompleted] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const { toast } = useToast();

  const gameState = useGameState({
    gameType: "word_search", // Using an existing valid game type from the database enum
    initialTimer: 300, // 5 minutes
    onGameOver: () => setShowGameCompleted(true),
  });

  // Fetch puzzles when the component mounts
  useEffect(() => {
    fetchPuzzles();
  }, []);

  const fetchPuzzles = async () => {
    try {
      const { data, error } = await supabase
        .from("game_puzzles")
        .select("id, puzzle_data")
        .eq("game_type", "twenty_four")
        .eq("difficulty", gameState.difficulty)
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedPuzzles = data.map((item) => {
          const puzzleData = typeof item.puzzle_data === 'string' ? 
            JSON.parse(item.puzzle_data) : item.puzzle_data;
            
          return {
            id: item.id,
            numbers: puzzleData.numbers || [],
            solution: puzzleData.solution,
          };
        });
        setPuzzles(mappedPuzzles);
      } else {
        toast({
          title: "No puzzles found",
          description: "Try a different difficulty level or check back later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzles. Please try again.",
        variant: "destructive",
      });
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
      // Evaluate the user's expression
      const result = evaluateExpression(userAnswer, puzzles[currentPuzzleIndex].numbers);
      
      if (result === 24) {
        toast({
          title: "Correct!",
          description: "Your solution is correct!",
        });
        
        // Mark this puzzle as solved
        setSolvedPuzzles((prev) => [...prev, puzzles[currentPuzzleIndex].id]);
        
        // Award points
        gameState.updateScore(10);
        
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
      setShowGameCompleted(true);
      gameState.pauseGame();
    }
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

  const handleRestartGame = () => {
    setShowGameCompleted(false);
    gameState.resetGame();
  };

  if (puzzles.length === 0) {
    return (
      <GameLayout
        title="24 Game"
        description="Use four numbers and arithmetic operations to reach 24."
        score={gameState.score}
        timer={gameState.timer}
        difficulty={gameState.difficulty}
        onStart={fetchPuzzles}
        onPause={gameState.pauseGame}
        onReset={gameState.resetGame}
        onDifficultyChange={gameState.setDifficulty}
      >
        <div className="flex items-center justify-center h-full">
          <p>Loading puzzles...</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title="24 Game"
      description="Use four numbers and arithmetic operations to reach 24."
      score={gameState.score}
      timer={gameState.timer}
      difficulty={gameState.difficulty}
      onStart={handleStartGame}
      onPause={gameState.pauseGame}
      onReset={gameState.resetGame}
      onDifficultyChange={gameState.setDifficulty}
    >
      {gameState.isActive ? (
        <>
          {puzzles.length > 0 && (
            <PuzzleDisplay 
              puzzle={puzzles[currentPuzzleIndex]} 
              currentIndex={currentPuzzleIndex}
              totalPuzzles={puzzles.length}
            />
          )}
          
          <GameControls 
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={handleSubmitAnswer}
            onSkip={handleSkipPuzzle}
            onShowSolution={handleShowSolution}
            showSolution={showSolution}
            solution={puzzles[currentPuzzleIndex]?.solution}
          />
        </>
      ) : (
        <GameInstructions />
      )}

      {showGameCompleted && (
        <GameCompletedModal
          score={gameState.score}
          solvedCount={solvedPuzzles.length}
          totalPuzzles={puzzles.length}
          onRestart={handleRestartGame}
        />
      )}
    </GameLayout>
  );
};

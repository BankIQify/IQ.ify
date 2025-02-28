
import { useState, useEffect } from "react";
import { GameLayout } from "@/components/games/GameLayout";
import { useGameState } from "@/hooks/use-game-state";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GameInstructions } from "./twenty-four/GameInstructions";
import { PuzzleDisplay } from "./twenty-four/PuzzleDisplay";
import { GameControls } from "./twenty-four/GameControls";
import { GameCompletedModal } from "./twenty-four/GameCompletedModal";
import { fetchTwentyFourPuzzles } from "./twenty-four/puzzleService";
import { evaluateExpression } from "./twenty-four/GameLogic";
import type { Difficulty } from "@/components/games/GameSettings";
import type { TwentyFourPuzzle } from "./twenty-four/types";

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
    gameType: "twenty_four", // Use the string literal directly
    initialTimer: 300, // 5 minutes
    onGameOver: () => setShowGameCompleted(true),
  });

  // Fetch puzzles when the component mounts or difficulty changes
  useEffect(() => {
    loadPuzzles();
  }, [gameState.difficulty]);

  const loadPuzzles = async () => {
    try {
      const loadedPuzzles = await fetchTwentyFourPuzzles(gameState.difficulty);
      setPuzzles(loadedPuzzles);
    } catch (error) {
      console.error("Error loading puzzles:", error);
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
      // Directly use the imported evaluateExpression function
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
        onStart={loadPuzzles}
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

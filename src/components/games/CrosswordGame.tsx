
import { useGameController } from "./crossword/hooks/useGameController";
import type { Difficulty } from "@/components/games/GameSettings";
import { GameHeader } from "./crossword/components/GameHeader";
import { CrosswordContent } from "./crossword/components/CrosswordContent";
import { GameCompletedModal } from "./crossword/components/GameCompletedModal";
import { CrosswordLoader } from "./crossword/components/CrosswordLoader";

export const CrosswordGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const {
    loading,
    grid,
    clues,
    selectedCell,
    themes,
    selectedTheme,
    puzzles,
    currentPuzzle,
    correctAnswers,
    totalAnswers,
    isGameComplete,
    score,
    timer,
    handleCellClick,
    handleKeyPress,
    handleSelectTheme,
    handleNewPuzzle,
    handleHint,
  } = useGameController(difficulty);

  if (loading) {
    return <CrosswordLoader />;
  }

  return (
    <div className="space-y-6">
      <GameHeader 
        themes={themes}
        selectedTheme={selectedTheme}
        handleSelectTheme={handleSelectTheme}
        handleNewPuzzle={handleNewPuzzle}
        handleHint={handleHint}
        isHintDisabled={!selectedCell}
        puzzleCount={puzzles.length}
        themeName={currentPuzzle?.theme?.name}
        correctAnswers={correctAnswers}
        totalAnswers={totalAnswers}
      />
      
      <CrosswordContent
        grid={grid}
        clues={clues}
        selectedCell={selectedCell}
        handleCellClick={handleCellClick}
        handleKeyPress={handleKeyPress}
      />
      
      <GameCompletedModal 
        isOpen={isGameComplete}
        score={score}
        timeTaken={600 - timer}
        handleNewPuzzle={handleNewPuzzle}
      />
    </div>
  );
};

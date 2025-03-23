
import { useWordSearchGame } from "../hooks/useWordSearchGame";
import { WordGrid } from "./WordGrid";
import { WordList } from "./WordList";
import { GameHeader } from "./GameHeader";
import { GameCompletedModal } from "./GameCompletedModal";
import type { Difficulty } from "@/components/games/GameSettings";

interface WordSearchContentProps {
  difficulty: Difficulty;
}

export const WordSearchContent = ({ difficulty }: WordSearchContentProps) => {
  const {
    grid,
    words,
    selectedCells,
    themes,
    selectedTheme,
    loading,
    isGameComplete,
    gridDimensions,
    gameState,
    wordsFoundCount,
    totalWordsCount,
    timeTaken,
    handleCellClick,
    checkSelection,
    handleSelectTheme,
    handleNewPuzzle,
  } = useWordSearchGame(difficulty);

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  return (
    <div className="space-y-6">
      <GameHeader 
        themes={themes}
        selectedTheme={selectedTheme}
        handleSelectTheme={handleSelectTheme}
        handleNewPuzzle={handleNewPuzzle}
        isGameActive={gameState.isActive}
        timer={gameState.timer}
        wordsFoundCount={wordsFoundCount}
        totalWordsCount={totalWordsCount}
        score={gameState.score}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WordGrid 
          grid={grid}
          gridDimensions={gridDimensions}
          selectedCells={selectedCells}
          handleCellClick={handleCellClick}
        />
        
        <WordList 
          words={words}
          checkSelection={checkSelection}
          selectedCellsCount={selectedCells.length}
        />
      </div>
      
      {isGameComplete && (
        <GameCompletedModal 
          wordCount={totalWordsCount}
          score={gameState.score}
          timeTaken={timeTaken}
          handleNewPuzzle={handleNewPuzzle}
        />
      )}
    </div>
  );
}

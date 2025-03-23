
import { useWordSearchContext } from "../context/WordSearchContext";
import { WordGrid } from "./WordGrid";
import { WordList } from "./WordList";
import { GameHeader } from "./GameHeader";
import { GameCompletedModal } from "./GameCompletedModal";

export const WordSearchContent = () => {
  const {
    grid,
    words,
    selectedCells,
    themes,
    selectedTheme,
    loading,
    isGameComplete,
    gridDimensions,
    wordsFoundCount,
    totalWordsCount,
    timeTaken,
    isGameActive,
    timer,
    score,
    handleCellClick,
    checkSelection,
    handleSelectTheme,
    handleNewPuzzle,
  } = useWordSearchContext();

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
        isGameActive={isGameActive}
        timer={timer}
        wordsFoundCount={wordsFoundCount}
        totalWordsCount={totalWordsCount}
        score={score}
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
          score={score}
          timeTaken={timeTaken}
          handleNewPuzzle={handleNewPuzzle}
        />
      )}
    </div>
  );
}

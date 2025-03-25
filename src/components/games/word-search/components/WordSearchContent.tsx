
import { useWordSearchContext } from "../context/WordSearchContext";
import { WordGrid } from "./WordGrid";
import { WordList } from "./WordList";
import { GameHeader } from "./GameHeader";
import { GameCompletedModal } from "./GameCompletedModal";

export const WordSearchContent = () => {
  const {
    loading,
    isGameComplete,
  } = useWordSearchContext();

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  return (
    <div className="space-y-6">
      <GameHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WordGrid />
        <WordList />
      </div>
      
      {isGameComplete && (
        <GameCompletedModal />
      )}
    </div>
  );
}

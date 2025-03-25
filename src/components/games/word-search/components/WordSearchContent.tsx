
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  return (
    <div className="space-y-6">
      <GameHeader />
      
      {isMobile ? (
        // Mobile layout: stacked
        <div className="flex flex-col space-y-6">
          <WordGrid />
          <WordList />
        </div>
      ) : (
        // Desktop layout: side by side
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WordGrid />
          <WordList />
        </div>
      )}
      
      {isGameComplete && (
        <GameCompletedModal />
      )}
    </div>
  );
}

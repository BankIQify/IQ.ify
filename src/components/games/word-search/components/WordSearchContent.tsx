
import { useWordSearchContext } from "../context/WordSearchContext";
import { WordGrid } from "./WordGrid";
import { WordList } from "./WordList";
import { GameHeader } from "./GameHeader";
import { GameCompletedModal } from "./GameCompletedModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

export const WordSearchContent = () => {
  const {
    loading,
    isGameComplete,
    checkSelection,
  } = useWordSearchContext();
  
  const isMobile = useIsMobile();

  // Add effect to check for word matches when selection changes
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        checkSelection();
      }
    };
    
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [checkSelection]);

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  return (
    <div className="space-y-6">
      <GameHeader />
      
      <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}`}>
        <WordGrid />
        <WordList />
      </div>
      
      {isGameComplete && (
        <GameCompletedModal />
      )}
    </div>
  );
}

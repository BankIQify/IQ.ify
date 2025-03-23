
import { WordSearchContent } from "./word-search/components/WordSearchContent";
import { WordSearchProvider } from "./word-search/context/WordSearchProvider";
import type { Difficulty } from "@/components/games/GameSettings";

export const WordSearchGame = ({ difficulty }: { difficulty: Difficulty }) => {
  return (
    <WordSearchProvider difficulty={difficulty}>
      <WordSearchContent />
    </WordSearchProvider>
  );
};

import { WordSearchContent } from "./word-search/components/WordSearchContent";
import { WordSearchProvider } from "./word-search/context/WordSearchProvider";
import type { Difficulty } from "@/components/games/GameSettings";
import { AuthenticatedGameWrapper } from "./AuthenticatedGameWrapper";

export const WordSearchGame = ({ difficulty }: { difficulty: Difficulty }) => {
  return (
    <AuthenticatedGameWrapper>
      <WordSearchProvider difficulty={difficulty}>
        <WordSearchContent />
      </WordSearchProvider>
    </AuthenticatedGameWrapper>
  );
};

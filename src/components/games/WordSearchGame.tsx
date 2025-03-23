
import { WordSearchContent } from "./word-search/components/WordSearchContent";
import type { Difficulty } from "@/components/games/GameSettings";

export const WordSearchGame = ({ difficulty }: { difficulty: Difficulty }) => {
  return <WordSearchContent difficulty={difficulty} />;
};

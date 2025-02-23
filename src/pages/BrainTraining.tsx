
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameLayout } from "@/components/games/GameLayout";
import { GameSettings } from "@/components/games/GameSettings";
import type { Difficulty } from "@/components/games/GameSettings";

const BrainTraining = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
        Brain Training Games
      </h1>

      <Card className="p-6 mb-8">
        <GameSettings
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      </Card>

      <Tabs defaultValue="word-search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="word-search">Word Search</TabsTrigger>
          <TabsTrigger value="crossword">Crossword</TabsTrigger>
          <TabsTrigger value="sudoku">Sudoku</TabsTrigger>
        </TabsList>

        <TabsContent value="word-search">
          <GameLayout
            gameType="word_search"
            difficulty={difficulty}
          />
        </TabsContent>

        <TabsContent value="crossword">
          <GameLayout
            gameType="crossword"
            difficulty={difficulty}
          />
        </TabsContent>

        <TabsContent value="sudoku">
          <GameLayout
            gameType="sudoku"
            difficulty={difficulty}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrainTraining;


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleSummaryTab } from "./tabs/PuzzleSummaryTab";
import { ThemesManagerTab } from "./tabs/ThemesManagerTab";
import { TwentyFourPuzzlesManager } from "./TwentyFourPuzzlesManager";

export const GamePuzzlesManager = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Game Puzzles Management</h2>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Puzzle Summary</TabsTrigger>
          <TabsTrigger value="themes">Manage Themes</TabsTrigger>
          <TabsTrigger value="24-game">24 Game</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <PuzzleSummaryTab />
        </TabsContent>
        
        <TabsContent value="themes">
          <ThemesManagerTab />
        </TabsContent>
        
        <TabsContent value="24-game">
          <TwentyFourPuzzlesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

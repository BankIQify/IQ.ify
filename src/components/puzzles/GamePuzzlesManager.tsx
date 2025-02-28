
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleSummaryTab } from "./tabs/PuzzleSummaryTab";
import { ThemesManagerTab } from "./tabs/ThemesManagerTab";

export const GamePuzzlesManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Puzzle Games Management</h2>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <PuzzleSummaryTab />
        </TabsContent>
        
        <TabsContent value="themes">
          <ThemesManagerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

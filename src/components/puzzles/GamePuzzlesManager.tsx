
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleSummaryTab } from "./tabs/PuzzleSummaryTab";
import { ThemesManagerTab } from "./tabs/ThemesManagerTab";
import { Puzzle, Palette, Settings } from "lucide-react";

export const GamePuzzlesManager = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-pastel-purple to-pastel-blue rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-3">
          <Puzzle className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Puzzle Games Management
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">
          Create and manage your puzzle collection for brain training games
        </p>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="summary" 
            className="data-[state=active]:bg-pastel-purple data-[state=active]:text-foreground flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger 
            value="themes" 
            className="data-[state=active]:bg-pastel-blue data-[state=active]:text-foreground flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            <span>Themes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="animate-fadeIn">
          <PuzzleSummaryTab />
        </TabsContent>
        
        <TabsContent value="themes" className="animate-fadeIn">
          <ThemesManagerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

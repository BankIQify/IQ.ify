
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { TimesTablesGame } from "@/components/games/TimesTablesGame";
import { SudokuGame } from "@/components/games/SudokuGame";
import { TwentyFourGame } from "@/components/games/TwentyFourGame";

export default function BrainTraining() {
  return (
    <div className="page-container">
      <h1 className="section-title mb-6">Brain Training Games</h1>
      
      <Tabs defaultValue="word-search" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="word-search">Word Search</TabsTrigger>
          <TabsTrigger value="crossword">Crossword</TabsTrigger>
          <TabsTrigger value="times-tables">Times Tables</TabsTrigger>
          <TabsTrigger value="sudoku">Sudoku</TabsTrigger>
          <TabsTrigger value="twenty-four">24 Game</TabsTrigger>
        </TabsList>
        
        <TabsContent value="word-search">
          <WordSearchGame />
        </TabsContent>
        
        <TabsContent value="crossword">
          <CrosswordGame />
        </TabsContent>
        
        <TabsContent value="times-tables">
          <TimesTablesGame />
        </TabsContent>
        
        <TabsContent value="sudoku">
          <SudokuGame />
        </TabsContent>
        
        <TabsContent value="twenty-four">
          <TwentyFourGame />
        </TabsContent>
      </Tabs>
    </div>
  );
}

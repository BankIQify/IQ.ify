import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { 
  Puzzle, 
  BookOpen, 
  Grid, 
  LayoutGrid, 
  Globe2, 
  Calculator, 
  Brain 
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import { PuzzleManagement } from "./PuzzleManagement";

interface CategoriesTableProps {
  sections?: any[];
}

interface GameCount {
  game_type: string;
  difficulty: Difficulty;
  count: number;
}

export const CategoriesTable = ({ sections }: CategoriesTableProps) => {
  const [puzzleCounts, setPuzzleCounts] = useState<GameCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPuzzleCounts();
  }, []);

  const fetchPuzzleCounts = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_puzzle_counts');

      if (error) throw error;
      
      // If data is null or empty, set an empty array for puzzleCounts
      setPuzzleCounts(data as GameCount[] || []);
      
      // For debugging purposes
      console.log("Puzzle counts data:", data);
    } catch (error) {
      console.error("Error fetching puzzle counts:", error);
      setError("Failed to fetch puzzle counts");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case "word_search": return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "crossword": return <Puzzle className="w-5 h-5 text-purple-500" />;
      case "sudoku": return <Grid className="w-5 h-5 text-green-500" />;
      case "memory": return <LayoutGrid className="w-5 h-5 text-orange-500" />;
      case "geography": return <Globe2 className="w-5 h-5 text-teal-500" />;
      case "times_tables": return <Calculator className="w-5 h-5 text-blue-500" />;
      case "iq_test": return <Brain className="w-5 h-5 text-pink-500" />;
      default: return null;
    }
  };

  const getGameTypeDisplay = (type: string) => {
    switch (type) {
      case "word_search": return "Word Search";
      case "crossword": return "Crossword";
      case "sudoku": return "Sudoku";
      case "memory": return "Memory Game";
      case "geography": return "Geography Quiz";
      case "times_tables": return "Times Tables";
      case "iq_test": return "IQ Test";
      default: return type.replace(/_/g, " ");
    }
  };

  // All the different game types we have in the app
  const allGameTypes = [
    "word_search", 
    "crossword", 
    "sudoku", 
    "memory", 
    "geography", 
    "times_tables", 
    "iq_test"
  ];

  // Generate description for each game type
  const getDescription = (gameType: string) => {
    switch(gameType) {
      case "word_search": 
        return "Find hidden words in a grid of letters.";
      case "crossword": 
        return "Solve word puzzles with interconnected clues.";
      case "sudoku": 
        return "Fill a 9x9 grid with numbers following logical rules.";
      case "memory": 
        return "Match pairs of cards to test your memory.";
      case "geography": 
        return "Test knowledge of countries and flags.";
      case "times_tables": 
        return "Practice multiplication with rapid-fire questions.";
      case "iq_test": 
        return "Test logical reasoning and pattern recognition.";
      default: 
        return "Brain training game.";
    }
  };

  // Determine game status based on type and available puzzles
  const getGameStatus = (gameType: string, totalCount: number) => {
    // Word Search and Crossword need puzzles in the database
    if (gameType === "word_search" || gameType === "crossword") {
      if (totalCount > 0) {
        return (
          <Badge className="bg-green-100 text-green-800">
            {totalCount} puzzles available
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            No puzzles yet
          </Badge>
        );
      }
    } 
    // All other games are generated on-the-fly and don't need database puzzles
    else {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          Ready to play
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-4">
        <PuzzleManagement />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Game Categories & Puzzles</h3>
        
        {/* First table: Categories and sections */}
        {sections && sections.length > 0 && (
          <>
            <h4 className="text-md font-medium mb-2">Question Categories</h4>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-topics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections?.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.name}</TableCell>
                    <TableCell>{section.category}</TableCell>
                    <TableCell>
                      {section.sub_topics?.map((subTopic: any) => subTopic.name).join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {/* Second table: Games and puzzles */}
        <h4 className="text-md font-medium mb-2">Available Games</h4>
        {error ? (
          <div className="p-4 text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        ) : (
          <Table>
            <TableCaption>All brain training games in the application</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Game Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Difficulty Levels</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">Loading game data...</TableCell>
                </TableRow>
              ) : (
                allGameTypes.map((gameType) => {
                  // Get counts for this game type across all difficulties
                  const countsForType = puzzleCounts.filter(item => item.game_type === gameType);
                  const totalCount = countsForType.reduce((sum, item) => sum + item.count, 0);
                  
                  return (
                    <TableRow key={gameType}>
                      <TableCell className="flex items-center gap-2">
                        {getGameIcon(gameType)}
                        <span className="font-medium">{getGameTypeDisplay(gameType)}</span>
                      </TableCell>
                      <TableCell className="max-w-[300px]">{getDescription(gameType)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {["easy", "medium", "hard"].map((difficulty) => {
                            const count = countsForType.find(item => item.difficulty === difficulty)?.count || 0;
                            
                            return (
                              <Badge key={difficulty} variant="outline" className={getDifficultyColor(difficulty)}>
                                {difficulty}: {count}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getGameStatus(gameType, totalCount)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}

        {/* Add a note to explain the game status */}
        <div className="mt-4 text-sm text-gray-500">
          <p>Note: Word Search and Crossword games require puzzle creation, while other games generate puzzles automatically.</p>
        </div>
      </Card>
    </div>
  );
};

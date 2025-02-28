
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Puzzle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PuzzleCount {
  game_type: "word_search" | "crossword";
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

export const PuzzleSummaryTab = () => {
  const [puzzleCounts, setPuzzleCounts] = useState<PuzzleCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuzzleCounts();
  }, []);

  const fetchPuzzleCounts = async () => {
    try {
      // Use a raw SQL query to count and group data
      const { data, error } = await supabase
        .rpc('get_puzzle_counts');

      if (error) {
        // Fallback method if the RPC doesn't exist yet
        console.warn("RPC not available, using alternative count method");
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("game_puzzles")
          .select('game_type, difficulty');
          
        if (fallbackError) throw fallbackError;
        
        // Process the data to count manually
        const counts: PuzzleCount[] = [];
        const countMap = new Map<string, number>();
        
        fallbackData?.forEach(puzzle => {
          const key = `${puzzle.game_type}-${puzzle.difficulty}`;
          countMap.set(key, (countMap.get(key) || 0) + 1);
        });
        
        // Convert the map to our PuzzleCount format
        countMap.forEach((count, key) => {
          const [gameType, difficulty] = key.split('-') as [
            "word_search" | "crossword", 
            "easy" | "medium" | "hard"
          ];
          counts.push({ game_type: gameType, difficulty, count });
        });
        
        setPuzzleCounts(counts);
        return;
      }
      
      setPuzzleCounts(data as PuzzleCount[] || []);
    } catch (error) {
      console.error("Error fetching puzzle counts:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzle counts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600";
      case "medium": return "text-amber-600";
      case "hard": return "text-red-600";
      default: return "";
    }
  };

  const getCountForTypeAndDifficulty = (type: "word_search" | "crossword", difficulty: "easy" | "medium" | "hard") => {
    const count = puzzleCounts.find(
      (item) => item.game_type === type && item.difficulty === difficulty
    );
    return count ? count.count : 0;
  };

  const getGameIcon = (type: "word_search" | "crossword") => {
    switch (type) {
      case "word_search": return <BookOpen className="w-5 h-5 mr-2" />;
      case "crossword": return <Puzzle className="w-5 h-5 mr-2" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableCaption>List of available puzzles by type and difficulty</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Game Type</TableHead>
              <TableHead>Easy</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Hard</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center">
                {getGameIcon("word_search")} Word Search
              </TableCell>
              <TableCell className={getDifficultyColor("easy")}>
                {getCountForTypeAndDifficulty("word_search", "easy")}
              </TableCell>
              <TableCell className={getDifficultyColor("medium")}>
                {getCountForTypeAndDifficulty("word_search", "medium")}
              </TableCell>
              <TableCell className={getDifficultyColor("hard")}>
                {getCountForTypeAndDifficulty("word_search", "hard")}
              </TableCell>
              <TableCell className="font-medium">
                {puzzleCounts
                  .filter(item => item.game_type === "word_search")
                  .reduce((acc, item) => acc + item.count, 0)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center">
                {getGameIcon("crossword")} Crossword
              </TableCell>
              <TableCell className={getDifficultyColor("easy")}>
                {getCountForTypeAndDifficulty("crossword", "easy")}
              </TableCell>
              <TableCell className={getDifficultyColor("medium")}>
                {getCountForTypeAndDifficulty("crossword", "medium")}
              </TableCell>
              <TableCell className={getDifficultyColor("hard")}>
                {getCountForTypeAndDifficulty("crossword", "hard")}
              </TableCell>
              <TableCell className="font-medium">
                {puzzleCounts
                  .filter(item => item.game_type === "crossword")
                  .reduce((acc, item) => acc + item.count, 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

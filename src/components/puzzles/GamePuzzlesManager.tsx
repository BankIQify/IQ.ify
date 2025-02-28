
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Puzzle, BookOpen } from "lucide-react";

interface PuzzleTheme {
  id: string;
  name: string;
  description: string | null;
}

interface PuzzleCount {
  game_type: "word_search" | "crossword";
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

export const GamePuzzlesManager = () => {
  const [themes, setThemes] = useState<PuzzleTheme[]>([]);
  const [puzzleCounts, setPuzzleCounts] = useState<PuzzleCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
    fetchPuzzleCounts();
  }, []);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from("game_themes")
        .select("id, name, description")
        .order("name");

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzle themes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPuzzleCounts = async () => {
    try {
      const { data, error } = await supabase
        .from("game_puzzles")
        .select("game_type, difficulty, count(*)")
        .group("game_type, difficulty");

      if (error) throw error;
      setPuzzleCounts(data as PuzzleCount[] || []);
    } catch (error) {
      console.error("Error fetching puzzle counts:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzle counts. Please try again.",
        variant: "destructive",
      });
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
        </TabsContent>
        
        <TabsContent value="themes">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableCaption>Available themes for puzzle games</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Theme Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        Loading themes...
                      </TableCell>
                    </TableRow>
                  ) : themes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        No themes available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    themes.map((theme) => (
                      <TableRow key={theme.id}>
                        <TableCell className="font-medium">{theme.name}</TableCell>
                        <TableCell>{theme.description || "No description"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

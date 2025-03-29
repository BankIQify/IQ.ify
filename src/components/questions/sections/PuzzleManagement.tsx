import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Users, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PuzzleStats {
  totalPuzzles: number;
  activeUsers: number;
  puzzlesPerUser: number;
  lastGenerated: string | null;
  lowStockThemes: {
    theme: string;
    difficulty: string;
    game_type: string;
    count: number;
    availablePerUser: number;
  }[];
  themeStats: {
    theme: string;
    difficulty: string;
    game_type: string;
    totalPuzzles: number;
    avgPlays: number;
    neverPlayed: number;
    lastPlayed: string | null;
  }[];
}

const GAME_TYPE_LABELS: Record<string, string> = {
  word_search: "Word Search",
  crossword: "Crossword",
  sudoku: "Sudoku",
  memory: "Memory Game",
  puzzle: "Puzzle",
  quiz: "Quiz"
};

export function PuzzleManagement() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<PuzzleStats | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<string>("all");
  const { toast } = useToast();

  const fetchPuzzleStats = async () => {
    try {
      // Get puzzle statistics
      const { data: puzzleStats, error: statsError } = await supabase
        .from('puzzle_statistics')
        .select('*');

      if (statsError) throw statsError;

      // Get themes with low stock
      const { data: lowStock, error: lowStockError } = await supabase
        .rpc('get_low_stock_themes');

      if (lowStockError) throw lowStockError;

      // Calculate active users
      const { count: activeUsers, error: userError } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })
        .filter('last_sign_in_at', 'gte', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (userError) throw userError;

      const lastGenerated = puzzleStats?.[0]?.last_played ?? null;
      const totalPuzzles = puzzleStats?.reduce((sum, stat) => sum + stat.total_puzzles, 0) ?? 0;
      const puzzlesPerUser = totalPuzzles / (activeUsers ?? 1);
      
      setStats({
        totalPuzzles,
        activeUsers: activeUsers ?? 0,
        puzzlesPerUser,
        lastGenerated,
        lowStockThemes: lowStock ?? [],
        themeStats: puzzleStats ?? []
      });
    } catch (error) {
      console.error('Error fetching puzzle stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch puzzle statistics",
        variant: "destructive"
      });
    }
  };

  const handleGeneratePuzzles = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch("/api/generate-puzzles", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          gameType: selectedGameType === "all" ? undefined : selectedGameType
        })
      });

      if (!response.ok) throw new Error("Failed to generate puzzles");

      const result = await response.json();
      
      toast({
        title: "Success",
        description: `Generated ${result.puzzlesGenerated} new puzzles`,
        variant: "default"
      });

      await fetchPuzzleStats();
    } catch (error) {
      console.error("Error generating puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to generate puzzles",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredThemeStats = stats?.themeStats.filter(
    stat => selectedGameType === "all" || stat.game_type === selectedGameType
  ) ?? [];

  const filteredLowStock = stats?.lowStockThemes.filter(
    stat => selectedGameType === "all" || stat.game_type === selectedGameType
  ) ?? [];

  useEffect(() => {
    fetchPuzzleStats();
  }, []);

  const uniqueGameTypes = stats 
    ? Array.from(new Set(stats.themeStats.map(stat => stat.game_type)))
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Puzzle Management</h3>
        <Button 
          onClick={handleGeneratePuzzles} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate New Puzzles"}
        </Button>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Puzzles</div>
              <div className="text-2xl font-bold">{stats.totalPuzzles}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <div className="text-sm text-muted-foreground">Puzzles per User</div>
              </div>
              <div className="text-2xl font-bold">{stats.puzzlesPerUser.toFixed(1)}</div>
              <Progress 
                value={(stats.puzzlesPerUser / 20) * 100} 
                className="mt-2"
              />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Last Generated</div>
              <div className="text-2xl font-bold">
                {stats.lastGenerated 
                  ? new Date(stats.lastGenerated).toLocaleDateString() 
                  : 'Never'}
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6" onValueChange={setSelectedGameType}>
            <TabsList>
              <TabsTrigger value="all">All Games</TabsTrigger>
              {uniqueGameTypes.map(gameType => (
                <TabsTrigger key={gameType} value={gameType}>
                  {GAME_TYPE_LABELS[gameType] || gameType}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {filteredLowStock.length > 0 && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Low Puzzle Stock</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    <ul className="list-disc list-inside">
                      {filteredLowStock.map(({ theme, difficulty, game_type, count, availablePerUser }) => (
                        <li key={`${game_type}-${theme}-${difficulty}`}>
                          {GAME_TYPE_LABELS[game_type] || game_type} - {theme} ({difficulty}): {count} puzzles total, {availablePerUser} per user
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {filteredLowStock.length === 0 && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Puzzle Stock Healthy</AlertTitle>
                  <AlertDescription className="text-green-700">
                    All themes have sufficient puzzles for current user base.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {uniqueGameTypes.map(gameType => (
              <TabsContent key={gameType} value={gameType} className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {filteredThemeStats
                    .filter(stat => stat.game_type === gameType)
                    .map((stat) => (
                      <div 
                        key={`${stat.game_type}-${stat.theme}-${stat.difficulty}`}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{stat.theme}</h5>
                            <span className="text-sm text-muted-foreground">{stat.difficulty}</span>
                          </div>
                          <Badge 
                            variant={stat.avgPlays > 5 ? "default" : "outline"}
                            className="ml-2"
                          >
                            {stat.avgPlays.toFixed(1)} avg plays
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Puzzles:</span>
                            <span className="ml-2 font-medium">{stat.totalPuzzles}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Never Played:</span>
                            <span className="ml-2 font-medium">{stat.neverPlayed}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Per User:</span>
                            <span className="ml-2 font-medium">
                              {(stat.totalPuzzles / stats.activeUsers).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
} 
import { Fragment, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface StatsResponse {
  total_puzzles: number;
  active_users: number;
  puzzles_per_user: number;
  last_generated: string | null;
  low_stock_themes: string; // JSON string
  theme_stats: string; // JSON string
}

interface ThemeStats {
  name: string;
  game_type: string;
  difficulty: string;
  created_at: string;
  last_played: string | null;
}

interface LowStockTheme {
  theme: string;
  difficulty: string;
  availablePerUser: number;
}

const GAME_TYPE_LABELS: Record<string, string> = {
  word_search: "Word Search",
  crossword: "Crossword",
  memory: "Memory Game",
  puzzle: "Puzzle",
  quiz: "Quiz",
  spot_the_difference: "Spot the Difference",
  trivia: "Trivia"
};

export function PuzzleManagement() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<string>("all");
  const { toast } = useToast();

  const filteredThemeStats = stats?.theme_stats ? JSON.parse(stats.theme_stats) as ThemeStats[] : [];
  const filteredLowStock = stats?.low_stock_themes ? JSON.parse(stats.low_stock_themes) as LowStockTheme[] : [];
  const uniqueGameTypes = stats ? Array.from(new Set(filteredThemeStats.map(stat => stat.game_type))) : [];

  const handleGeneratePuzzles = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-puzzles", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          gameType: selectedGameType === "all" ? undefined : selectedGameType
        })
      });

      if (!response.ok) throw new Error('Failed to generate puzzles');

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

  const fetchPuzzleStats = async () => {
    try {
      const { data, error } = await supabase
        .from('puzzle_stats')
        .select('*')
        .single();

      if (error) throw error;

      setStats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch puzzle stats",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPuzzleStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Puzzle Management</h2>
        <Button
          onClick={handleGeneratePuzzles}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <Fragment>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </Fragment>
          ) : (
            'Generate Puzzles'
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total Puzzles</div>
              <div className="font-medium">{stats?.total_puzzles}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="font-medium">{stats?.active_users}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Puzzles per User</div>
              <div className="font-medium">{stats?.puzzles_per_user}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Last Generated</div>
              <div className="font-medium">{stats?.last_generated}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Low Stock Themes</h3>
          <div className="space-y-4">
            {filteredLowStock.map((theme, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {theme.theme} ({theme.difficulty})
                </div>
                <div className="font-medium">{theme.availablePerUser}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Puzzles</TabsTrigger>
          {uniqueGameTypes.map((gameType) => (
            <TabsTrigger key={gameType} value={gameType}>
              {GAME_TYPE_LABELS[gameType] || gameType}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="game-type">Game Type</Label>
            <Select
              value={selectedGameType}
              onValueChange={setSelectedGameType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a game type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueGameTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {GAME_TYPE_LABELS[type] || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredThemeStats
              .filter(stat => selectedGameType === "all" || stat.game_type === selectedGameType)
              .map((stat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{stat.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-muted-foreground">
                        {GAME_TYPE_LABELS[stat.game_type] || stat.game_type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Created</span>
                      <span>{new Date(stat.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last Played</span>
                      <span>{stat.last_played ? new Date(stat.last_played).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
        {uniqueGameTypes.map(gameType => (
          <TabsContent key={gameType} value={gameType} className="space-y-4">
            <div className="space-y-4">
              {filteredThemeStats
                .filter(stat => stat.game_type === gameType)
                .map((stat, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{stat.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground">
                          {GAME_TYPE_LABELS[stat.game_type] || stat.game_type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created</span>
                        <span>{new Date(stat.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Last Played</span>
                        <span>{stat.last_played ? new Date(stat.last_played).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
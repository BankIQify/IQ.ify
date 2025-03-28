
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AddThemeDialog } from "./AddThemeDialog";
import { Palette, Loader2 } from "lucide-react";

interface PuzzleTheme {
  id: string;
  name: string;
  description: string | null;
}

export const ThemesManagerTab = () => {
  const [themes, setThemes] = useState<PuzzleTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
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

  const getThemeBackground = (index: number) => {
    const colors = ['bg-pastel-blue/40', 'bg-pastel-purple/40', 'bg-pastel-green/40', 'bg-pastel-yellow/40', 'bg-pastel-peach/40'];
    return colors[index % colors.length];
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-pastel-gray/50">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Available Themes</h3>
          </div>
          <AddThemeDialog onThemeAdded={fetchThemes} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading themes...</span>
          </div>
        ) : themes.length === 0 ? (
          <div className="text-center py-12 bg-pastel-gray/30 rounded-lg">
            <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No themes available yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first theme to get started!</p>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableCaption>Available themes for puzzle games</TableCaption>
              <TableHeader className="bg-pastel-purple/20">
                <TableRow>
                  <TableHead className="font-semibold">Theme Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {themes.map((theme, index) => (
                  <TableRow key={theme.id} className={`${getThemeBackground(index)} hover:bg-pastel-blue/60 transition-colors`}>
                    <TableCell className="font-medium">{theme.name}</TableCell>
                    <TableCell>{theme.description || "No description"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

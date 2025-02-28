
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-end mb-4">
          <AddThemeDialog onThemeAdded={fetchThemes} />
        </div>
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
  );
};

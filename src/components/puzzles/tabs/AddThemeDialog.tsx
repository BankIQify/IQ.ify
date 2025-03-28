
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AddThemeDialogProps {
  onThemeAdded: () => void;
}

export const AddThemeDialog = ({ onThemeAdded }: AddThemeDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeDescription, setNewThemeDescription] = useState("");

  const addNewTheme = async () => {
    if (!newThemeName.trim()) {
      toast({
        title: "Error",
        description: "Theme name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("game_themes")
        .insert([{ 
          name: newThemeName.trim(), 
          description: newThemeDescription.trim() || null 
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Theme added successfully",
      });

      // Reset form and close dialog
      setNewThemeName("");
      setNewThemeDescription("");
      setShowDialog(false);
      onThemeAdded();
    } catch (error) {
      console.error("Error adding theme:", error);
      toast({
        title: "Error",
        description: "Failed to add theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Theme</DialogTitle>
          <DialogDescription>
            Create a new theme for puzzle games. Themes are used to categorize puzzles.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="themeName" className="text-right">
              Name
            </Label>
            <Input
              id="themeName"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="themeDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="themeDescription"
              value={newThemeDescription}
              onChange={(e) => setNewThemeDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={addNewTheme}>Save Theme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

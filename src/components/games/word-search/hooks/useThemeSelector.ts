
import { useState, useEffect } from "react";
import { fetchThemes } from "../utils/puzzleDataFetcher";
import { toast } from "@/components/ui/use-toast";

export const useThemeSelector = () => {
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeThemes = async () => {
      try {
        const themesData = await fetchThemes();
        setThemes(themesData);
        
        if (themesData.length > 0) {
          setSelectedTheme(themesData[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error initializing themes:", error);
        toast({
          title: "Error",
          description: "Failed to load game themes. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    initializeThemes();
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  return {
    themes,
    selectedTheme,
    loading,
    handleSelectTheme,
  };
};

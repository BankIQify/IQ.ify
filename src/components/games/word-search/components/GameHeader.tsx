import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWordSearchContext } from "../context/WordSearchContext";
import type { Difficulty } from "@/components/games/GameSettings";
import { cn } from "@/lib/utils";

const difficulties = [
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Challenging", value: "challenging" },
];

const themes = [
  { 
    label: "Animals", 
    value: "animals",
    gradient: "from-green-500 to-emerald-500",
    hoverGradient: "hover:from-green-600 hover:to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
  },
  { 
    label: "Sports", 
    value: "sports",
    gradient: "from-orange-500 to-amber-500",
    hoverGradient: "hover:from-orange-600 hover:to-amber-600",
    bgGradient: "from-orange-50 to-amber-50",
  },
  { 
    label: "Space", 
    value: "space",
    gradient: "from-purple-500 to-indigo-500",
    hoverGradient: "hover:from-purple-600 hover:to-indigo-600",
    bgGradient: "from-purple-50 to-indigo-50",
  },
  { 
    label: "Nature", 
    value: "nature",
    gradient: "from-emerald-500 to-teal-500",
    hoverGradient: "hover:from-emerald-600 hover:to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  { 
    label: "Music", 
    value: "music",
    gradient: "from-pink-500 to-rose-500",
    hoverGradient: "hover:from-pink-600 hover:to-rose-600",
    bgGradient: "from-pink-50 to-rose-50",
  },
  { 
    label: "Technology", 
    value: "technology",
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "hover:from-blue-600 hover:to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  { 
    label: "Ocean", 
    value: "ocean",
    gradient: "from-cyan-500 to-blue-500",
    hoverGradient: "hover:from-cyan-600 hover:to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
  },
  { 
    label: "Weather", 
    value: "weather",
    gradient: "from-sky-500 to-indigo-500",
    hoverGradient: "hover:from-sky-600 hover:to-indigo-600",
    bgGradient: "from-sky-50 to-indigo-50",
  },
  { 
    label: "Countries", 
    value: "countries",
    gradient: "from-blue-500 to-indigo-500",
    hoverGradient: "hover:from-blue-600 hover:to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  { 
    label: "Food", 
    value: "food",
    gradient: "from-orange-500 to-red-500",
    hoverGradient: "hover:from-orange-600 hover:to-red-600",
    bgGradient: "from-orange-50 to-red-50",
  },
  { 
    label: "Colors", 
    value: "colors",
    gradient: "from-violet-500 to-fuchsia-500",
    hoverGradient: "hover:from-violet-600 hover:to-fuchsia-600",
    bgGradient: "from-violet-50 to-fuchsia-50",
  },
  { 
    label: "Jobs", 
    value: "jobs",
    gradient: "from-amber-500 to-yellow-500",
    hoverGradient: "hover:from-amber-600 hover:to-yellow-600",
    bgGradient: "from-amber-50 to-yellow-50",
  },
  { 
    label: "Emotions", 
    value: "emotions",
    gradient: "from-rose-500 to-pink-500",
    hoverGradient: "hover:from-rose-600 hover:to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
  },
  { 
    label: "Fantasy", 
    value: "fantasy",
    gradient: "from-purple-500 to-pink-500",
    hoverGradient: "hover:from-purple-600 hover:to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
  },
  { 
    label: "Science", 
    value: "science",
    gradient: "from-teal-500 to-cyan-500",
    hoverGradient: "hover:from-teal-600 hover:to-cyan-600",
    bgGradient: "from-teal-50 to-cyan-50",
  },
];

export const GameHeader = () => {
  const { difficulty, theme, handleNewPuzzle, foundWords, words } = useWordSearchContext();

  const progress = words.length > 0 ? (foundWords.length / words.length) * 100 : 0;
  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className={cn(
      "flex flex-col gap-4 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      `bg-gradient-to-br ${currentTheme.bgGradient}`
    )}>
      <div className="flex flex-wrap gap-4">
        <Select
          value={difficulty}
          onValueChange={(value) => handleNewPuzzle(value as "easy" | "moderate" | "challenging")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={theme}
          onValueChange={(value) => handleNewPuzzle(difficulty, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => handleNewPuzzle()}
          className={cn(
            "text-white",
            `bg-gradient-to-r ${currentTheme.gradient}`,
            currentTheme.hoverGradient
          )}
        >
          New Puzzle
        </Button>
      </div>

      <motion.div
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 p-4 rounded-lg bg-white/80 shadow-sm">
          <h3 className="text-sm font-medium">Progress</h3>
          <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full",
                `bg-gradient-to-r ${currentTheme.gradient}`
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {foundWords.length} of {words.length} words found
          </p>
        </div>
      </motion.div>
    </div>
  );
};

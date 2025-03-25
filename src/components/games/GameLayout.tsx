
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, RotateCcw, Settings, Trophy, Brain } from "lucide-react";
import type { Difficulty } from "@/components/games/GameSettings";

interface GameLayoutProps {
  title: string;
  description?: string;
  score?: number;
  timer?: number;
  showSettings?: boolean;
  difficulty: Difficulty;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onDifficultyChange?: (difficulty: Difficulty) => void;
  settingsContent?: ReactNode;
  children: ReactNode;
}

export const GameLayout = ({
  title,
  description,
  score = 0,
  timer,
  showSettings = true,
  difficulty,
  onStart,
  onPause,
  onReset,
  onDifficultyChange,
  settingsContent,
  children,
}: GameLayoutProps) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "bg-pastel-green border-green-300";
      case "medium":
        return "bg-pastel-yellow border-yellow-300";
      case "hard":
        return "bg-pastel-orange border-orange-300";
      default:
        return "bg-pastel-blue border-blue-300";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="w-full border-2 border-pastel-blue rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-white to-pastel-gray/10">
        <CardHeader className="space-y-3 bg-gradient-to-r from-pastel-blue/60 to-pastel-purple/60 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-md">
                <Brain className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-iqify-navy">{title}</CardTitle>
                {description && (
                  <p className="text-sm text-iqify-navy/80">{description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`text-sm font-bold px-3 py-1.5 rounded-full border ${getDifficultyColor()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
              
              {timer !== undefined && (
                <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-pastel-blue/30">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-bold">{timer}s</span>
                </div>
              )}
              
              {score > 0 && (
                <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-pastel-blue/30">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{score}</span>
                </div>
              )}
              
              {onReset && (
                <Button variant="ghost" size="icon" onClick={onReset} className="rounded-full hover:bg-white/80">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {showSettings && settingsContent ? (
          <Tabs defaultValue="game" className="w-full">
            <div className="px-6 bg-gradient-to-r from-pastel-blue/30 to-pastel-purple/30">
              <TabsList className="bg-white/60 p-1 rounded-xl">
                <TabsTrigger value="game" className="data-[state=active]:bg-white rounded-lg">Game</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-white rounded-lg">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="game" className="animate-fadeIn mt-0">
              <CardContent className="pt-6">{children}</CardContent>
            </TabsContent>
            <TabsContent value="settings" className="animate-fadeIn mt-0">
              <CardContent className="pt-6">{settingsContent}</CardContent>
            </TabsContent>
          </Tabs>
        ) : (
          <CardContent className="pt-6 animate-fadeIn">{children}</CardContent>
        )}
      </Card>
    </div>
  );
};


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
  onReset?: () => void;
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
  onReset,
  settingsContent,
  children,
}: GameLayoutProps) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "bg-pastel-green";
      case "medium":
        return "bg-pastel-yellow";
      case "hard":
        return "bg-pastel-orange";
      default:
        return "bg-pastel-blue";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="w-full border-none shadow-lg overflow-hidden bg-gradient-to-br from-white to-pastel-gray/20">
        <CardHeader className="space-y-2 bg-gradient-to-r from-pastel-blue/50 to-pastel-purple/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
              
              {timer !== undefined && (
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{timer}s</span>
                </div>
              )}
              
              {score > 0 && (
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{score}</span>
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
            <div className="px-6 bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20">
              <TabsList className="bg-white/50">
                <TabsTrigger value="game" className="data-[state=active]:bg-white">Game</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-white">
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

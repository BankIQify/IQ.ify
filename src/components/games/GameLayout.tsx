
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, RotateCcw, Settings } from "lucide-react";

interface GameLayoutProps {
  title: string;
  description?: string;
  score?: number;
  timer?: number;
  showSettings?: boolean;
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
  onReset,
  settingsContent,
  children,
}: GameLayoutProps) => {
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <div className="flex items-center gap-4">
              {timer !== undefined && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{timer}s</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Score:</span>
                <span>{score}</span>
              </div>
              {onReset && (
                <Button variant="ghost" size="icon" onClick={onReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>

        {showSettings && settingsContent ? (
          <Tabs defaultValue="game">
            <div className="px-6">
              <TabsList>
                <TabsTrigger value="game">Game</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="game">
              <CardContent>{children}</CardContent>
            </TabsContent>
            <TabsContent value="settings">
              <CardContent>{settingsContent}</CardContent>
            </TabsContent>
          </Tabs>
        ) : (
          <CardContent>{children}</CardContent>
        )}
      </Card>
    </div>
  );
};

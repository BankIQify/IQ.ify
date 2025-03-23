
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSelector } from "./TableSelector";
import { TimeLimitSelector } from "./TimeLimitSelector";
import type { GameControlsProps } from "./types";

/**
 * GameControls component provides the initial setup interface for the Times Tables game.
 * It allows users to select which times tables to practice and set a time limit
 * before starting the game.
 */
export const GameControls = ({
  selectedTables,
  timeLimit,
  onToggleTable,
  onTimeLimitChange,
  onStart
}: GameControlsProps) => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20 shadow-sm space-y-6">
      {/* Game title and description */}
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 text-primary mx-auto mb-2" />
        <h2 className="text-2xl font-bold">Times Tables Challenge</h2>
        <p className="text-muted-foreground">Test your multiplication and division skills</p>
      </div>
      
      {/* Times tables selection grid */}
      <TableSelector
        selectedTables={selectedTables}
        onToggleTable={onToggleTable}
      />
      
      {/* Time limit selection */}
      <TimeLimitSelector
        timeLimit={timeLimit}
        onTimeLimitChange={onTimeLimitChange}
      />
      
      {/* Start game button */}
      <Button 
        onClick={onStart}
        className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90 text-white transition-all"
        size="lg"
      >
        Start Challenge
      </Button>
    </div>
  );
};

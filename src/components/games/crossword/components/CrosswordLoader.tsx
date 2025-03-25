
import { Loader2 } from "lucide-react";

export const CrosswordLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">Loading puzzles...</p>
    </div>
  );
};

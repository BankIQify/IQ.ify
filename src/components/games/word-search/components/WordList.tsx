
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WordToFind } from "../types";

interface WordListProps {
  words: WordToFind[];
  checkSelection: () => void;
  selectedCellsCount: number;
}

export const WordList = ({ 
  words, 
  checkSelection,
  selectedCellsCount
}: WordListProps) => {
  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-pastel-blue/30 to-pastel-purple/30 border-b">
        <h3 className="text-xl font-semibold">Words to Find</h3>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {words.map(({ word, found }) => (
            <div
              key={word}
              className={cn(
                "px-4 py-2 rounded-full border transition-all duration-300",
                found 
                  ? "bg-pastel-green/30 border-pastel-green text-green-700 line-through" 
                  : "border-slate-200 hover:border-pastel-purple/50 hover:bg-pastel-purple/5"
              )}
            >
              {word}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={checkSelection} 
          className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue text-white hover:opacity-90"
          disabled={selectedCellsCount < 2}
        >
          <Check className="h-4 w-4 mr-2" />
          Check Selection
        </Button>
      </CardContent>
    </Card>
  );
};


import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWordSearchContext } from "../context/WordSearchContext";

export const WordList = () => {
  const { words, checkSelection, selectedCells } = useWordSearchContext();
  const selectedCellsCount = selectedCells.length;

  return (
    <Card className="border-2 border-pastel-purple rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-pastel-blue/30 to-pastel-purple/30 border-b-2 border-pastel-purple/30">
        <h3 className="text-xl font-bold text-iqify-navy">Words to Find</h3>
      </div>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-3 mb-6">
          {words.map(({ word, found }) => (
            <div
              key={word}
              className={cn(
                "px-4 py-2 rounded-full border-2 transition-all duration-300",
                found 
                  ? "bg-pastel-green/40 border-pastel-green text-green-700 line-through font-bold" 
                  : "border-slate-200 hover:border-pastel-purple/50 hover:bg-pastel-purple/10 hover:scale-105"
              )}
            >
              {found && <Star className="h-3 w-3 inline-block mr-1 text-yellow-500" />}
              {word}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={checkSelection} 
          className={cn(
            "w-full bg-gradient-to-r from-pastel-purple to-pastel-blue text-white hover:opacity-90 p-6 h-auto text-lg font-bold rounded-xl shadow-md",
            selectedCellsCount < 2 && "opacity-70"
          )}
          disabled={selectedCellsCount < 2}
        >
          <Check className="h-5 w-5 mr-2" />
          Check Selection
        </Button>
      </CardContent>
    </Card>
  );
};

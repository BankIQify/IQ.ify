
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWordSearchContext } from "../context/WordSearchContext";

export const WordList = () => {
  const { words, checkSelection, selectedCells } = useWordSearchContext();
  const selectedCellsCount = selectedCells.length;

  // Group words by found status
  const foundWords = words.filter(w => w.found);
  const notFoundWords = words.filter(w => !w.found);
  
  return (
    <Card className="border-2 border-pastel-purple rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-pastel-blue/30 to-pastel-purple/30 border-b-2 border-pastel-purple/30">
        <h3 className="text-xl font-bold text-iqify-navy">Words to Find</h3>
        <div className="flex items-center mt-1">
          <div className="text-sm font-medium text-iqify-navy">
            <span className="text-green-600 font-bold">{foundWords.length}</span> of <span>{words.length}</span> found
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-3 mb-6">
          {notFoundWords.map(({ word }) => (
            <div
              key={word}
              className="px-4 py-2 rounded-full border-2 border-slate-200 hover:border-pastel-purple/50 hover:bg-pastel-purple/10 hover:scale-105 transition-all duration-300"
            >
              {word}
            </div>
          ))}
          
          {foundWords.length > 0 && (
            <div className="w-full mt-2 pt-2 border-t border-dashed border-pastel-purple/30">
              <p className="text-sm text-iqify-navy/70 mb-2">Found words:</p>
              <div className="flex flex-wrap gap-2">
                {foundWords.map(({ word }) => (
                  <div
                    key={word}
                    className="px-3 py-1 rounded-full bg-pastel-green/40 border-pastel-green text-green-700 line-through font-bold text-sm flex items-center"
                  >
                    <Star className="h-3 w-3 inline-block mr-1 text-yellow-500" />
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}
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

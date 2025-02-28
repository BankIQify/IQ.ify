
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TwentyFourPuzzlesManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzleCount, setPuzzleCount] = useState(10);
  const [generatedPuzzles, setGeneratedPuzzles] = useState<any[]>([]);
  const { toast } = useToast();

  const handleGeneratePuzzles = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-24-puzzles", {
        body: {
          count: puzzleCount,
          difficulty,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setGeneratedPuzzles(data.puzzles);
        
        // Insert the generated puzzles to the challenges table
        const formattedPuzzles = data.puzzles.map((puzzle: any) => ({
          number1: puzzle.numbers[0],
          number2: puzzle.numbers[1],
          number3: puzzle.numbers[2],
          number4: puzzle.numbers[3],
          solution: puzzle.solution
        }));
        
        // Insert into challenges table
        const { error: insertError } = await supabase
          .from('challenges')
          .insert(formattedPuzzles);
          
        if (insertError) {
          console.error("Error inserting puzzles:", insertError);
          toast({
            title: "Error",
            description: "Generated puzzles but failed to save them to the database.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: `Generated and saved ${data.puzzles.length} new 24 Game puzzles`,
          });
        }
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error generating puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to generate puzzles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate 24 Game Puzzles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty
              </label>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value)}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="count" className="text-sm font-medium">
                Number of Puzzles
              </label>
              <Select
                value={puzzleCount.toString()}
                onValueChange={(value) => setPuzzleCount(parseInt(value))}
              >
                <SelectTrigger id="count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGeneratePuzzles} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating Puzzles..." : "Generate Puzzles"}
          </Button>
        </CardContent>
      </Card>

      {generatedPuzzles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Puzzles</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono text-sm h-60"
              readOnly
              value={JSON.stringify(generatedPuzzles, null, 2)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

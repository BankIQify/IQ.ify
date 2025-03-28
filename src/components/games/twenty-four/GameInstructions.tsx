
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const GameInstructions = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <h2 className="text-xl font-bold">24 Game</h2>
      <p className="text-gray-500 text-center max-w-md">
        Using only addition, subtraction, multiplication, and division, make the number 24 from the four numbers on the cards. Use each number exactly once.
      </p>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mt-2">
            How to Play
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h3 className="font-medium">How to Play</h3>
            <p className="text-sm">
              1. You'll be shown four numbers from 1-10.
            </p>
            <p className="text-sm">
              2. Your goal is to use all four numbers exactly once with basic operations (+, -, *, /) to make 24.
            </p>
            <p className="text-sm">
              3. You can use parentheses to control the order of operations.
            </p>
            <p className="text-sm">
              4. Example: For cards 3, 4, 6, and 8, one solution is: (8 / 4) * (6 + 3) = 2 * 9 = 18
            </p>
            <p className="text-sm font-medium">
              Scoring:
            </p>
            <p className="text-sm">
              • +10 points for each correct solution
            </p>
            <p className="text-sm">
              • -3 points for skipping a puzzle
            </p>
            <p className="text-sm">
              • -5 points for viewing the solution
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

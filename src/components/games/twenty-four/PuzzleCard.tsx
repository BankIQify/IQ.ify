
import { Card, CardContent } from "@/components/ui/card";

interface PuzzleCardProps {
  number: number;
}

export const PuzzleCard = ({ number }: PuzzleCardProps) => {
  return (
    <Card className="h-24 w-16 sm:h-32 sm:w-24 flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-shadow border-2">
      <CardContent className="p-0 flex items-center justify-center h-full">
        <span className="text-3xl sm:text-5xl font-bold">{number}</span>
      </CardContent>
    </Card>
  );
};

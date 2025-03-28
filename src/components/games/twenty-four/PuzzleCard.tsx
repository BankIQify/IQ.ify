
interface PuzzleCardProps {
  number: number;
}

export const PuzzleCard = ({ number }: PuzzleCardProps) => {
  return (
    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-md text-2xl font-bold text-purple-700 border-2 border-purple-200 transition-transform hover:scale-105">
      {number}
    </div>
  );
};

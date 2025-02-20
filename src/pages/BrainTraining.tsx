
import { Card } from "@/components/ui/card";
import {
  Puzzle,
  Timer,
  Search,
  Shapes,
  Lightbulb,
  Calculator,
} from "lucide-react";

const BrainTraining = () => {
  const games = [
    {
      icon: <Puzzle className="w-8 h-8 text-education-600" />,
      title: "Memory Games",
      description: "Enhance your short-term memory with fun matching exercises",
    },
    {
      icon: <Shapes className="w-8 h-8 text-education-600" />,
      title: "Pattern Recognition",
      description: "Improve your ability to identify and complete patterns",
    },
    {
      icon: <Search className="w-8 h-8 text-education-600" />,
      title: "Word Search",
      description: "Find hidden words and enhance your vocabulary",
    },
    {
      icon: <Calculator className="w-8 h-8 text-education-600" />,
      title: "Math Challenges",
      description: "Practice quick calculations and numerical reasoning",
    },
    {
      icon: <Timer className="w-8 h-8 text-education-600" />,
      title: "Speed Games",
      description: "Test and improve your reaction time",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-education-600" />,
      title: "Logic Puzzles",
      description: "Challenge yourself with engaging brain teasers",
    },
  ];

  return (
    <div className="page-container">
      <h1 className="section-title">Brain Training Games</h1>
      <div className="grid-responsive">
        {games.map((game, index) => (
          <Card key={index} className="p-6 card-hover cursor-pointer">
            <div className="mb-4">{game.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
            <p className="text-gray-600">{game.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrainTraining;

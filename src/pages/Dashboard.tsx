
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { IceCreamCone, Candy, Star, Rainbow } from "lucide-react";

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      icon: <IceCreamCone className="w-12 h-12 text-pastel-pink" />,
      title: "Verbal Reasoning",
      description: "Track your word wizardry progress!",
      bgColor: "bg-pastel-pink",
    },
    {
      icon: <Star className="w-12 h-12 text-pastel-yellow" />,
      title: "Non-Verbal Reasoning",
      description: "Watch your pattern powers grow!",
      bgColor: "bg-pastel-yellow",
    },
    {
      icon: <Candy className="w-12 h-12 text-pastel-purple" />,
      title: "Recent Achievements",
      description: "See your awesome progress!",
      bgColor: "bg-pastel-purple",
    },
    {
      icon: <Rainbow className="w-12 h-12 text-pastel-blue" />,
      title: "Learning Journey",
      description: "Your path to success!",
      bgColor: "bg-pastel-blue",
    },
  ];

  return (
    <div className="page-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue bg-clip-text text-transparent mb-4">
          Your Learning Adventure
        </h1>
        <p className="text-lg text-gray-600">Let's make learning fun together! 🌟</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              hoveredCard === index ? 'shadow-lg' : 'shadow-md'
            }`}
            style={{
              background: `linear-gradient(135deg, white 0%, ${
                hoveredCard === index ? card.bgColor : 'white'
              } 100%)`,
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`animate-float`}>{card.icon}</div>
              <h2 className="text-xl font-bold">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="p-6 bg-gradient-pastel">
          <h3 className="text-xl font-bold mb-4">Daily Challenge 🎯</h3>
          <p className="text-gray-600">
            Complete today's fun challenge to earn special rewards!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

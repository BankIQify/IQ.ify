
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { IceCreamCone, Candy, Star, Rainbow } from "lucide-react";

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      icon: <IceCreamCone className="w-16 h-16 text-pastel-pink" />,
      title: "Verbal Reasoning",
      description: "Track your word wizardry progress!",
      bgColor: "bg-pastel-pink",
      gradient: "from-pastel-pink to-white",
    },
    {
      icon: <Star className="w-16 h-16 text-pastel-yellow" />,
      title: "Non-Verbal Reasoning",
      description: "Watch your pattern powers grow!",
      bgColor: "bg-pastel-yellow",
      gradient: "from-pastel-yellow to-white",
    },
    {
      icon: <Candy className="w-16 h-16 text-pastel-purple" />,
      title: "Recent Achievements",
      description: "See your awesome progress!",
      bgColor: "bg-pastel-purple",
      gradient: "from-pastel-purple to-white",
    },
    {
      icon: <Rainbow className="w-16 h-16 text-pastel-blue" />,
      title: "Learning Journey",
      description: "Your path to success!",
      bgColor: "bg-pastel-blue",
      gradient: "from-pastel-blue to-white",
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
            className={`p-8 transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-sm bg-opacity-60 ${
              hoveredCard === index ? 'shadow-xl' : 'shadow-md'
            }`}
            style={{
              background: `linear-gradient(135deg, ${
                hoveredCard === index 
                ? `var(--${card.bgColor.split('-')[1]})` 
                : 'rgba(255, 255, 255, 0.8)'
              } 0%, rgba(255, 255, 255, 0.95) 100%)`,
              borderColor: `var(--${card.bgColor.split('-')[1]})`,
              borderWidth: '2px',
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`p-4 rounded-full bg-opacity-20 ${card.bgColor} animate-float`}>
                {card.icon}
              </div>
              <h2 className="text-2xl font-bold">{card.title}</h2>
              <p className="text-gray-600 text-lg">{card.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="p-6 bg-gradient-to-r from-pastel-yellow/20 to-pastel-pink/20 border-2 border-pastel-pink">
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

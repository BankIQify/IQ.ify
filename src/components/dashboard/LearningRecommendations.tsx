
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LearningRecommendations = () => {
  // Mock recommendations - in a real app these would be generated based on user performance
  const recommendations = [
    {
      title: "Pattern Recognition Test",
      type: "Non-Verbal Reasoning",
      icon: Target,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      link: "/lets-practice",
    },
    {
      title: "Vocabulary Builder",
      type: "Verbal Reasoning",
      icon: BookOpen,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      link: "/lets-practice",
    },
    {
      title: "Memory Game Challenge",
      type: "Brain Training",
      icon: Zap,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      link: "/brain-training",
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-md border ${rec.bgColor} flex items-start gap-3`}
            >
              <div className="p-2 rounded-full bg-white">
                <rec.icon className={`h-4 w-4 ${rec.iconColor}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{rec.type}</p>
                <Link to={rec.link}>
                  <Button variant="outline" size="sm" className="mt-1">
                    Start Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

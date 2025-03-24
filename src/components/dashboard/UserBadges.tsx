
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Brain, Target, TrendingUp, Star, BookOpen, CheckCircle, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Placeholder badge data - in a real app this would come from an API/database
const badges = {
  earned: [
    { id: 1, name: "First Test Completed", icon: BookOpen, color: "text-blue-500", date: "Feb 12, 2023", description: "Completed your first practice test" },
    { id: 2, name: "Brain Trainer", icon: Brain, color: "text-purple-500", date: "Mar 5, 2023", description: "Played 5 different brain training games" },
    { id: 3, name: "Perfect Score", icon: Award, color: "text-amber-500", date: "Apr 18, 2023", description: "Achieved 100% on any practice test" },
    { id: 4, name: "Consistent Learner", icon: Target, color: "text-green-500", date: "May 2, 2023", description: "Used the platform for 7 consecutive days" },
  ],
  available: [
    { id: 5, name: "Verbal Master", icon: BookOpen, color: "text-blue-300", description: "Complete 10 verbal reasoning tests with an average score of 80% or higher" },
    { id: 6, name: "Non-verbal Expert", icon: CheckCircle, color: "text-green-300", description: "Complete 10 non-verbal reasoning tests with an average score of 80% or higher" },
    { id: 7, name: "Champion", icon: Shield, color: "text-gray-300", description: "Achieve a top 10 position on any leaderboard" },
    { id: 8, name: "Helping Hand", icon: Star, color: "text-amber-300", description: "Contribute to the community by sharing study tips" },
  ]
};

export const UserBadges = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="earned">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earned">Earned ({badges.earned.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({badges.available.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earned" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {badges.earned.map(badge => (
                <div key={badge.id} className="flex flex-col items-center p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <div className={`p-3 rounded-full bg-gray-100 mb-3 ${badge.color}`}>
                    <badge.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-medium">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{badge.date}</p>
                  <p className="text-xs mt-2">{badge.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {badges.available.map(badge => (
                <div key={badge.id} className="flex flex-col items-center p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors opacity-70">
                  <div className={`p-3 rounded-full bg-gray-100 mb-3 ${badge.color}`}>
                    <badge.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-medium">{badge.name}</h4>
                  <p className="text-xs mt-2">{badge.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

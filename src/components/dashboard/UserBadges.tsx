
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Brain, Target, TrendingUp, Star, BookOpen, CheckCircle, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorfulBadge } from "@/components/ui/child-friendly/ColorfulBadge";

// Placeholder badge data - in a real app this would come from an API/database
const badges = {
  earned: [
    { id: 1, name: "First Test Completed", icon: BookOpen, color: "blue", date: "Feb 12, 2023", description: "Completed your first practice test" },
    { id: 2, name: "Brain Trainer", icon: Brain, color: "purple", date: "Mar 5, 2023", description: "Played 5 different brain training games" },
    { id: 3, name: "Perfect Score", icon: Award, color: "amber", date: "Apr 18, 2023", description: "Achieved 100% on any practice test" },
    { id: 4, name: "Consistent Learner", icon: Target, color: "green", date: "May 2, 2023", description: "Used the platform for 7 consecutive days" },
  ],
  available: [
    { id: 5, name: "Verbal Master", icon: BookOpen, color: "teal", description: "Complete 10 verbal reasoning tests with an average score of 80% or higher" },
    { id: 6, name: "Non-verbal Expert", icon: CheckCircle, color: "green", description: "Complete 10 non-verbal reasoning tests with an average score of 80% or higher" },
    { id: 7, name: "Champion", icon: Shield, color: "blue", description: "Achieve a top 10 position on any leaderboard" },
    { id: 8, name: "Helping Hand", icon: Star, color: "pink", description: "Contribute to the community by sharing study tips" },
  ]
};

export const UserBadges = () => {
  return (
    <Card className="h-full bg-gradient-to-b from-teal-50 to-green-50 border-teal-100">
      <CardHeader>
        <CardTitle className="text-teal-700">Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="earned">
          <TabsList className="grid w-full grid-cols-2 bg-teal-100/50">
            <TabsTrigger value="earned" className="data-[state=active]:bg-teal-200 data-[state=active]:text-teal-800">Earned ({badges.earned.length})</TabsTrigger>
            <TabsTrigger value="available" className="data-[state=active]:bg-teal-200 data-[state=active]:text-teal-800">Available ({badges.available.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earned" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {badges.earned.map(badge => (
                <div key={badge.id} className="flex flex-col items-center p-4 bg-white rounded-lg text-center hover:shadow-md transition-all transform hover:-translate-y-1 border-2 border-teal-100">
                  <ColorfulBadge 
                    icon={badge.icon} 
                    label={badge.name} 
                    color={badge.color as any}
                  />
                  <p className="text-xs text-muted-foreground mt-3">{badge.date}</p>
                  <p className="text-xs mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {badges.available.map(badge => (
                <div key={badge.id} className="flex flex-col items-center p-4 bg-white rounded-lg text-center hover:shadow-md transition-all border-2 border-teal-100">
                  <ColorfulBadge 
                    icon={badge.icon} 
                    label={badge.name} 
                    color={badge.color as any}
                    earned={false}
                  />
                  <p className="text-xs mt-3">{badge.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

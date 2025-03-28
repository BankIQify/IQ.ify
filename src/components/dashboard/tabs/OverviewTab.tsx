<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { Link } from "react-router-dom";
import { Brain, Target, BookOpen, Award, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { LearningRecommendations } from "@/components/dashboard/LearningRecommendations";
<<<<<<< HEAD
import { DynamicQuickActions } from "@/components/dashboard/DynamicQuickActions";
=======
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { type Profile } from "@/types/auth/types";

interface OverviewTabProps {
  profile: Profile;
}

export const OverviewTab = ({ profile }: OverviewTabProps) => {
  // Determine display name
  const displayName = profile.name || profile.username || "Scholar";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card className="bg-gradient-to-b from-blue-50 to-purple-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="User avatar" />
                ) : (
                  <AvatarFallback className="text-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-semibold text-xl">{displayName}</h3>
              {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
              
              <div className="mt-4 w-full">
                <Link to="/avatar-creator">
                  <Button variant="outline" className="w-full bg-white hover:bg-blue-50">
                    Character Creation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <RecentActivity />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<<<<<<< HEAD
        <DynamicQuickActions />
=======
        <Card className="bg-gradient-to-b from-green-50 to-teal-50 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/lets-practice">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-all transform hover:scale-105 text-green-700">
                <Target className="h-8 w-8 text-green-600" />
                <span className="text-base font-medium">Practice Tests</span>
              </Button>
            </Link>
            
            <Link to="/brain-training">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all transform hover:scale-105 text-purple-700">
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-base font-medium">Brain Games</span>
              </Button>
            </Link>
            
            <Link to="/practice/verbal">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all transform hover:scale-105 text-blue-700">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-base font-medium">Verbal Reasoning</span>
              </Button>
            </Link>
            
            <Link to="/achievements">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all transform hover:scale-105 text-amber-700">
                <Award className="h-8 w-8 text-amber-600" />
                <span className="text-base font-medium">My Achievements</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
        
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
        <LearningRecommendations />
      </div>
    </div>
  );
};


import { Link } from "react-router-dom";
import { Brain, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { LearningRecommendations } from "@/components/dashboard/LearningRecommendations";
import { type Profile } from "@/types/auth/types";

interface OverviewTabProps {
  profile: Profile;
}

export const OverviewTab = ({ profile }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="User avatar" />
                ) : (
                  <AvatarFallback className="text-xl">
                    {profile.name?.charAt(0) || profile.username?.charAt(0) || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-semibold text-xl">{profile.name || "User"}</h3>
              {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
              
              <div className="mt-4 w-full">
                <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    Edit Profile & Avatar
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/lets-practice">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Practice Tests</span>
              </Button>
            </Link>
            
            <Link to="/brain-training">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Brain className="h-5 w-5" />
                <span>Brain Games</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <LearningRecommendations />
      </div>
    </div>
  );
};

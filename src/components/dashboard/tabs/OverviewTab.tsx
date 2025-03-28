import { Link } from "react-router-dom";
import { Brain, Target, BookOpen, Award, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { LearningRecommendations } from "@/components/dashboard/LearningRecommendations";
import { DynamicQuickActions } from "@/components/dashboard/DynamicQuickActions";
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
        <DynamicQuickActions />
        <LearningRecommendations />
      </div>
    </div>
  );
};

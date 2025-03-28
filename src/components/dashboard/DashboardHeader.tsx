
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Profile } from "@/types/auth/types";

interface DashboardHeaderProps {
  profile: Profile;
}

export const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile.name || profile.username || "Scholar"}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="font-medium">
            {profile.subscription_tier 
              ? `${profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)} Plan` 
              : "Free Plan"}
          </span>
          <span className="text-sm text-muted-foreground">
            {profile.subscription_status === "active" 
              ? `Active until ${new Date(profile.subscription_expires_at || "").toLocaleDateString()}`
              : "No active subscription"}
          </span>
        </div>
        
        <Link to="/profile">
          <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="User avatar" />
            ) : (
              <AvatarFallback>
                {profile.name?.charAt(0) || profile.username?.charAt(0) || "?"}
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
      </div>
    </div>
  );
};


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { AdminTab } from "@/components/dashboard/tabs/AdminTab";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { ProgressTab } from "@/components/dashboard/tabs/ProgressTab";
import { AchievementsTab } from "@/components/dashboard/tabs/AchievementsTab";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, profile, isAdmin, authInitialized } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add debug logging
  useEffect(() => {
    console.log("Dashboard component rendering:", {
      user: user?.id,
      profile: profile?.id,
      isAdmin,
      authInitialized
    });
  }, [user, profile, isAdmin, authInitialized]);

  useEffect(() => {
    if (authInitialized && !user) {
      console.log("Dashboard: No user, redirecting to auth");
      toast({
        title: "Access Denied",
        description: "You must be logged in to access the Dashboard.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, navigate, toast, authInitialized]);

  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Determine display name - use username or email if name is not available
  const displayName = profile?.name || profile?.username || user.email?.split('@')[0] || "User";

  // Determine which tab to show by default
  const defaultTab = isAdmin ? "admin" : "overview";

  return (
    <div className="page-container max-w-6xl mx-auto py-8 px-4 animate-fadeIn bg-gradient-to-b from-[rgba(30,174,219,0.2)] to-[rgba(255,105,180,0.2)] rounded-xl">
      <DashboardHeader profile={{...profile, name: displayName}} />

      <Tabs value={defaultTab} className="space-y-8">
        <DashboardTabs isAdmin={isAdmin} activeTab={defaultTab} />

        {/* Show different content based on user role */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <AdminTab />
          </TabsContent>
        )}
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab profile={{...profile, name: displayName}} />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <ProgressTab />
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-6">
          <AchievementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;


import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { ProgressTab } from "@/components/dashboard/tabs/ProgressTab";
import { AchievementsTab } from "@/components/dashboard/tabs/AchievementsTab";
import { AdminTab } from "@/components/dashboard/tabs/AdminTab";

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["overview", "progress", "achievements", "admin"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access the Dashboard.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL with current tab
    const params = new URLSearchParams(location.search);
    params.set("tab", tab);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };

  if (!user || !profile) {
    return null;
  }

  // Determine display name - use username or email if name is not available
  const displayName = profile.name || profile.username || user.email?.split('@')[0] || "Scholar";

  return (
    <div className="page-container max-w-6xl mx-auto py-8 px-4 animate-fadeIn bg-gradient-to-b from-iqify-blue/20 to-iqify-pink/20 rounded-xl">
      <DashboardHeader profile={{...profile, name: displayName}} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <DashboardTabs isAdmin={isAdmin} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab profile={{...profile, name: displayName}} />
        </TabsContent>

        {/* Progress Tab Content */}
        <TabsContent value="progress" className="space-y-6">
          <ProgressTab />
        </TabsContent>

        {/* Achievements Tab Content */}
        <TabsContent value="achievements" className="space-y-6">
          <AchievementsTab />
        </TabsContent>

        {/* Admin Tab Content */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <AdminTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;

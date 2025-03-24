
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="page-container max-w-6xl mx-auto py-8 px-4 animate-fadeIn">
      <DashboardHeader profile={profile} />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <DashboardTabs isAdmin={isAdmin} activeTab={activeTab} />

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab profile={profile} />
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

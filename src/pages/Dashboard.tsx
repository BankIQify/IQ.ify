import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { AdminTab } from "@/components/dashboard/tabs/AdminTab";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { ProgressTab } from "@/components/dashboard/tabs/ProgressTab";
import { AchievementsTab } from "@/components/dashboard/tabs/AchievementsTab";
import { Loader2 } from "lucide-react";
import { DataInputDashboard } from "@/components/dashboard/admin/DataInputDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, profile, isAdmin, isDataInput, authInitialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(isAdmin ? "admin" : "overview");

  // Add debug logging
  useEffect(() => {
    console.log("Dashboard component rendering:", {
      user: user?.id,
      profile: profile?.id,
      isAdmin,
      authInitialized,
      activeTab
    });
  }, [user, profile, isAdmin, authInitialized, activeTab]);

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

  // Set initial tab based on user role
  useEffect(() => {
    if (isAdmin) {
      setActiveTab("admin");
    }
  }, [isAdmin]);

  // Add debug logging for role checks
  useEffect(() => {
    console.log("Role checks:", {
      isAdmin,
      isDataInput,
      profileRole: isAdmin ? 'admin' : isDataInput ? 'data_input' : 'student'
    });
  }, [isAdmin, isDataInput]);

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

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab);
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="page-container max-w-6xl mx-auto py-8 px-4 animate-fadeIn bg-gradient-to-b from-[rgba(30,174,219,0.2)] to-[rgba(255,105,180,0.2)] rounded-xl">
        <DashboardHeader profile={{...profile, name: displayName}} />

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">Overview</TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white/20">Progress</TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-white/20">Achievements</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-white/20">Admin</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            {profile ? (
              <OverviewTab profile={profile} />
            ) : (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-muted-foreground">Loading profile...</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab />
          </TabsContent>

          <TabsContent value="admin">
            <AdminTab />
          </TabsContent>
        </Tabs>

        {isDataInput && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Question Management Dashboard</h2>
            <DataInputDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

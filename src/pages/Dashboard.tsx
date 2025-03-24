
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { AdminTab } from "@/components/dashboard/tabs/AdminTab";

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access the Dashboard.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // If the user doesn't have admin privileges, redirect them
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need administrative privileges to access this page.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [user, isAdmin, navigate, toast]);

  if (!user || !profile || !isAdmin) {
    return null;
  }

  // Determine display name - use username or email if name is not available
  const displayName = profile.name || profile.username || user.email?.split('@')[0] || "Admin";

  return (
    <div className="page-container max-w-6xl mx-auto py-8 px-4 animate-fadeIn bg-gradient-to-b from-[rgba(30,174,219,0.2)] to-[rgba(255,105,180,0.2)] rounded-xl">
      <DashboardHeader profile={{...profile, name: displayName}} />

      <Tabs value="admin" className="space-y-8">
        <DashboardTabs isAdmin={isAdmin} activeTab="admin" />

        {/* Admin Tab Content */}
        <TabsContent value="admin" className="space-y-6">
          <AdminTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

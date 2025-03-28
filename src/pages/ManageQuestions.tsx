
import { useEffect } from "react";
import { useManageQuestions } from "@/hooks/useManageQuestions";
import { QuestionManagementLayout } from "@/components/manage-questions/QuestionManagementLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ManageQuestions = () => {
  const {
    user,
    isAdmin,
    hasDataInputRole,
    pendingCount,
    activeTab,
    handleTabChange,
    showHomepageTab,
    showWebhooksTab,
    authInitialized
  } = useManageQuestions();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("ManageQuestions component:", {
      user: user?.id,
      isAdmin,
      hasDataInputRole,
      activeTab,
      authInitialized
    });
  }, [user, isAdmin, hasDataInputRole, activeTab, authInitialized]);

  useEffect(() => {
    // Only run redirects after auth is initialized
    if (!authInitialized) {
      console.log("Auth not initialized yet, waiting...");
      return;
    }

    // Redirect if needed
    if (user === null) {
      console.log("No user, redirecting to auth page");
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
      navigate("/auth");
    } else if (!isAdmin && !hasDataInputRole) {
      console.log("User doesn't have permission, redirecting to home");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, hasDataInputRole, navigate, toast, authInitialized]);

  // Show loading state while auth is initializing
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

  // Only render content when we have permission
  if (!user || (!isAdmin && !hasDataInputRole)) {
    return null;
  }

  return (
    <QuestionManagementLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      showHomepageTab={showHomepageTab}
      showWebhooksTab={showWebhooksTab}
      pendingCount={pendingCount}
    />
  );
};

export default ManageQuestions;

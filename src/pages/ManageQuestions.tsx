
import { useEffect } from "react";
import { useManageQuestions } from "@/hooks/useManageQuestions";
import { QuestionManagementLayout } from "@/components/manage-questions/QuestionManagementLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ManageQuestions = () => {
  const {
    user,
    isAdmin,
    hasDataInputRole,
    pendingCount,
    activeTab,
    handleTabChange,
    showHomepageTab,
    showWebhooksTab
  } = useManageQuestions();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Debug info
    console.log("ManageQuestions component:", {
      user,
      isAdmin,
      hasDataInputRole,
      activeTab
    });

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
  }, [user, isAdmin, hasDataInputRole, navigate, toast]);

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

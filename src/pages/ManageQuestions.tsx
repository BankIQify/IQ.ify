import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useManageQuestions } from "@/hooks/useManageQuestions";
import { QuestionManagementLayout } from "@/components/manage-questions/QuestionManagementLayout";
import { useAuth } from "@/hooks/useAuth";

const ManageQuestions = () => {
  const { user, isAdmin, isDataInput, authInitialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("ManageQuestions component:", {
      user: user?.id,
      isAdmin,
      isDataInput,
      authInitialized
    });
  }, [user, isAdmin, isDataInput, authInitialized]);

  useEffect(() => {
    // Only run redirects after auth is initialized
    if (!authInitialized) {
      console.log("Auth not initialized yet, waiting...");
      return;
    }

    // Redirect if needed
    if (!user) {
      console.log("No user, redirecting to auth page");
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
      navigate("/auth");
    } else if (!isAdmin && !isDataInput) {
      console.log("User doesn't have permission, redirecting to home");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, isDataInput, navigate, toast, authInitialized]);

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

  if (!user || (!isAdmin && !isDataInput)) {
    return null;
  }

  return <QuestionManagementLayout />;
};

export default ManageQuestions;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UserLogs } from "@/components/admin/UserLogs";

const UserLogsPage = () => {
  const { user, authInitialized, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authInitialized && !user) {
      navigate("/auth");
      return;
    }

    if (authInitialized && !isAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [user, authInitialized, isAdmin, navigate]);

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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="section-title">User Logs</h1>
      </div>

      <UserLogs />
    </div>
  );
};

export default UserLogsPage; 
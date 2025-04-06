import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CustomExamForm } from "@/components/exams/CustomExamForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ManageExams = () => {
  const { user, authInitialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add debug logging
  useEffect(() => {
    console.log("ManageExams component rendering:", {
      user: user?.id,
      authInitialized
    });
  }, [user, authInitialized]);

  useEffect(() => {
    if (authInitialized && !user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access the Practice section.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, authInitialized, navigate, toast]);

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
        <h1 className="section-title">Create Custom Practice Tests</h1>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
        <p><strong>Note:</strong> For standard practice tests, simply select a category on the <Link to="/practice" className="underline">Practice</Link> page.</p>
      </div>

      <Card className="p-6">
        <CustomExamForm />
      </Card>
    </div>
  );
};

export default ManageExams;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CustomExamForm } from "@/components/exams/CustomExamForm";
import { StandardExamForm } from "@/components/exams/StandardExamForm";
import { Loader2 } from "lucide-react";

const ManageExams = () => {
  const { user, authInitialized } = useAuthContext();
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
      <h1 className="section-title">Create Practice Tests</h1>
      
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="standard">Standard Tests</TabsTrigger>
          <TabsTrigger value="custom">Custom Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard">
          <Card className="p-6">
            <StandardExamForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card className="p-6">
            <CustomExamForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageExams;


import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardExamForm } from "@/components/exams/StandardExamForm";
import { CustomExamForm } from "@/components/exams/CustomExamForm";

const ManageExams = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!user) {
    toast({
      title: "Access Denied",
      description: "You must be logged in to access Practice section.",
      variant: "destructive"
    });
    navigate("/");
    return null;
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Create Practice Tests</h1>
      
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Practice</TabsTrigger>
          <TabsTrigger value="custom">Custom Practice</TabsTrigger>
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

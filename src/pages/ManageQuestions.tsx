
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualQuestionUpload } from "@/components/questions/ManualQuestionUpload";
import { CategoryManager } from "@/components/questions/CategoryManager";
import { CompleteQuestionBank } from "@/components/questions/CompleteQuestionBank";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { HomepageEditor } from "@/components/homepage/HomepageEditor";
import { GamePuzzlesManager } from "@/components/puzzles/GamePuzzlesManager";
import { supabase } from "@/integrations/supabase/client";
import { WebhookManagement } from "@/components/webhooks/WebhookManagement";

const ManageQuestions = () => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);

  // Redirect if not admin
  if (!user || !isAdmin) {
    toast({
      title: "Access Denied",
      description: "You must be an admin to access this page.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }

  // Fetch sections for the CategoriesTable
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data: sectionsData, error } = await supabase
          .from("question_sections")
          .select(`
            id,
            name,
            category,
            sub_topics (
              id,
              name
            )
          `);

        if (error) throw error;
        if (sectionsData) {
          setSections(sectionsData);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast({
          title: "Error",
          description: "Failed to fetch sections data.",
          variant: "destructive",
        });
      }
    };

    fetchSections();
  }, [toast]);

  return (
    <div className="page-container">
      <h1 className="section-title">Question Management</h1>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="bank" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
            Complete Question Bank
          </TabsTrigger>
          <TabsTrigger value="manual" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
            Manual Upload
          </TabsTrigger>
          <TabsTrigger value="categories" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
            Manage Categories
          </TabsTrigger>
          <TabsTrigger value="puzzles" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
            Puzzle Games
          </TabsTrigger>
          <TabsTrigger value="homepage" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
            Edit Homepage
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
            AI Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="bank">
          <CompleteQuestionBank />
        </TabsContent>

        <TabsContent value="manual">
          <ManualQuestionUpload />
        </TabsContent>

        <TabsContent value="puzzles">
          <GamePuzzlesManager />
        </TabsContent>

        <TabsContent value="homepage">
          <HomepageEditor />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageQuestions;

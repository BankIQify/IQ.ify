
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualQuestionUpload } from "@/components/questions/ManualQuestionUpload";
import { CategoryManager } from "@/components/questions/CategoryManager";
import { CompleteQuestionBank } from "@/components/questions/CompleteQuestionBank";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { GenerateQuestionsTab } from "@/components/questions/tabs/GenerateQuestionsTab";
import { HomepageEditor } from "@/components/homepage/HomepageEditor";
import { GamePuzzlesManager } from "@/components/puzzles/GamePuzzlesManager";
import { CategoriesTable } from "@/components/questions/sections/CategoriesTable";
import type { QuestionCategory } from "@/types/questions";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ManageQuestions = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [category, setCategory] = useState<QuestionCategory>("verbal");
  const [subTopicId, setSubTopicId] = useState<string>("");
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

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="generate">Generate Questions</TabsTrigger>
          <TabsTrigger value="manual">Manual Upload</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          <TabsTrigger value="bank">Complete Question Bank</TabsTrigger>
          <TabsTrigger value="puzzles">Puzzle Games</TabsTrigger>
          <TabsTrigger value="homepage">Edit Homepage</TabsTrigger>
          <TabsTrigger value="summary">Games Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="bank">
          <CompleteQuestionBank />
        </TabsContent>

        <TabsContent value="generate">
          <GenerateQuestionsTab
            category={category}
            subTopicId={subTopicId}
            onCategoryChange={setCategory}
            onSubTopicChange={setSubTopicId}
          />
        </TabsContent>

        <TabsContent value="manual">
          <ManualQuestionUpload subTopicId={subTopicId} />
        </TabsContent>

        <TabsContent value="puzzles">
          <GamePuzzlesManager />
        </TabsContent>

        <TabsContent value="homepage">
          <HomepageEditor />
        </TabsContent>

        <TabsContent value="summary">
          <CategoriesTable sections={sections} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageQuestions;

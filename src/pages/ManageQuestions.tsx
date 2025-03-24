
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualQuestionUpload } from "@/components/questions/ManualQuestionUpload";
import { CategoryManager } from "@/components/questions/CategoryManager";
import { CompleteQuestionBank } from "@/components/questions/CompleteQuestionBank";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { HomepageEditor } from "@/components/homepage/HomepageEditor";
import { GamePuzzlesManager } from "@/components/puzzles/GamePuzzlesManager";
import { supabase } from "@/integrations/supabase/client";
import { WebhookManagement } from "@/components/webhooks/WebhookManagement";
import { Badge } from "@/components/ui/badge";

const ManageQuestions = () => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("bank");
  const [hasDataInputRole, setHasDataInputRole] = useState(false);

  // Extract the tab from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["bank", "manual", "categories", "puzzles", "homepage", "webhooks"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Check for data_input role specifically
  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        if (error) {
          console.error('Error checking data_input role:', error);
          return;
        }

        setHasDataInputRole(!!data);
      } catch (error) {
        console.error('Error in checkDataInputRole:', error);
      }
    };

    checkDataInputRole();
  }, [user]);

  // Redirect if not admin or data_input role
  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access this page.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!isAdmin && !hasDataInputRole) {
      toast({
        title: "Access Denied",
        description: "You need admin or data team privileges to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, hasDataInputRole, navigate, toast]);

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

  // Fetch pending webhook events count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from("webhook_events")
          .select("*", { count: "exact" })
          .eq("processed", false);
          
        if (error) throw error;
        setPendingCount(count || 0);
      } catch (error) {
        console.error("Error fetching pending webhook count:", error);
      }
    };
    
    if (user && (isAdmin || hasDataInputRole)) {
      fetchPendingCount();
      
      // Set up a polling interval to refresh the count
      const interval = setInterval(fetchPendingCount, 30000); // every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, isAdmin, hasDataInputRole]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL with current tab
    const params = new URLSearchParams(location.search);
    params.set("tab", value);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };

  // Restrict certain tabs based on role - only admins can edit homepage and access webhooks
  const showHomepageTab = isAdmin; // Only true admins can edit homepage
  const showWebhooksTab = isAdmin; // Only true admins can access webhooks

  if (!user || (!isAdmin && !hasDataInputRole)) {
    return null;
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Question Management</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className={`grid w-full ${showHomepageTab && showWebhooksTab ? 'grid-cols-6' : showHomepageTab || showWebhooksTab ? 'grid-cols-5' : 'grid-cols-4'}`}>
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
          
          {showHomepageTab && (
            <TabsTrigger value="homepage" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
              Edit Homepage
            </TabsTrigger>
          )}
          
          {showWebhooksTab && (
            <TabsTrigger value="webhooks" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2 relative">
              AI Webhooks
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs absolute -top-2 -right-2">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
          )}
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

        {showHomepageTab && (
          <TabsContent value="homepage">
            <HomepageEditor />
          </TabsContent>
        )}

        {showWebhooksTab && (
          <TabsContent value="webhooks">
            <WebhookManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ManageQuestions;

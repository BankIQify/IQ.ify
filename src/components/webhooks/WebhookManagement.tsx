
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookKeyManager } from "../ai-integration/WebhookKeyManager";
import { WebhookQuestionReview } from "./question-review";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const WebhookManagement = () => {
  const [activeTab, setActiveTab] = useState("keys");
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for questionId in URL params to open review tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("questionId")) {
      setActiveTab("review");
    }
  }, [location]);

  // Count pending webhook events
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
    
    fetchPendingCount();
    
    // Set up a polling interval to refresh the count
    const interval = setInterval(fetchPendingCount, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without questionId param when switching away from review tab
    if (value !== "review") {
      const params = new URLSearchParams(location.search);
      if (params.has("questionId")) {
        params.delete("questionId");
        navigate({
          pathname: location.pathname,
          search: params.toString()
        }, { replace: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keys">Webhook Keys</TabsTrigger>
          <TabsTrigger value="review" className="relative">
            Question Review
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs absolute -top-2 -right-2">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <WebhookKeyManager />
        </TabsContent>

        <TabsContent value="review">
          <WebhookQuestionReview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

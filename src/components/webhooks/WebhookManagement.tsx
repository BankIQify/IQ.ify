
import { useState, useEffect } from "react";
import { WebhookKeyGenerator } from "./WebhookKeyGenerator";
import { WebhookQuestionReview } from "./WebhookQuestionReview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export const WebhookManagement = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check for pending questions
    const fetchPendingQuestions = async () => {
      try {
        const { count, error } = await supabase
          .from("webhook_events")
          .select("*", { count: 'exact', head: true })
          .eq("event_type", "question_generated")
          .eq("processed", false);
        
        if (error) throw error;
        setPendingQuestions(count || 0);
      } catch (error) {
        console.error("Error checking pending questions:", error);
      }
    };

    fetchPendingQuestions();
    // Set up an interval to check every 30 seconds
    const interval = setInterval(fetchPendingQuestions, 30000);
    return () => clearInterval(interval);
  }, []);

  const testWebhookFunction = async () => {
    setTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke("test-connection");
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Webhook function is up and running!",
      });
    } catch (error) {
      console.error("Error testing webhook function:", error);
      toast({
        title: "Error",
        description: "Failed to connect to webhook function. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Webhook Management</h2>
        <Button 
          onClick={testWebhookFunction} 
          disabled={testingConnection} 
          variant="outline"
        >
          {testingConnection ? "Testing..." : "Test Connection"}
        </Button>
      </div>
      
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="generate">Generate Key</TabsTrigger>
          <TabsTrigger value="review">
            Review Questions
            {pendingQuestions > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {pendingQuestions}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="guide">Integration Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <WebhookKeyGenerator />
        </TabsContent>
        
        <TabsContent value="review">
          <WebhookQuestionReview />
        </TabsContent>
        
        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>AI Integration Guide</CardTitle>
              <CardDescription>
                Follow these steps to integrate your external AI system with this application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">1. Generate a Webhook Key</h3>
                <p className="text-muted-foreground">
                  Use the Generate Key tab to create a unique authentication key for your AI system.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">2. Configure Your AI System</h3>
                <p className="text-muted-foreground">
                  Set up your AI to make HTTP POST requests to the webhook URL with your key in the header.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">3. Format Your Payload</h3>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <pre>
{`{
  "event_type": "question_generated",
  "source": "your_ai_system_name",
  "sub_topic_id": "uuid_of_subtopic",
  "prompt": "optional_generation_prompt",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Explanation of the answer"
    },
    // More questions...
  ]
}`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">4. Dual-Choice Format</h3>
                <p className="text-muted-foreground">
                  For dual-choice questions, use this format:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono mt-2">
                  <pre>
{`{
  "question": "Match the items correctly",
  "primaryOptions": ["Item 1", "Item 2", "Item 3"],
  "secondaryOptions": ["Option A", "Option B", "Option C"],
  "correctPrimaryAnswer": "Item 2",
  "correctSecondaryAnswer": "Option B",
  "explanation": "Item 2 matches with Option B because..."
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionReviewWebhook } from "./question-review/QuestionReviewWebhook";

export const WebhookDataEditor = () => {
  const [activeTab, setActiveTab] = useState("review");
  const { logActivity } = useAuth();
  const { toast } = useToast();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="review">Question Review</TabsTrigger>
        <TabsTrigger value="history">Review History</TabsTrigger>
      </TabsList>

      <TabsContent value="review" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>
              Review and process questions submitted through the webhook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionReviewWebhook />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
            <CardDescription>
              View the history of processed questions and their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Review history will be implemented soon.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}; 
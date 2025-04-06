import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const QuestionReviewWebhook = () => {
  const [loading, setLoading] = useState(false);
  const [rawQuestions, setRawQuestions] = useState("");
  const { logActivity } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/review-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: rawQuestions }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      await logActivity('question_upload', {
        method: 'webhook',
        question_count: rawQuestions.split('\n').length,
        success: true
      });

      toast({
        title: "Success",
        description: "Questions have been processed successfully",
      });

      setRawQuestions("");
    } catch (error) {
      console.error("Error processing questions:", error);
      
      await logActivity('question_upload', {
        method: 'webhook',
        question_count: rawQuestions.split('\n').length,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        title: "Error",
        description: "Failed to process questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="questions">Raw Questions</Label>
        <Textarea
          id="questions"
          placeholder="Paste your questions here..."
          value={rawQuestions}
          onChange={(e) => setRawQuestions(e.target.value)}
          className="min-h-[200px]"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || !rawQuestions.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Process Questions"
        )}
      </Button>
    </form>
  );
}; 
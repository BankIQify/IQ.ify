
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuestionGeneratorProps {
  subTopicId: string;
  category: string;
}

export const QuestionGenerator = ({ subTopicId, category }: QuestionGeneratorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");

  const generateQuestionMutation = useMutation({
    mutationFn: async () => {
      if (!subTopicId) {
        throw new Error("Please select a sub-topic");
      }

      const { data: generatedQuestion, error: generateError } = await supabase.functions.invoke('generate-question', {
        body: { category, prompt: customPrompt || undefined }
      });

      if (generateError) {
        console.error('Generation error:', generateError);
        throw new Error(generateError.message || 'Failed to generate question');
      }

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: generatedQuestion,
          sub_topic_id: subTopicId,
          generation_prompt: customPrompt || null,
          ai_generated: true,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to save generated question');
      }

      return generatedQuestion;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "New question generated and saved.",
      });
      setCustomPrompt(""); // Clear the prompt after successful generation
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate question. Please try again.",
        variant: "destructive"
      });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt">Custom Generation Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          placeholder="Enter a custom prompt for question generation..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="h-24"
        />
      </div>

      <Button 
        onClick={() => generateQuestionMutation.mutate()}
        disabled={generateQuestionMutation.isPending || !subTopicId}
        className="w-full"
      >
        {generateQuestionMutation.isPending ? "Generating..." : "Generate New Question"}
      </Button>
    </div>
  );
};

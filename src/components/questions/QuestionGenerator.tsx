
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
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestion = async () => {
    if (!subTopicId) {
      toast({
        title: "Error",
        description: "Please select a sub-topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: { category, prompt: customPrompt || undefined }
      });

      if (error) throw error;

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: data,
          sub_topic_id: subTopicId,
          generation_prompt: customPrompt || null,
          ai_generated: true,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "New question generated and saved.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
        onClick={generateQuestion} 
        disabled={isGenerating || !subTopicId}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Generate New Question"}
      </Button>
    </div>
  );
};

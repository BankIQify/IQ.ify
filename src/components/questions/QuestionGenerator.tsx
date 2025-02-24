
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
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingDelay, setIsTestingDelay] = useState(false);

  // Test delay mutation
  const testDelayMutation = useMutation({
    mutationFn: async () => {
      try {
        toast({
          title: "Testing delay function",
          description: "Starting 2-second delay test...",
        });
        
        console.log('Testing delay function...');
        setIsTestingDelay(true);
        
        const { data, error } = await supabase.functions.invoke('test-delay', {
          body: { test: true },
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Delay test response:', { data, error });
        
        if (error) {
          console.error('Delay test error:', error);
          throw error;
        }

        // Show success toast
        toast({
          title: "Success",
          description: "Delay test completed successfully!",
        });

        return data;
      } catch (error) {
        console.error('Delay test error:', error);
        // Show error toast
        toast({
          title: "Error",
          description: `Failed to test delay: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsTestingDelay(false);
      }
    }
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log('Testing edge function connection...');
        
        const functionEndpoint = 'test-connection';
        console.log('Calling function:', functionEndpoint);

        const { data, error } = await supabase.functions.invoke(functionEndpoint, {
          body: { test: true },
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Test connection response:', { data, error });
        
        if (error) {
          console.error('Test connection error details:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Test connection error:', error);
        console.error('Error stack:', error.stack);
        throw error;
      }
    }
  });

  const generateQuestionMutation = useMutation({
    mutationFn: async () => {
      if (!subTopicId) {
        throw new Error("Please select a sub-topic");
      }

      try {
        // First test the connection
        setIsTestingConnection(true);
        await testConnectionMutation.mutateAsync();
        setIsTestingConnection(false);

        console.log('Calling generate-question function with:', {
          category,
          prompt: customPrompt || undefined
        });

        const { data, error } = await supabase.functions.invoke('generate-question', {
          body: { 
            category,
            prompt: customPrompt || undefined
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Function response:', { data, error });

        if (error) {
          console.error('Function invocation error:', error);
          throw new Error(error.message || 'Failed to generate question');
        }

        if (!data) {
          console.error('No data returned from function');
          throw new Error('No response from question generator');
        }

        if ('error' in data) {
          console.error('Generation error:', data.error);
          throw new Error(data.error || 'Failed to generate question');
        }

        console.log('Question generated successfully:', data);

        const { error: insertError } = await supabase
          .from('questions')
          .insert({
            content: data,
            sub_topic_id: subTopicId,
            generation_prompt: customPrompt || null,
            ai_generated: true,
          });

        if (insertError) {
          console.error('Database insert error:', insertError);
          throw new Error('Failed to save generated question');
        }

        return data;
      } catch (error) {
        console.error('Caught error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "New question generated and saved.",
      });
      setCustomPrompt("");
    },
    onError: (error: Error) => {
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

      <div className="space-y-2">
        <Button 
          onClick={() => testDelayMutation.mutate()}
          disabled={testDelayMutation.isPending}
          variant="outline"
          className="w-full"
        >
          {testDelayMutation.isPending ? "Testing Delay..." : "Test Delay Function"}
        </Button>

        <Button 
          onClick={() => generateQuestionMutation.mutate()}
          disabled={generateQuestionMutation.isPending || testConnectionMutation.isPending || !subTopicId}
          className="w-full"
        >
          {generateQuestionMutation.isPending 
            ? "Generating..." 
            : isTestingConnection 
            ? "Testing Connection..." 
            : "Generate New Question"}
        </Button>
      </div>

      {testConnectionMutation.isError && (
        <p className="text-sm text-red-500">
          Connection test failed. Please check your network connection and try again.
        </p>
      )}

      {testDelayMutation.isError && (
        <p className="text-sm text-red-500">
          Delay test failed: {testDelayMutation.error?.message}
        </p>
      )}
    </div>
  );
};

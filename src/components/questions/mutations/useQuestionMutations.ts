
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useQuestionMutations = (subTopicId: string) => {
  const queryClient = useQueryClient();

  const testDelayMutation = useMutation({
    mutationFn: async () => {
      try {
        toast({
          title: "Testing delay function",
          description: "Starting 2-second delay test...",
        });
        
        console.log('Testing delay function...');
        
        const { data, error } = await supabase.functions.invoke('test-delay', {
          body: { test: true }
        });
        
        console.log('Delay test response:', { data, error });
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Delay test completed successfully!",
        });

        return data;
      } catch (error) {
        console.error('Delay test error:', error);
        throw error;
      }
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log('Testing edge function connection...');
        
        const functionEndpoint = 'test-connection';
        console.log('Calling function:', functionEndpoint);

        const { data, error } = await supabase.functions.invoke(functionEndpoint, {
          body: { test: true }
        });
        
        console.log('Test connection response:', { data, error });
        
        if (error) throw error;

        return data;
      } catch (error) {
        console.error('Test connection error:', error);
        throw error;
      }
    }
  });

  const generateQuestionMutation = useMutation({
    mutationFn: async ({ category, customPrompt }: { category: string; customPrompt: string }) => {
      if (!subTopicId) {
        throw new Error("Please select a sub-topic");
      }

      try {
        console.log('Calling generate-question function with:', {
          category,
          subTopicId,
          prompt: customPrompt || undefined
        });

        const { data: response, error: functionError } = await supabase.functions.invoke('generate-question', {
          body: { 
            category,
            subTopicId,
            prompt: customPrompt?.trim() || undefined
          }
        });

        console.log('Generate question response:', { response, functionError });

        if (functionError) {
          throw functionError;
        }

        if (!response) {
          throw new Error('No response from question generator');
        }

        console.log('Question generated successfully:', response);

        const { error: insertError } = await supabase
          .from('questions')
          .insert({
            content: response,
            sub_topic_id: subTopicId,
            generation_prompt: customPrompt?.trim() || null,
            ai_generated: true,
          });

        if (insertError) {
          console.error('Database insert error:', insertError);
          throw new Error('Failed to save generated question');
        }

        return response;
      } catch (error) {
        console.error('Caught error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', subTopicId] });
      toast({
        title: "Success!",
        description: "New question generated and saved.",
      });
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

  return {
    testDelayMutation,
    testConnectionMutation,
    generateQuestionMutation,
  };
};

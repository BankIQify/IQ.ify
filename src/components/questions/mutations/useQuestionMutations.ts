
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

        const { data: questions, error: functionError } = await supabase.functions.invoke('generate-question', {
          body: { 
            category,
            subTopicId,
            prompt: customPrompt?.trim() || undefined
          }
        });

        console.log('Generate questions response:', { questions, functionError });

        if (functionError) {
          throw functionError;
        }

        if (!questions || !Array.isArray(questions)) {
          throw new Error('No questions received from generator');
        }

        console.log('Questions generated successfully:', questions);

        // Insert all questions in parallel
        const insertPromises = questions.map(question => 
          supabase
            .from('questions')
            .insert({
              content: question,
              sub_topic_id: subTopicId,
              generation_prompt: customPrompt?.trim() || null,
              ai_generated: true,
            })
        );

        const results = await Promise.all(insertPromises);
        
        // Check for any insert errors
        const insertErrors = results
          .map(result => result.error)
          .filter(error => error !== null);

        if (insertErrors.length > 0) {
          console.error('Database insert errors:', insertErrors);
          throw new Error('Failed to save some generated questions');
        }

        return questions;
      } catch (error) {
        console.error('Caught error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', subTopicId] });
      toast({
        title: "Success!",
        description: "5 new questions generated and saved.",
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate questions. Please try again.",
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

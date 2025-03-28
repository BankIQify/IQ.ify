import { supabase } from "@/integrations/supabase/client";
import { WebhookEvent, WebhookEventPayload } from "../types";
import type { QuestionContent, QuestionType } from "@/types/questions";
import { QuestionItem } from "../types";

export const fetchWebhookEvents = async () => {
  const { data, error } = await supabase
    .from("webhook_events")
    .select("*")
    .eq("event_type", "question_generated")
    .eq("processed", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Type cast the data to ensure it matches our WebhookEvent type
  const typedEvents: WebhookEvent[] = data?.map(event => ({
    ...event,
    payload: event.payload as unknown as WebhookEventPayload
  })) || [];
  
  return typedEvents;
};

export const saveQuestion = async (
  question: QuestionItem, 
  defaultSubTopicId: string,
  generationPrompt: string | null
) => {
  // Use the question's subTopicId if available, otherwise fall back to the default
  const subTopicId = question.subTopicId || defaultSubTopicId;
  
  if (!subTopicId) {
    throw new Error("No sub-topic ID provided");
  }
  
  // Base question content that all question types have
  const questionContent: QuestionContent = {
    question: question.question || "",
    explanation: question.explanation || "No explanation provided",
  };
  
  // Add type-specific properties
  if ('options' in question && question.options && Array.isArray(question.options) && 'correctAnswer' in question && question.correctAnswer) {
    questionContent.options = question.options;
    questionContent.correctAnswer = question.correctAnswer;
  } else if ('primaryOptions' in question && question.primaryOptions && 
            'secondaryOptions' in question && question.secondaryOptions &&
            'correctPrimaryAnswer' in question && question.correctPrimaryAnswer &&
            'correctSecondaryAnswer' in question && question.correctSecondaryAnswer) {
    questionContent.primaryOptions = question.primaryOptions;
    questionContent.secondaryOptions = question.secondaryOptions;
    questionContent.correctPrimaryAnswer = question.correctPrimaryAnswer;
    questionContent.correctSecondaryAnswer = question.correctSecondaryAnswer;
  } else if ('correctAnswer' in question && question.correctAnswer) {
    // Text answer question
    questionContent.correctAnswer = question.correctAnswer;
  }
  
  // Determine question type
  let questionType: QuestionType = 'text';
  if ('options' in question && question.options && Array.isArray(question.options)) {
    questionType = "multiple_choice";
  } else if ('imageUrl' in question && question.imageUrl) {
    questionType = "image";
  } else if ('primaryOptions' in question && question.primaryOptions && 
             'secondaryOptions' in question && question.secondaryOptions) {
    // Map dual_choice to multiple_choice for database compatibility
    questionType = "multiple_choice";
  }
  
  // Only include difficulty for brain training questions
  // The backend will set a default if needed
  const { data: subTopicData } = await supabase
    .from('sub_topics')
    .select(`
      question_sections:section_id (
        category
      )
    `)
    .eq('id', subTopicId)
    .single();
  
  const isBrainTraining = subTopicData?.question_sections?.[0]?.category === 'brain_training';
  
  const { error } = await supabase
    .from("questions")
    .insert({
      content: questionContent,
      sub_topic_id: subTopicId,
      ai_generated: true,
      question_type: questionType,
      generation_prompt: generationPrompt,
      ...(isBrainTraining ? { difficulty: question.difficulty || 'medium' } : {})
    });
    
  if (error) throw error;
};

export const markEventAsProcessed = async (eventId: string) => {
  const { error } = await supabase
    .from("webhook_events")
    .update({ 
      processed: true,
      processed_at: new Date().toISOString()
    })
    .eq("id", eventId);
    
  if (error) throw error;
};

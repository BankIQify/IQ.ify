
import { createSuccessResponse } from "../_shared/webhook-utils.ts";

export async function handleRawTextSubmission(supabaseAdmin, payload) {
  console.log('Received raw text submission');
  // Store the event but don't process it automatically - let the user edit it in the UI
  const { data: eventData, error: eventError } = await supabaseAdmin
    .from('webhook_events')
    .insert({
      source: payload.source || 'external_ai',
      event_type: 'question_generated',
      payload: {
        sub_topic_id: payload.sub_topic_id,
        sub_topic_name: payload.sub_topic_name || null,
        prompt: payload.prompt || null,
        raw_text: payload.raw_text,
        questions: [] // Empty array to be filled after editing
      },
      processed: false
    })
    .select('id')
    .single();

  if (eventError) {
    console.error('Error recording webhook event with raw text:', eventError);
    throw new Error('Failed to record webhook event with raw text');
  }

  return createSuccessResponse({
    success: true,
    message: 'Raw text questions received and stored for editing', 
    event_id: eventData.id
  });
}

export async function handleQuestionGenerated(supabase, payload) {
  const { questions, sub_topic_id, prompt } = payload;
  
  if (!sub_topic_id) {
    return { success: false, error: 'Missing sub_topic_id in payload' };
  }
  
  if (!questions || !Array.isArray(questions)) {
    return { success: false, error: 'Missing or invalid questions array in payload' };
  }
  
  try {
    // Insert all questions in parallel
    const insertPromises = questions.map(question => 
      supabase
        .from('questions')
        .insert({
          content: question,
          sub_topic_id: sub_topic_id,
          generation_prompt: prompt || null,
          ai_generated: true,
          question_type: determineQuestionType(question),
          difficulty: question.difficulty || 'medium', // Set difficulty or default to medium
        })
    );

    const results = await Promise.all(insertPromises);
    
    // Check for any insert errors
    const insertErrors = results
      .map(result => result.error)
      .filter(error => error !== null);

    if (insertErrors.length > 0) {
      console.error('Database insert errors:', insertErrors);
      return { success: false, error: 'Failed to save some generated questions', details: insertErrors };
    }
    
    return { 
      success: true, 
      message: `${questions.length} questions saved successfully`, 
      question_count: questions.length 
    };
  } catch (error) {
    console.error('Error processing questions:', error);
    return { success: false, error: `Failed to process questions: ${error.message}` };
  }
}

// Helper function to determine question type based on content
export function determineQuestionType(questionContent) {
  if (questionContent.primaryOptions && questionContent.secondaryOptions) {
    return 'multiple_choice';
  } else if (questionContent.options && Array.isArray(questionContent.options)) {
    return 'multiple_choice';
  } else if (questionContent.imageUrl) {
    return 'image';
  } else {
    return 'text';
  }
}

import { createSuccessResponse } from "../_shared/webhook-utils.ts";

export async function handleRawTextSubmission(supabaseAdmin, payload) {
  console.log('Received raw text submission');
  console.log('Raw text length:', payload.raw_text?.length || 0);
  console.log('Raw text excerpt:', payload.raw_text?.substring(0, 100) + '...');
  
  try {
    // Make sure we have the required fields
    if (!payload.sub_topic_id) {
      console.error('Missing sub_topic_id in raw text payload');
      throw new Error('Missing sub_topic_id in raw text payload');
    }
    
    if (!payload.raw_text || typeof payload.raw_text !== 'string') {
      console.error('Missing or invalid raw_text in payload');
      throw new Error('Missing or invalid raw_text in payload');
    }
    
    // Clean the text by removing problematic characters that might interfere with parsing
    const cleanedText = payload.raw_text
      .replace(/###\s*[^#\n]+/g, '\n') // Replace headings with newlines
      .replace(/#/g, '') // Remove any remaining # characters
      .trim();
    
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
          raw_text: cleanedText, // Use the cleaned text
          questions: [] // Empty array to be filled after editing
        },
        processed: false
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('Error recording webhook event with raw text:', eventError);
      throw new Error(`Failed to record webhook event with raw text: ${eventError.message}`);
    }

    return createSuccessResponse({
      success: true,
      message: 'Raw text questions received and stored for editing', 
      event_id: eventData.id
    });
  } catch (error) {
    console.error('Error in handleRawTextSubmission:', error);
    throw error; // Let the main handler catch and format the error response
  }
}

// Helper function to determine question type based on content
export function determineQuestionType(questionContent) {
  // If questionContent is a string, it's a simple text question
  if (typeof questionContent === 'string') {
    return 'text';
  }
  
  // Otherwise, examine the properties to determine the type
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

// New function to handle question insertion
async function insertQuestions(supabase, questions, sub_topic_id, prompt) {
  console.log(`Inserting ${questions.length} questions for sub-topic ${sub_topic_id}`);
  
  try {
    // Log the structure of the first question for debugging
    if (questions.length > 0) {
      console.log('First question structure:', JSON.stringify(questions[0], null, 2));
    }
    
    // Insert all questions in parallel
    const insertPromises = questions.map(question => {
      // Normalize question format - handle both content property and direct question strings
      const questionContent = typeof question === 'string' 
        ? question 
        : (question.content || question.question || '');
      
      const difficulty = question.difficulty || 'medium';
      
      console.log(`Processing question: "${questionContent.substring(0, 30)}...", difficulty: ${difficulty}`);
      
      return supabase
        .from('questions')
        .insert({
          content: questionContent,
          sub_topic_id: sub_topic_id,
          generation_prompt: prompt || null,
          ai_generated: true,
          question_type: determineQuestionType(question),
          difficulty: difficulty, // Set difficulty or default to medium
        });
    });

    const results = await Promise.all(insertPromises);
    
    // Check for any insert errors
    const insertErrors = results
      .map(result => result.error)
      .filter(error => error !== null);

    if (insertErrors.length > 0) {
      console.error('Database insert errors:', insertErrors);
      return { 
        success: false, 
        error: 'Failed to save some generated questions', 
        details: insertErrors 
      };
    }
    
    return { 
      success: true, 
      message: `${questions.length} questions saved successfully`, 
      question_count: questions.length 
    };
  } catch (error) {
    console.error('Error inserting questions:', error);
    return { 
      success: false, 
      error: `Failed to insert questions: ${error.message}` 
    };
  }
}

export async function handleQuestionGenerated(supabase, payload) {
  console.log('Handling question_generated event');
  console.log('Payload structure:', Object.keys(payload).join(', '));
  
  const { questions, sub_topic_id, prompt } = payload;
  
  if (!sub_topic_id) {
    console.error('Missing sub_topic_id in payload');
    return { success: false, error: 'Missing sub_topic_id in payload' };
  }
  
  if (!questions || !Array.isArray(questions)) {
    console.error('Missing or invalid questions array in payload');
    return { success: false, error: 'Missing or invalid questions array in payload' };
  }
  
  if (questions.length === 0) {
    console.error('Empty questions array in payload');
    return { success: false, error: 'Questions array is empty' };
  }
  
  console.log(`Found ${questions.length} questions to process`);
  
  // Call the extracted function to handle question insertion
  return await insertQuestions(supabase, questions, sub_topic_id, prompt);
}

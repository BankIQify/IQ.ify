import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Determines the question type based on the structure of the question content
 */
export function determineQuestionType(questionContent: any): string {
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

/**
 * Inserts questions into the database
 */
export async function insertQuestions(
  supabase: ReturnType<typeof createClient>, 
  questions: any[], 
  sub_topic_id: string, 
  prompt?: string
) {
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

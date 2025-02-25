
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, subTopicId, prompt } = await req.json();

    if (!category) {
      throw new Error('Category is required');
    }

    if (!subTopicId) {
      throw new Error('Sub-topic ID is required');
    }

    console.log('Generating question for:', { category, subTopicId, prompt });

    // OpenAI API configuration
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Base instructions for each category
    const categoryInstructions = {
      verbal: `
        SPECIFIC VERBAL REASONING GUIDELINES:
        1. For vocabulary questions:
           - Test understanding of word meanings
           - Use clear, unambiguous word relationships
           - Ensure answers follow logical word patterns
        2. For comprehension:
           - Test understanding of short passages
           - All answers must be supported by the text
        3. For word patterns:
           - Create clear, logical sequences
           - Ensure pattern rules are consistent
           - Every step must be logically justified
      `,
      non_verbal: `
        SPECIFIC NON-VERBAL REASONING GUIDELINES:
        1. For pattern sequences:
           - Use clear, visual transformation rules
           - Each step must follow a logical progression
           - Rules must be consistent across the sequence
        2. For spatial reasoning:
           - Use clear geometric relationships
           - All transformations must be systematic
        3. For numerical patterns:
           - Use clear mathematical relationships
           - Each number must follow a logical sequence
      `,
      brain_training: `
        SPECIFIC BRAIN TRAINING GUIDELINES:
        1. For logic problems:
           - Use clear, step-by-step deduction
           - All premises must lead to one valid conclusion
        2. For mathematical thinking:
           - Use clear numerical relationships
           - Solutions must follow mathematical rules
        3. For pattern recognition:
           - Create clear, systematic patterns
           - Each element must serve a purpose
      `
    };

    // Enhanced system prompt with strict validation requirements
    const systemPrompt = `You are an expert question generator for ${category} reasoning tests.

STRICT REQUIREMENTS:
1. Each question must have ONE unambiguously correct answer
2. All incorrect options must be clearly wrong but plausible
3. Every answer must be fully justified with clear logic
4. Do not use subjective or ambiguous reasoning
5. Double-check all mathematical and logical steps
6. Verify that the question tests the intended skill

FORMAT REQUIREMENTS:
Return a JSON object with these exact fields:
{
  "question": "Clear, unambiguous question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Must exactly match one of the options",
  "explanation": "Detailed explanation showing why the correct answer is right and others are wrong"
}

${categoryInstructions[category]}

EXPLANATION REQUIREMENTS:
1. State the correct answer clearly
2. Explain step-by-step why it's correct
3. Explain why each wrong option is incorrect
4. Include the logical rule or pattern being tested
5. Make sure explanations are mathematically and logically sound
6. Verify all statements before including them`;

    // Use custom prompt if provided, otherwise use category-based prompt
    const userPrompt = prompt?.trim() || `Generate a challenging ${category} reasoning question that:
1. Has one clear, unambiguous correct answer
2. Tests logical thinking and pattern recognition
3. Can be solved through careful reasoning
4. Has plausible but clearly incorrect alternatives`;

    console.log('Sending request to OpenAI with prompt:', userPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5, // Lower temperature for more focused responses
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to generate question: ${error.error?.message || 'OpenAI API error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    const generatedContent = data.choices[0].message.content;
    console.log('Generated content:', generatedContent);

    // Parse and validate the response
    let questionData;
    try {
      questionData = JSON.parse(generatedContent);
      
      // Validate the response format
      if (!questionData.question || !Array.isArray(questionData.options) || 
          questionData.options.length !== 4 || !questionData.correctAnswer || 
          !questionData.explanation) {
        throw new Error('Invalid question format from AI');
      }

      // Additional validation for correct answer
      if (!questionData.options.includes(questionData.correctAnswer)) {
        throw new Error('Correct answer must match one of the options exactly');
      }

      // Validate that all options are unique
      if (new Set(questionData.options).size !== 4) {
        throw new Error('All answer options must be unique');
      }

      // Validate explanation includes required components
      if (!questionData.explanation.includes('correct answer') ||
          !questionData.explanation.includes('incorrect') ||
          !questionData.explanation.includes('because')) {
        throw new Error('Explanation must include justification for correct and incorrect answers');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse generated question: ' + error.message);
    }

    console.log('Successfully generated question:', questionData);

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error in generate-question function:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate question'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});


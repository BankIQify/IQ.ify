
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
        - Focus on vocabulary, comprehension, or word relationships
        - For vocabulary: test understanding of word meanings, synonyms, antonyms
        - For comprehension: test understanding of short passages or statements
        - For word relationships: test ability to identify analogies or word patterns
      `,
      non_verbal: `
        - Focus on visual patterns, spatial reasoning, or sequence completion
        - Use clear, unambiguous patterns that follow logical rules
        - Patterns should increase in complexity from left to right or top to bottom
        - Include geometric shapes, number sequences, or visual transformations
      `,
      brain_training: `
        - Focus on logic, mathematical thinking, or problem-solving
        - Include number sequences, mathematical patterns, or logical deductions
        - Problems should be solvable without advanced mathematical knowledge
        - Include step-by-step reasoning in the explanation
      `
    };

    // Enhanced system prompt with better guidance
    const systemPrompt = `You are an expert question generator for ${category} reasoning tests.

QUESTION STRUCTURE:
1. Question text must be clear, concise, and unambiguous
2. Provide exactly 4 distinct answer options
3. One and only one option must be correct
4. Each option must be complete and make sense on its own

FORMATTING REQUIREMENTS:
Return a JSON object with these exact fields:
{
  "question": "The question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Must exactly match one of the options",
  "explanation": "Detailed explanation here"
}

CATEGORY-SPECIFIC INSTRUCTIONS:
${categoryInstructions[category]}

EXPLANATION REQUIREMENTS:
The explanation must include:
1. Why the correct answer is right
2. Why each incorrect option is wrong
3. The step-by-step reasoning process
4. Any relevant patterns or rules that help solve similar questions
`;

    // Use custom prompt if provided, otherwise use category-based prompt
    const userPrompt = prompt?.trim() || `Generate a challenging ${category} reasoning question suitable for assessment tests that follows best practices for test design. The question should be clear, unambiguous, and have one definitively correct answer.`;

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate question: OpenAI API error');
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
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse generated question');
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

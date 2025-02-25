
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
    console.log('Generating question for:', { category, subTopicId, prompt });

    if (!category || !subTopicId) {
      throw new Error('Category and subTopicId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Base instructions for each category
    const categoryInstructions = {
      verbal: `
        Generate a verbal reasoning question that tests logical thinking.
        Focus on word relationships, patterns, or comprehension.
        The question must be clearly written and have exactly ONE correct answer.
      `,
      non_verbal: `
        Create a non-verbal reasoning question focusing on patterns or sequences.
        The question should test visual-spatial reasoning skills.
        The question must be clearly written and have exactly ONE correct answer.
      `,
      brain_training: `
        Design a brain training question that tests problem-solving abilities.
        Include clear logical steps to reach the solution.
        The question must be clearly written and have exactly ONE correct answer.
      `
    };

    const customInstructions = prompt?.trim() || categoryInstructions[category];

    console.log('Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert question generator. Create questions that:
              1. Have exactly ONE correct answer
              2. Include 4 options labeled A, B, C, and D
              3. Provide a clear, detailed explanation
              4. Are appropriate for the given category: ${category}
              
              Return ONLY a JSON object in this exact format:
              {
                "question": "The question text",
                "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
                "correctAnswer": "A) First option",
                "explanation": "Detailed explanation of why this is the correct answer"
              }`
          },
          { role: 'user', content: customInstructions }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error status:', response.status);
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate question: OpenAI API error');
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from OpenAI:', data);
      throw new Error('Invalid response from AI');
    }

    const generatedContent = data.choices[0].message.content;
    let questionData;
    
    try {
      questionData = JSON.parse(generatedContent);
      
      // Validate the response format
      if (!questionData.question || !Array.isArray(questionData.options) || 
          questionData.options.length !== 4 || !questionData.correctAnswer || 
          !questionData.explanation) {
        console.error('Invalid question format:', questionData);
        throw new Error('Invalid question format from AI');
      }

      console.log('Question generated successfully');
      return new Response(JSON.stringify(questionData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate question',
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

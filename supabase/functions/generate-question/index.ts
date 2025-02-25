
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
        Generate a verbal reasoning question. Follow these rules:
        1. The question must test logical thinking or word relationships
        2. Include exactly 4 options labeled A), B), C), D)
        3. Only ONE answer can be correct
        4. The explanation must clearly justify why the answer is correct
      `,
      non_verbal: `
        Generate a non-verbal reasoning question. Follow these rules:
        1. The question must test visual or pattern recognition
        2. Include exactly 4 options labeled A), B), C), D)
        3. Only ONE answer can be correct
        4. The explanation must clearly justify why the answer is correct
      `,
      brain_training: `
        Generate a brain training question. Follow these rules:
        1. The question must test problem-solving abilities
        2. Include exactly 4 options labeled A), B), C), D)
        3. Only ONE answer can be correct
        4. The explanation must clearly justify why the answer is correct
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert question generator. Generate questions that:
              1. Have exactly ONE correct answer
              2. Include 4 options labeled A), B), C), D)
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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error status:', response.status);
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);

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
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

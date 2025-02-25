
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    console.log('Generate question function called');

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

    // Construct the system prompt based on the category
    let systemPrompt = `You are an expert question generator for ${category} reasoning tests. Generate a multiple choice question `;
    
    if (category === 'verbal') {
      systemPrompt += "that tests vocabulary, comprehension, or word relationships. ";
    } else if (category === 'non_verbal') {
      systemPrompt += "that tests pattern recognition, spatial reasoning, or sequence completion. ";
    } else if (category === 'brain_training') {
      systemPrompt += "that tests problem-solving, logic, or mathematical thinking. ";
    }

    systemPrompt += "The response must be a JSON object with these exact fields: question (string), options (array of 4 strings), correctAnswer (string matching one of the options), and explanation (string explaining the answer).";

    // Use custom prompt if provided, otherwise generate based on category
    const userPrompt = prompt || `Generate a challenging ${category} reasoning question suitable for assessment tests.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      throw new Error('Failed to generate question');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the response to ensure it matches our expected format
    let questionData;
    try {
      questionData = JSON.parse(generatedContent);
      
      // Validate the response format
      if (!questionData.question || !Array.isArray(questionData.options) || 
          questionData.options.length !== 4 || !questionData.correctAnswer || 
          !questionData.explanation) {
        throw new Error('Invalid question format from AI');
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

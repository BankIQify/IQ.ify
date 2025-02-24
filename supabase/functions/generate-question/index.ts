
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { category, prompt } = await req.json();

    const systemPrompt = `You are an expert at creating ${category} reasoning questions for 11+ exams. 
    Create challenging but age-appropriate questions that test critical thinking skills.
    Always return the response in this exact JSON format:
    {
      "question": "The actual question text",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correctAnswer": "A",
      "explanation": "Detailed explanation of why this is the correct answer"
    }`;

    const userPrompt = prompt || `Create an engaging ${category} reasoning question suitable for 11+ exam preparation.`;

    console.log('Making request to OpenAI with:', { systemPrompt, userPrompt });

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
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON string from the response
    let questionData;
    try {
      questionData = JSON.parse(generatedContent);
    } catch (error) {
      console.error('Error parsing question data:', error);
      throw new Error('Failed to parse generated question data');
    }

    // Validate the response format
    if (!questionData.question || !questionData.options || !questionData.correctAnswer || !questionData.explanation) {
      throw new Error('Invalid question format returned from AI');
    }

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

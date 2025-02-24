
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

console.log('Generate question function loaded');

serve(async (req) => {
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting question generation process');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const { category, prompt } = await req.json();
    console.log('Request parameters:', { category, hasPrompt: !!prompt });

    const systemPrompt = `You are an expert at creating multiple-choice educational questions for ${category} reasoning tests. 
    Create a challenging but fair question that tests ${category} reasoning skills.
    The response should be in this JSON format:
    {
      "question": "the question text",
      "options": ["option 1", "option 2", "option 3", "option 4"],
      "correctAnswer": "the correct option text",
      "explanation": "detailed explanation of the answer"
    }`;

    const userPrompt = prompt || `Create a ${category} reasoning question suitable for assessment.`;

    console.log('Sending request to OpenAI');
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
      throw new Error('Failed to generate question: ' + error);
    }

    const data = await response.json();
    console.log('Received response from OpenAI');

    const questionContent = JSON.parse(data.choices[0].message.content);
    console.log('Successfully parsed question content');

    return new Response(JSON.stringify(questionContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


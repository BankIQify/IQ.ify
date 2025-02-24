
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Log initial request details
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    const { category, prompt } = body;
    console.log('Processing request:', { category, prompt });

    const systemPrompt = `You are an expert at creating ${category} reasoning questions for 11+ exams. 
    Create challenging but age-appropriate questions that test critical thinking skills.
    Always return the response in this exact JSON format:
    {
      "question": "The actual question text",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correctAnswer": "One of the options exactly as written above",
      "explanation": "Detailed explanation of why this is the correct answer"
    }`;

    const userPrompt = prompt || `Create an engaging ${category} reasoning question suitable for 11+ exam preparation.`;

    console.log('Making OpenAI API request...');
    
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
      const errorText = await response.text();
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received');

    // Parse the response content to ensure it's valid JSON
    const generatedContent = data.choices[0].message.content;
    let questionData;
    try {
      questionData = JSON.parse(generatedContent);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate the question data structure
    if (!questionData.question || !questionData.options || !questionData.correctAnswer || !questionData.explanation) {
      console.error('Invalid question data structure:', questionData);
      throw new Error('Generated question does not match required format');
    }

    console.log('Successfully generated question');
    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Function invoked:', new Date().toISOString());

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  try {
    // Validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Received request with category:', body.category);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      throw new Error('Invalid request format');
    }

    const { category, prompt } = body;
    if (!category) {
      throw new Error('Category is required');
    }

    // Prepare OpenAI request
    const messages = [
      {
        role: 'system',
        content: `You are an expert at creating ${category} reasoning questions for 11+ exams. Create challenging but age-appropriate questions that test critical thinking skills.`
      },
      {
        role: 'user',
        content: prompt || `Create an engaging ${category} reasoning question suitable for 11+ exam preparation.`
      }
    ];

    console.log('Sending request to OpenAI...');
    
    // Make OpenAI API request
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', {
        status: openAIResponse.status,
        statusText: openAIResponse.statusText,
        error: errorText
      });
      throw new Error(`OpenAI API error (${openAIResponse.status}): ${openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('Received response from OpenAI');

    // Extract and validate the generated content
    const content = openAIData.choices[0].message.content;
    let questionData;
    try {
      questionData = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate question structure
    const requiredFields = ['question', 'options', 'correctAnswer', 'explanation'];
    for (const field of requiredFields) {
      if (!questionData[field]) {
        console.error('Missing required field:', field);
        throw new Error(`Generated question missing required field: ${field}`);
      }
    }

    if (!Array.isArray(questionData.options) || questionData.options.length !== 4) {
      console.error('Invalid options array:', questionData.options);
      throw new Error('Generated question must have exactly 4 options');
    }

    if (!questionData.options.includes(questionData.correctAnswer)) {
      console.error('Correct answer not in options:', {
        correctAnswer: questionData.correctAnswer,
        options: questionData.options
      });
      throw new Error('Correct answer must be one of the options');
    }

    console.log('Successfully generated and validated question');

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

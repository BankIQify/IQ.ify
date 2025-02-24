
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
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const { category, prompt } = await req.json();
    console.log('Request received:', { category, hasPrompt: !!prompt });

    if (!category) {
      throw new Error('Category is required');
    }

    // Prepare system message based on category
    const systemMessage = `You are an expert at creating ${category} reasoning questions for 11+ exams. Create a challenging but age-appropriate question that tests critical thinking skills.
    
    Return the question in this EXACT JSON format:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option (must be one of the options)",
      "explanation": "Detailed explanation of the answer"
    }`;

    // Make OpenAI API request
    console.log('Sending request to OpenAI...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt || `Create an engaging ${category} reasoning question suitable for 11+ exam preparation.` }
        ],
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
    if (!openAIData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', openAIData);
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = openAIData.choices[0].message.content;
    console.log('Generated content:', generatedContent);

    let questionData;
    try {
      questionData = JSON.parse(generatedContent);
    } catch (error) {
      console.error('Failed to parse generated content:', error);
      throw new Error('Invalid JSON format in OpenAI response');
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

    console.log('Question validation successful, returning data');
    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

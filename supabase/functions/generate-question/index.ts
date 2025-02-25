
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
    console.log('Received request with:', { category, subTopicId, prompt });

    if (!category || !subTopicId) {
      throw new Error('Category and subTopicId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a friendly teacher who creates fun questions for children. Create an array of exactly 5 questions.
      Each question should:
      1. Use simple, child-friendly language
      2. Include colorful imagery and fun examples
      3. Make learning feel like a game or adventure
      4. Have exactly 4 options labeled A), B), C), D)
      5. Have exactly ONE correct answer
      6. Include a friendly, encouraging explanation
      7. Use emojis where appropriate

      Return ONLY a JSON array containing exactly 5 question objects in this exact format:
      [
        {
          "question": "The fun question text with emojis",
          "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
          "correctAnswer": "A) First option",
          "explanation": "A friendly explanation"
        }
      ]`;

    const userPrompt = prompt?.trim() || `Create 5 engaging ${category} questions for children!`;

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
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the response content as JSON
    let questions;
    try {
      questions = JSON.parse(data.choices[0].message.content);
      console.log('Parsed questions:', questions);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse questions from OpenAI response');
    }

    // Validate the questions array
    if (!Array.isArray(questions) || questions.length !== 5) {
      console.error('Invalid questions format:', questions);
      throw new Error('Expected exactly 5 questions in response');
    }

    // Validate each question object
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 
          || !q.correctAnswer || !q.explanation) {
        console.error(`Invalid question format at index ${index}:`, q);
        throw new Error(`Question ${index + 1} has invalid format`);
      }
    });

    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

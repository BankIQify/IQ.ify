
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { category, subTopicId, prompt } = await req.json();
    console.log('Generating questions for:', { category, subTopicId, prompt });

    if (!category || !subTopicId) {
      throw new Error('Category and subTopicId are required');
    }

    const customInstructions = prompt?.trim() || '';

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
            content: `You are a friendly teacher who creates fun questions for children. Create an array of exactly 5 questions.
              Each question should:
              1. Use simple, child-friendly language
              2. Include colorful imagery and fun examples
              3. Make learning feel like a game or adventure
              4. Have exactly 4 options labeled A), B), C), D)
              5. Have exactly ONE correct answer
              6. Include a friendly, encouraging explanation
              7. Use emojis and imagery where appropriate

              Return ONLY a JSON array containing exactly 5 question objects in this exact format:
              [
                {
                  "question": "The fun question text with emojis and imagery",
                  "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
                  "correctAnswer": "A) First option",
                  "explanation": "A friendly, colorful explanation that makes learning fun"
                }
              ]`
          },
          {
            role: 'user',
            content: customInstructions || `Create 5 engaging ${category} questions for children!`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from OpenAI:', data);
      throw new Error('Invalid response from AI');
    }

    const generatedContent = data.choices[0].message.content;
    let questionsData;

    try {
      questionsData = JSON.parse(generatedContent);
      
      // Validate the response format
      if (!Array.isArray(questionsData) || questionsData.length !== 5) {
        throw new Error('Expected exactly 5 questions');
      }

      for (const question of questionsData) {
        if (!question.question || !Array.isArray(question.options) || 
            question.options.length !== 4 || !question.correctAnswer || 
            !question.explanation) {
          throw new Error('Invalid question format');
        }
      }

      console.log('Questions generated successfully:', questionsData);
      return new Response(JSON.stringify(questionsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI response:', generatedContent);
      throw new Error('Failed to parse AI response');
    }
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

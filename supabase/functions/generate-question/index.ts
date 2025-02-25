
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, subTopicId, prompt } = await req.json();
    console.log('Generating questions for:', { category, subTopicId, prompt });

    if (!category || !subTopicId) {
      throw new Error('Category and subTopicId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const categoryInstructions = {
      verbal: `Create 5 fun verbal reasoning questions for children! For each question remember to:
        1. Use simple, friendly language that a child would understand
        2. Include colorful examples or stories with animals, toys, or everyday objects
        3. Make the explanation engaging and visual
        4. Include exactly 4 options labeled A), B), C), D)
        5. Only ONE answer can be correct
        6. Make the explanation fun and memorable`,
      non_verbal: `Create 5 exciting visual puzzles for children! For each question remember to:
        1. Use shapes, patterns, or pictures that children love
        2. Include colorful examples with fun objects like stars, hearts, or animals
        3. Make the explanation like a treasure hunt or adventure
        4. Include exactly 4 options labeled A), B), C), D)
        5. Only ONE answer can be correct
        6. Make the explanation playful and easy to remember`,
      brain_training: `Create 5 brain-tickling puzzles for children! For each question remember to:
        1. Use fun scenarios like planning a birthday party or organizing toys
        2. Include colorful examples with familiar objects
        3. Make it feel like a game or adventure
        4. Include exactly 4 options labeled A), B), C), D)
        5. Only ONE answer can be correct
        6. Make the explanation exciting and memorable`
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
            content: `You are a friendly teacher who creates fun questions for children. Create an array of exactly 5 questions. Each question should:
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
                },
                // ... 4 more question objects with the same format
              ]`
          },
          { role: 'user', content: customInstructions }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error status:', response.status);
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

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

      console.log('Questions generated successfully');
      return new Response(JSON.stringify(questionsData), {
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


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
    console.log('Received request with:', { category, subTopicId, prompt });

    if (!category || !subTopicId) {
      throw new Error('Category and subTopicId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert teacher creating multiple choice questions. Follow these instructions precisely:

1. Create EXACTLY 5 questions that match the user's requested difficulty level and specifications
2. If no specific difficulty is mentioned, create questions suitable for children
3. Each question MUST have exactly 4 options labeled A), B), C), D)
4. Only ONE option can be correct
5. The explanation should match the complexity level of the question
6. Pay close attention to any specific requirements in the user's prompt

Return ONLY a JSON array with exactly 5 questions in this format:
[
  {
    "question": "Question text here",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "correctAnswer": "A) First option",
    "explanation": "Brief explanation here"
  }
]`;

    const userPrompt = prompt?.trim() || `Create 5 ${category} questions suitable for children.`;

    console.log('Sending request to OpenAI with:', {
      systemPrompt,
      userPrompt
    });

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
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    let questions;
    try {
      const content = data.choices[0].message.content.trim();
      questions = JSON.parse(content);
      console.log('Parsed questions:', questions);

      if (!Array.isArray(questions) || questions.length !== 5) {
        throw new Error('Expected exactly 5 questions in response');
      }

      questions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 
            || !q.correctAnswer || !q.explanation) {
          throw new Error(`Question ${index + 1} has invalid format`);
        }
      });

    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }

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

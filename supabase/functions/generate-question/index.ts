
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

    // Enhanced system prompt that emphasizes theme adherence
    const systemPrompt = `You are an expert educational content creator specializing in ${category} questions. You must create exactly 5 questions that strictly follow any theme or requirements specified in the user's prompt.

CRITICAL REQUIREMENTS:
1. Return ONLY a raw JSON array with 5 questions, no markdown or extra text
2. STRICTLY FOLLOW the user's theme/requirements if provided
3. If no specific theme is given, create age-appropriate questions for the ${category} category
4. Questions should be challenging but solvable
5. Match the explanation's complexity to the question's difficulty level

Each question MUST follow this exact format:
{
  "question": "Question text here",
  "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
  "correctAnswer": "A) First option",
  "explanation": "Brief explanation here"
}

Additional requirements:
- Each question must have exactly 4 options labeled A), B), C), D)
- Only ONE option can be correct
- Options should be plausible but clearly distinguishable
- Explanations should be clear and educational
- Format must be a plain JSON array without any markdown formatting`;

    // Enhanced user prompt handling
    const basePrompt = prompt?.trim() 
      ? `Create 5 ${category} questions with these specific requirements: ${prompt}. Make sure each question clearly relates to this theme/requirement.` 
      : `Create 5 ${category} questions suitable for school students. Mix of easy and moderate difficulty.`;

    console.log('Sending request to OpenAI with:', {
      systemPrompt,
      basePrompt
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
          { role: 'user', content: basePrompt }
        ],
        temperature: 0.7, // Slightly reduced for more focused responses
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
      const content = data.choices[0].message.content.trim()
        // Remove any markdown formatting
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log('Cleaned content before parsing:', content);
      questions = JSON.parse(content);
      
      // Validate questions structure
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

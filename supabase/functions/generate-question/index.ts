
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

    // More detailed and structured system prompt
    const systemPrompt = `You are an expert educational content creator specializing in ${category} questions. Create exactly 5 multiple-choice questions that strictly adhere to educational standards.

CRITICAL FORMAT REQUIREMENTS:
1. Return a valid JSON array with exactly 5 questions
2. Each question must have 4 options labeled A), B), C), D)
3. Options must be formatted as "A) Option text", "B) Option text", etc.
4. The correctAnswer must match exactly one of the options (including the label)
5. Every question needs a clear, educational explanation

IMPORTANT THEME INSTRUCTIONS:
- If a specific theme is provided in the prompt, all questions MUST relate directly to that theme
- If no specific theme is given, create age-appropriate questions for the ${category} category

Each question MUST follow this exact JSON structure:
{
  "question": "The question text here?",
  "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
  "correctAnswer": "A) First option",
  "explanation": "Clear educational explanation here"
}

Double-check that your response is valid JSON with no markdown formatting, extra text, or code blocks.`;

    // Enhanced user prompt handling
    const basePrompt = prompt?.trim() 
      ? `Create 5 ${category} questions specifically about: ${prompt}. Every question MUST relate directly to this theme.` 
      : `Create 5 ${category} questions suitable for students. Mix of easy and moderate difficulty.`;

    console.log('Sending request to OpenAI with prompt:', basePrompt);

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
        temperature: 0.5, // Lower temperature for more consistent outputs
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    let questions;
    try {
      // Clean up the response to ensure it's valid JSON
      const content = data.choices[0].message.content.trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log('Cleaned content before parsing:', content.substring(0, 100) + '...');
      questions = JSON.parse(content);
      
      // Validate questions structure and format
      if (!Array.isArray(questions)) {
        console.error('Response is not an array:', questions);
        throw new Error('Expected an array of questions');
      }
      
      if (questions.length !== 5) {
        console.error(`Got ${questions.length} questions instead of 5`);
        throw new Error('Expected exactly 5 questions in response');
      }

      // Validate each question
      questions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 
            || !q.correctAnswer || !q.explanation) {
          console.error(`Question ${index + 1} has invalid format:`, q);
          throw new Error(`Question ${index + 1} has invalid format`);
        }
        
        // Ensure correctAnswer matches one of the options exactly
        if (!q.options.includes(q.correctAnswer)) {
          console.error(`Question ${index + 1} has correctAnswer that doesn't match any option:`, 
            { correctAnswer: q.correctAnswer, options: q.options });
          throw new Error(`Question ${index + 1} has correctAnswer that doesn't match any option`);
        }
      });

    } catch (error) {
      console.error('Error parsing or validating OpenAI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error(`Failed to process OpenAI response: ${error.message}`);
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

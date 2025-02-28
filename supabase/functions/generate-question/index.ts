
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

    // Very detailed and explicit system prompt to enforce format
    const systemPrompt = `You are an expert educational content creator specializing in ${category} questions. Create exactly 5 multiple-choice questions that strictly adhere to educational standards.

STRICT FORMAT REQUIREMENTS:
1. Return a valid JSON array with exactly 5 questions.
2. Each question must have EXACTLY 4 options labeled A), B), C), D).
3. Options must be formatted as "A) Option text", "B) Option text", etc.
4. The correctAnswer must be EXACTLY the same string as one of the options (including the label).
5. Every question needs a clear, educational explanation.

For example, if the correct answer is option B, then correctAnswer must be the exact string "B) Option text"

Each question MUST follow this exact JSON structure:
{
  "question": "The question text here?",
  "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
  "correctAnswer": "B) Second option",
  "explanation": "Clear educational explanation here"
}

Double-check that your response is valid JSON with no markdown formatting, extra text, or code blocks.`;

    // Enhanced user prompt handling
    const basePrompt = prompt?.trim() 
      ? `Create 5 ${category} questions specifically about: ${prompt}. Every question MUST relate directly to this theme.` 
      : `Create 5 ${category} questions suitable for students. Mix of easy and moderate difficulty.`;

    console.log('Sending request to OpenAI with prompt:', basePrompt);

    // Making the request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a reliable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: basePrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent outputs
        max_tokens: 2500,
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
        questions = [questions]; // Try to fix if a single question is returned
        
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error('Expected an array of questions');
        }
      }
      
      if (questions.length > 5) {
        console.warn(`Got ${questions.length} questions, trimming to 5`);
        questions = questions.slice(0, 5);
      } else if (questions.length < 5) {
        console.warn(`Got only ${questions.length} questions instead of 5`);
      }

      // Strict validation and fixing of each question
      questions = questions.map((q, index) => {
        if (!q.question) {
          console.error(`Question ${index + 1} missing question text`);
          throw new Error(`Question ${index + 1} missing question text`);
        }
        
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          console.error(`Question ${index + 1} has invalid options:`, q.options);
          throw new Error(`Question ${index + 1} has invalid options format`);
        }
        
        // Ensure options are properly formatted with A), B), C), D)
        const formattedOptions = q.options.map((opt, i) => {
          const prefix = String.fromCharCode(65 + i) + ") ";
          return opt.startsWith(prefix) ? opt : prefix + opt.replace(/^[A-D]\)\s*/, '');
        });
        
        if (!q.correctAnswer) {
          console.error(`Question ${index + 1} missing correctAnswer`);
          throw new Error(`Question ${index + 1} missing correctAnswer`);
        }
        
        // Extract correct answer letter to find its index
        const correctAnswerMatch = q.correctAnswer.match(/^([A-D])\)/);
        if (!correctAnswerMatch) {
          console.error(`Question ${index + 1} has invalidly formatted correctAnswer:`, q.correctAnswer);
          // Try to fix by finding which option matches the correct answer text
          const correctAnswerText = q.correctAnswer.replace(/^[A-D]\)\s*/, '').trim();
          let matchIndex = formattedOptions.findIndex(opt => 
            opt.replace(/^[A-D]\)\s*/, '').trim() === correctAnswerText
          );
          
          if (matchIndex === -1) {
            console.warn(`Could not find matching option, defaulting to first option`);
            matchIndex = 0;
          }
          
          q.correctAnswer = formattedOptions[matchIndex];
        } else {
          // Find the correct letter and ensure it matches an option
          const letter = correctAnswerMatch[1];
          const index = letter.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
          
          if (index < 0 || index >= formattedOptions.length) {
            console.error(`Question ${index + 1} correctAnswer letter out of range:`, letter);
            q.correctAnswer = formattedOptions[0];
          } else {
            // Ensure the correctAnswer exactly matches the option
            q.correctAnswer = formattedOptions[index];
          }
        }
        
        if (!q.explanation) {
          console.warn(`Question ${index + 1} missing explanation, adding generic one`);
          q.explanation = `The correct answer is ${q.correctAnswer}.`;
        }
        
        return {
          question: q.question,
          options: formattedOptions,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        };
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

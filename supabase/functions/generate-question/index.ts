
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionRequest {
  category: 'verbal' | 'non-verbal';
  prompt?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, prompt } = await req.json() as QuestionRequest;

    const systemPrompt = category === 'verbal' 
      ? "You are an expert at creating verbal reasoning questions for 11+ exams. Create challenging but age-appropriate questions."
      : "You are an expert at creating non-verbal reasoning questions for 11+ exams. Create challenging but age-appropriate pattern and sequence questions.";

    const userPrompt = prompt || `Create an engaging ${category} reasoning question suitable for 11+ exam preparation. Return the response in this JSON format:
    {
      "question": "The actual question text",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correctAnswer": "B",
      "explanation": "Detailed explanation of why this is the correct answer"
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON string from the response
    let questionData;
    try {
      questionData = JSON.parse(generatedContent);
    } catch (error) {
      console.error('Error parsing question data:', error);
      throw new Error('Failed to parse generated question data');
    }

    return new Response(
      JSON.stringify(questionData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});


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
    const { question, options, correctAnswer, imageUrl } = await req.json();

    // If no OpenAI API key is set, return a mock explanation for testing
    if (!Deno.env.get('OPENAI_API_KEY')) {
      console.warn('No OpenAI API key set, returning mock explanation');
      return new Response(
        JSON.stringify({
          explanation: "This is a mock explanation. Please set the OPENAI_API_KEY to get real AI-generated explanations."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let prompt = `Given the following question and its multiple choice options, provide a detailed explanation for why the correct answer is the right choice. Break down the reasoning process step by step.\n\nQuestion: ${question}\n\nOptions:\n`;
    
    options.forEach((option: string, index: number) => {
      prompt += `${index + 1}. ${option}\n`;
    });

    prompt += `\nCorrect Answer: ${correctAnswer}\n\n`;
    
    if (imageUrl) {
      prompt += `Note: This question includes an image that shows: [image content]. Consider this visual information in your explanation.\n\n`;
    }

    prompt += "Please provide a clear, step-by-step explanation that helps students understand how to arrive at the correct answer.";

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert tutor who provides clear, detailed explanations for educational questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return new Response(
      JSON.stringify({ explanation: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-explanation function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate explanation' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

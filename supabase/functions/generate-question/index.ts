
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    console.log('Generate question function called');

    const { category, subTopicId, prompt } = await req.json();

    if (!category) {
      throw new Error('Category is required');
    }

    if (!subTopicId) {
      throw new Error('Sub-topic ID is required');
    }

    console.log('Generating question for:', { category, subTopicId, prompt });

    // Mock question generation for now (replace with actual AI generation later)
    const question = {
      question: `Sample ${category} question ${prompt ? 'with custom prompt' : ''}`,
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctAnswer: "Option A",
      explanation: "This is a sample explanation"
    };

    console.log('Generated question:', question);

    return new Response(JSON.stringify(question), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error in generate-question function:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate question'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { generateQuestions } from "./questionGenerator.ts";
import { validateRequest } from "./validators.ts";
import { formatResponse } from "./responseFormatter.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Received request with:', requestData);
    
    // Validate the request data
    const { category, subTopicId, prompt } = validateRequest(requestData);
    
    // Generate questions using OpenAI
    const questions = await generateQuestions(category, subTopicId, prompt);
    
    // Return the formatted response
    return formatResponse(questions);
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

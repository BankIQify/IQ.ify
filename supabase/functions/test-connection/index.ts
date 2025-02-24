
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("Test connection function loaded");

serve(async (req) => {
  // Log request details
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  try {
    console.log('Test connection function called');
    
    // Return a simple success response
    const responseBody = { 
      status: 'success',
      message: 'Edge function connection working',
      timestamp: new Date().toISOString()
    };

    console.log('Sending response:', responseBody);

    return new Response(
      JSON.stringify(responseBody),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in test connection:', error);
    console.error('Error stack:', error.stack);
    
    const errorResponse = { 
      error: 'Test connection failed',
      details: error.message,
      timestamp: new Date().toISOString()
    };

    console.log('Sending error response:', errorResponse);

    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});

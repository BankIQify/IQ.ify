
import { corsHeaders } from "./cors.ts";

export function formatResponse(questions: any[]) {
  return new Response(JSON.stringify(questions), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

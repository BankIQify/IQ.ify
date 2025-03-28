
import { createErrorResponse } from "../_shared/webhook-utils.ts";

export interface WebhookPayload {
  raw_text?: string;
  sub_topic_id?: string;
  event_type?: string;
  questions?: any[];
  source?: string;
  [key: string]: any;
}

export async function parseWebhookRequest(req: Request): Promise<{ 
  payload: WebhookPayload | null; 
  error: Response | null;
  rawBody: string;
}> {
  try {
    // Get the raw body text
    const rawBody = await req.text();
    console.log('Raw payload received:', rawBody);
    
    // Check content type to determine how to process the payload
    const contentType = req.headers.get('content-type') || '';
    let payload: WebhookPayload | null = null;
    
    if (contentType.includes('application/json')) {
      // Try to parse as JSON if content-type indicates JSON
      try {
        // Try to clean up the JSON by removing problematic characters
        const cleanedJson = rawBody
          .replace(/###\s*[^#\n]+/g, '') // Remove "### Something" headings
          .replace(/#/g, '') // Remove any remaining # characters
          .trim();
          
        console.log('Cleaned JSON for parsing:', cleanedJson);
        
        try {
          payload = JSON.parse(cleanedJson);
          console.log('Parsed JSON payload:', JSON.stringify(payload, null, 2));
        } catch (innerParseError) {
          console.error('Clean JSON parse also failed:', innerParseError.message);
          throw innerParseError;
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        console.log('Treating payload as raw text due to JSON parse error');
        
        // If JSON parsing fails but we have text, treat it as raw text submission
        if (rawBody.trim()) {
          const subTopicId = extractSubTopicId(rawBody);
          
          if (subTopicId) {
            console.log('Extracted sub_topic_id from text:', subTopicId);
            payload = {
              raw_text: rawBody,
              sub_topic_id: subTopicId
            };
          } else {
            console.error('Could not extract sub_topic_id from the text payload');
            return { 
              payload: null, 
              error: createErrorResponse('Could not parse as JSON and no sub_topic_id was found in the text. Please include sub_topic_id: UUID in the text.', 400),
              rawBody
            };
          }
        } else {
          return { 
            payload: null, 
            error: createErrorResponse(`Invalid JSON payload: ${parseError.message}. Please ensure you're sending valid JSON.`, 400),
            rawBody
          };
        }
      }
    } else if (contentType.includes('text/plain') || contentType.includes('text')) {
      // Handle plain text content - try to extract sub_topic_id
      console.log('Processing as plain text content');
      
      const subTopicId = extractSubTopicId(rawBody);
      
      if (subTopicId) {
        console.log('Extracted sub_topic_id from text:', subTopicId);
        payload = {
          raw_text: rawBody,
          sub_topic_id: subTopicId
        };
      } else {
        console.error('Could not extract sub_topic_id from the text payload');
        return { 
          payload: null, 
          error: createErrorResponse('Missing sub_topic_id in text payload. Please include sub_topic_id: UUID in the text.', 400),
          rawBody
        };
      }
    } else {
      // For other content types, attempt JSON parse first
      try {
        // Try to clean up the text by removing problematic characters
        const cleanedText = rawBody
          .replace(/###\s*[^#\n]+/g, '') // Remove "### Something" headings
          .replace(/#/g, '') // Remove any remaining # characters
          .trim();
        
        payload = JSON.parse(cleanedText);
      } catch (parseError) {
        // If that fails, check if it might be text with a sub_topic_id
        const subTopicId = extractSubTopicId(rawBody);
        
        if (subTopicId) {
          payload = {
            raw_text: rawBody,
            sub_topic_id: subTopicId
          };
        } else {
          console.error('Could not parse payload and no sub_topic_id found');
          return { 
            payload: null, 
            error: createErrorResponse('Unsupported content type and payload could not be parsed', 400),
            rawBody
          };
        }
      }
    }

    return { payload, error: null, rawBody };
  } catch (error) {
    console.error('Failed to read or process request body:', error);
    return { 
      payload: null, 
      error: createErrorResponse('Failed to read or process request body', 400),
      rawBody: ''
    };
  }
}

export function extractSubTopicId(text: string): string | null {
  // Look for various forms of sub_topic_id
  const subTopicIdRegexes = [
    /sub[_-]?topic[_-]?id:?\s*["']?([a-f0-9-]{36})["']?/i,
    /subtopic[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
    /subject[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
    /"subtopic(?:UUID|Id|_id)"\s*:\s*"([a-f0-9-]{36})"/i,
    /"sub_topic_id"\s*:\s*"([a-f0-9-]{36})"/i
  ];
  
  for (const regex of subTopicIdRegexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      console.log(`Extracted sub_topic_id using pattern ${regex}: ${match[1]}`);
      return match[1];
    }
  }
  
  return null;
}

export function validatePayload(payload: WebhookPayload): { valid: boolean; error: Response | null } {
  if (!payload) {
    console.error('Empty payload received');
    return { 
      valid: false, 
      error: createErrorResponse('Empty payload received', 400) 
    };
  }

  console.log('Validating payload:', JSON.stringify(payload, null, 2));

  // Check if this is a raw text submission
  if (payload.raw_text && payload.sub_topic_id) {
    console.log('Payload validation passed: raw text submission');
    return { valid: true, error: null };
  }

  // Validate the required fields based on the payload type
  if (payload.event_type === 'question_generated') {
    // For question_generated events, validate required fields
    if (!payload.sub_topic_id) {
      console.error('Missing required field: sub_topic_id');
      return { 
        valid: false, 
        error: createErrorResponse('Missing required field: sub_topic_id', 400) 
      };
    }
    
    // Questions array is optional for raw storage, but should be validated if present
    if (payload.questions && (!Array.isArray(payload.questions) || payload.questions.length === 0)) {
      console.error('Invalid questions array: must be a non-empty array');
      return { 
        valid: false, 
        error: createErrorResponse('Invalid questions array: must be a non-empty array', 400) 
      };
    }
    
    console.log('Payload validation passed: question_generated event');
    return { valid: true, error: null };
  } else if (!payload.raw_text || !payload.sub_topic_id) {
    console.error('Unrecognized payload structure without raw_text and sub_topic_id');
    return { 
      valid: false, 
      error: createErrorResponse('Unrecognized payload structure. Please check the documentation for valid formats.', 400) 
    };
  }

  console.log('Payload passed general validation');
  return { valid: true, error: null };
}


import { buildSystemPrompt, buildUserPrompt } from "./promptBuilders.ts";
import { validateAndNormalizeQuestions } from "./questionValidator.ts";

export async function generateQuestions(category: string, subTopicId: string, prompt?: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = buildSystemPrompt(category);
  const userPrompt = buildUserPrompt(category, prompt);

  console.log('Sending request to OpenAI with prompt:', userPrompt);

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
        { role: 'user', content: userPrompt }
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

  // Clean up and validate the response
  const content = data.choices[0].message.content.trim()
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  console.log('Cleaned content before parsing:', content.substring(0, 100) + '...');
  
  // Parse and validate the OpenAI response
  const questions = validateAndNormalizeQuestions(content);
  
  return questions;
}

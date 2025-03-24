
export function buildSystemPrompt(category: string) {
  return `You are an expert educational content creator specializing in ${category} questions. Create exactly 5 multiple-choice questions that strictly adhere to educational standards.

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
}

export function buildUserPrompt(category: string, prompt?: string) {
  if (prompt?.trim()) {
    return `Create 5 ${category} questions specifically about: ${prompt}. Every question MUST relate directly to this theme.`;
  } else {
    return `Create 5 ${category} questions suitable for students. Mix of easy and moderate difficulty.`;
  }
}


export function validateAndNormalizeQuestions(content: string) {
  try {
    let questions = JSON.parse(content);
    
    // Ensure we have an array of questions
    if (!Array.isArray(questions)) {
      console.error('Response is not an array:', questions);
      questions = [questions]; // Try to fix if a single question is returned
      
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Expected an array of questions');
      }
    }
    
    // Limit to 5 questions
    if (questions.length > 5) {
      console.warn(`Got ${questions.length} questions, trimming to 5`);
      questions = questions.slice(0, 5);
    } else if (questions.length < 5) {
      console.warn(`Got only ${questions.length} questions instead of 5`);
    }

    // Validate and normalize each question
    return questions.map((q: any, index: number) => validateQuestion(q, index));
  } catch (error) {
    console.error('Error parsing or validating OpenAI response:', error);
    throw new Error(`Failed to process OpenAI response: ${error.message}`);
  }
}

function validateQuestion(question: any, index: number) {
  if (!question.question) {
    console.error(`Question ${index + 1} missing question text`);
    throw new Error(`Question ${index + 1} missing question text`);
  }
  
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    console.error(`Question ${index + 1} has invalid options:`, question.options);
    throw new Error(`Question ${index + 1} has invalid options format`);
  }
  
  // Ensure options are properly formatted with A), B), C), D)
  const formattedOptions = question.options.map((opt: string, i: number) => {
    const prefix = String.fromCharCode(65 + i) + ") ";
    return opt.startsWith(prefix) ? opt : prefix + opt.replace(/^[A-D]\)\s*/, '');
  });
  
  if (!question.correctAnswer) {
    console.error(`Question ${index + 1} missing correctAnswer`);
    throw new Error(`Question ${index + 1} missing correctAnswer`);
  }
  
  // Extract correct answer letter to find its index
  const correctAnswerMatch = question.correctAnswer.match(/^([A-D])\)/);
  let formattedCorrectAnswer = question.correctAnswer;
  
  if (!correctAnswerMatch) {
    console.error(`Question ${index + 1} has invalidly formatted correctAnswer:`, question.correctAnswer);
    // Try to fix by finding which option matches the correct answer text
    const correctAnswerText = question.correctAnswer.replace(/^[A-D]\)\s*/, '').trim();
    let matchIndex = formattedOptions.findIndex((opt: string) => 
      opt.replace(/^[A-D]\)\s*/, '').trim() === correctAnswerText
    );
    
    if (matchIndex === -1) {
      console.warn(`Could not find matching option, defaulting to first option`);
      matchIndex = 0;
    }
    
    formattedCorrectAnswer = formattedOptions[matchIndex];
  } else {
    // Find the correct letter and ensure it matches an option
    const letter = correctAnswerMatch[1];
    const index = letter.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
    
    if (index < 0 || index >= formattedOptions.length) {
      console.error(`Question ${index + 1} correctAnswer letter out of range:`, letter);
      formattedCorrectAnswer = formattedOptions[0];
    } else {
      // Ensure the correctAnswer exactly matches the option
      formattedCorrectAnswer = formattedOptions[index];
    }
  }
  
  if (!question.explanation) {
    console.warn(`Question ${index + 1} missing explanation, adding generic one`);
    question.explanation = `The correct answer is ${formattedCorrectAnswer}.`;
  }
  
  return {
    question: question.question,
    options: formattedOptions,
    correctAnswer: formattedCorrectAnswer,
    explanation: question.explanation
  };
}

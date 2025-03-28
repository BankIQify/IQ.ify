
export function validateRequest(data: any) {
  const { category, subTopicId, prompt } = data;
  
  if (!category || !subTopicId) {
    throw new Error('Category and subTopicId are required');
  }
  
  return { 
    category, 
    subTopicId, 
    prompt: prompt?.trim() || undefined 
  };
}

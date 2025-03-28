
import type { QuestionCategory } from "@/types/questions";
import { verbalReasoningLayouts } from "./verbal-layouts";
import { nonVerbalReasoningLayouts } from "./non-verbal-layouts";
import { brainTrainingLayouts } from "./brain-training-layouts";
import { generateContentStructure } from "./content-generator";
export { type AnswerLayout, type AnswerLayoutConfig } from "./types";

// Export a function to get the answer layout for a specific sub-topic
export const getSubTopicLayout = (
  subTopicId: string, 
  subTopics: Array<{ id: string; name: string }>,
  category: QuestionCategory
) => {
  if (!subTopicId || !subTopics || subTopics.length === 0) {
    return null;
  }
  
  // Find the sub-topic by ID
  const subTopic = subTopics.find(st => st.id === subTopicId);
  if (!subTopic) {
    return null;
  }
  
  // Convert the name to lowercase and replace spaces with underscores for lookup
  const normalizedName = subTopic.name.toLowerCase().replace(/\s+/g, '_');
  
  // Handle layouts based on category
  if (category === "verbal") {
    return verbalReasoningLayouts[normalizedName] || null;
  } else if (category === "non_verbal") {
    return nonVerbalReasoningLayouts[normalizedName] || null;
  } else if (category === "brain_training") {
    return brainTrainingLayouts[normalizedName] || null;
  }
  
  return null;
};

// Re-export the content structure generator
export { generateContentStructure };

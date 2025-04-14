import type { QuestionCategory } from "@/types/questions";
import { verbalReasoningLayouts } from "./verbal-layouts";
import { nonVerbalReasoningLayouts } from "./non-verbal-layouts";
import { brainTrainingLayouts } from "./brain-training-layouts";
import { generateContentStructure } from "./content-generator";
import type { AnswerLayout, AnswerLayoutConfig } from "./types";

// Export types
export type { AnswerLayout, AnswerLayoutConfig };

// Export layouts
export const layouts = {
  verbal: verbalReasoningLayouts,
  non_verbal: nonVerbalReasoningLayouts,
  brain_training: brainTrainingLayouts
};

// Export content generator
export { generateContentStructure };

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
  if (!subTopic) return null;

  // Get the appropriate layout based on the category
  switch (category) {
    case "verbal":
      return layouts.verbal[subTopic.name.toLowerCase()] || null;
    case "non_verbal":
      return layouts.non_verbal[subTopic.name.toLowerCase()] || null;
    case "brain_training":
      return layouts.brain_training[subTopic.name.toLowerCase()] || null;
    default:
      return null;
  }
};

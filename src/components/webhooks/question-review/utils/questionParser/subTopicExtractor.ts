
import { subTopicIdPatterns } from './regexPatterns';

/**
 * Extracts a sub-topic ID from the raw text if present
 */
export const extractSubTopicId = (rawText: string): string | undefined => {
  if (!rawText) return undefined;
  
  for (const regex of subTopicIdPatterns) {
    const match = rawText.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return undefined;
};

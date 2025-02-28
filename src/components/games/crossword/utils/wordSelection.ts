
import { WordClue } from "./wordLists";

// Filter words based on difficulty
export function filterWordsByDifficulty(words: WordClue[], minLength: number, maxLength: number): WordClue[] {
  return words.filter(w => w.word.length >= minLength && w.word.length <= maxLength);
}

// Select random words from a filtered list
export function selectRandomWords(filteredWords: WordClue[], count: number): WordClue[] {
  const selectedWords: WordClue[] = [];
  const maxAttempts = filteredWords.length;
  let attempts = 0;
  
  while (selectedWords.length < count && attempts < maxAttempts) {
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const word = filteredWords[randomIndex];
    
    // Check if word has already been selected
    if (!selectedWords.some(w => w.word === word.word)) {
      selectedWords.push(word);
    }
    
    attempts++;
  }
  
  return selectedWords;
}


import type { Difficulty } from "@/components/games/GameSettings";

export interface Question {
  id: number;
  type: 'pattern' | 'numerical' | 'logical' | 'analogy' | 'spatial' | 'verbal';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}


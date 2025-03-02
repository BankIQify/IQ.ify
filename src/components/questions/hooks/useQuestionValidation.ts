
import { toast } from "@/hooks/use-toast";
import type { QuestionType } from "@/types/questions";

export const useQuestionValidation = () => {
  const validateQuestionData = (
    questionType: QuestionType,
    subTopicId: string,
    manualQuestion: string,
    options: string[],
    primaryOptions: string[],
    secondaryOptions: string[],
    correctTextAnswer: string,
    questionImage: File | null,
    answerImage: File | null
  ): boolean => {
    if (!subTopicId) {
      toast({
        title: "Error",
        description: "Please select a sub-topic",
        variant: "destructive"
      });
      return false;
    }

    if (!manualQuestion) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "multiple_choice" && options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all options for multiple choice question",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "dual_choice" && 
        (primaryOptions.some(opt => !opt.trim()) || secondaryOptions.some(opt => !opt.trim()))) {
      toast({
        title: "Error",
        description: "Please fill in all options for both lists in dual choice question",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "text" && !correctTextAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please provide the correct text answer",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "image" && (!questionImage || !answerImage)) {
      toast({
        title: "Error",
        description: "Please upload both question and answer images",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return { validateQuestionData };
};

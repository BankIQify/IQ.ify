import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useExamReview = () => {
  const { toast } = useToast();
  const [reviewMode, setReviewMode] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);

  const startReviewMode = () => {
    setReviewMode(true);
  };
  
  const exitReviewMode = () => {
    setReviewMode(false);
  };

  return {
    reviewMode,
    examCompleted,
    setExamCompleted,
    startReviewMode,
    exitReviewMode
  };
};


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
    
    // Upon exiting review mode, clear all exam data
    if (examCompleted) {
      toast({
        title: "Exam Discarded",
        description: "This exam has been completed and will not be saved."
      });
    }
  };

  return {
    reviewMode,
    examCompleted,
    setExamCompleted,
    startReviewMode,
    exitReviewMode
  };
};

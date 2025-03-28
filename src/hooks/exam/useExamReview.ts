<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
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
<<<<<<< HEAD
=======
    
    // Upon exiting review mode, clear all exam data
    if (examCompleted) {
      toast({
        title: "Exam Discarded",
        description: "This exam has been completed and will not be saved."
      });
    }
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  };

  return {
    reviewMode,
    examCompleted,
    setExamCompleted,
    startReviewMode,
    exitReviewMode
  };
};

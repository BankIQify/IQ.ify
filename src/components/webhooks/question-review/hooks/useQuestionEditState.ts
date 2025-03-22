
import { useState, useEffect } from "react";
import { QuestionItem } from "../types";

export const useQuestionEditState = (
  question: QuestionItem,
  onUpdateQuestion?: (updatedQuestion: QuestionItem) => void,
  selectedSubTopicId?: string
) => {
  const [editedQuestion, setEditedQuestion] = useState<QuestionItem>(question);

  useEffect(() => {
    if (selectedSubTopicId && !editedQuestion.subTopicId) {
      handleChange("subTopicId", selectedSubTopicId);
    }
  }, [selectedSubTopicId]);

  const handleChange = (field: keyof QuestionItem, value: string) => {
    setEditedQuestion((prev) => {
      const updated = { ...prev, [field]: value };
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };
  
  const handleQuestionChange = (value: string) => {
    handleChange("question", value);
  };
  
  const handleExplanationChange = (value: string) => {
    handleChange("explanation", value);
  };
  
  const handleDifficultyChange = (value: string) => {
    handleChange("difficulty", value);
  };
  
  const handleCorrectAnswerChange = (value: string) => {
    handleChange("correctAnswer", value);
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.options) {
      const options = Array(4).fill("");
      setEditedQuestion((prev) => {
        const updated = { ...prev, options };
        if (onUpdateQuestion) onUpdateQuestion(updated);
        return updated;
      });
      return;
    }
    
    const newOptions = [...editedQuestion.options];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, options: newOptions };
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  const handlePrimaryOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.primaryOptions) return;
    
    const newOptions = [...editedQuestion.primaryOptions];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, primaryOptions: newOptions };
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  const handleSecondaryOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.secondaryOptions) return;
    
    const newOptions = [...editedQuestion.secondaryOptions];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, secondaryOptions: newOptions };
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  const addOption = () => {
    if (!editedQuestion.options) {
      setEditedQuestion((prev) => {
        const updated = { ...prev, options: [""] };
        if (onUpdateQuestion) onUpdateQuestion(updated);
        return updated;
      });
      return;
    }
    
    setEditedQuestion((prev) => {
      const newOptions = [...prev.options!, ""];
      const updated = { ...prev, options: newOptions };
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  const removeOption = (optionIndex: number) => {
    if (!editedQuestion.options || editedQuestion.options.length <= 1) return;
    
    setEditedQuestion((prev) => {
      const newOptions = prev.options!.filter((_, i) => i !== optionIndex);
      
      const correctAnswer = prev.correctAnswer;
      const removedOption = prev.options![optionIndex];
      const updated = { 
        ...prev, 
        options: newOptions,
        correctAnswer: correctAnswer === removedOption ? "" : correctAnswer 
      };
      
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  const convertToTextAnswer = () => {
    setEditedQuestion((prev) => {
      const { options, ...rest } = prev;
      const updated = { 
        ...rest, 
        correctAnswer: rest.correctAnswer || "" 
      };
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  const addInitialOptions = () => {
    setEditedQuestion((prev) => {
      const initialOptions = ["", "", "", ""];
      const updated = { 
        ...prev, 
        options: initialOptions,
        correctAnswer: ""
      };
      
      if (updated.hasOwnProperty('correctAnswer') && !Array.isArray(updated.options)) {
        updated.correctAnswer = "";
      }
      
      if (onUpdateQuestion) onUpdateQuestion(updated);
      return updated;
    });
  };

  return {
    editedQuestion,
    handleChange,
    handleQuestionChange,
    handleExplanationChange,
    handleDifficultyChange,
    handleCorrectAnswerChange,
    handleOptionChange,
    handlePrimaryOptionChange,
    handleSecondaryOptionChange,
    addOption,
    removeOption,
    convertToTextAnswer,
    addInitialOptions
  };
};

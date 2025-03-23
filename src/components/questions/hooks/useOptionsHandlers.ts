
import { useState } from "react";

export const useOptionsHandlers = () => {
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [primaryOptions, setPrimaryOptions] = useState<string[]>(["", "", "", ""]);
  const [secondaryOptions, setSecondaryOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [correctPrimaryIndex, setCorrectPrimaryIndex] = useState(0);
  const [correctSecondaryIndex, setCorrectSecondaryIndex] = useState(0);
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handlePrimaryOptionChange = (index: number, value: string) => {
    const newOptions = [...primaryOptions];
    newOptions[index] = value;
    setPrimaryOptions(newOptions);
  };

  const handleSecondaryOptionChange = (index: number, value: string) => {
    const newOptions = [...secondaryOptions];
    newOptions[index] = value;
    setSecondaryOptions(newOptions);
  };
  
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      
      // Adjust correct answer index if needed
      if (correctAnswerIndex === index) {
        setCorrectAnswerIndex(0);
      } else if (correctAnswerIndex > index) {
        setCorrectAnswerIndex(correctAnswerIndex - 1);
      }
    }
  };
  
  const resetOptions = () => {
    setOptions(["", "", "", ""]);
    setPrimaryOptions(["", "", "", ""]);
    setSecondaryOptions(["", "", "", ""]);
    setCorrectAnswerIndex(0);
    setCorrectPrimaryIndex(0);
    setCorrectSecondaryIndex(0);
  };

  return {
    options,
    primaryOptions,
    secondaryOptions,
    correctAnswerIndex,
    correctPrimaryIndex,
    correctSecondaryIndex,
    setCorrectAnswerIndex,
    setCorrectPrimaryIndex,
    setCorrectSecondaryIndex,
    handleOptionChange,
    handlePrimaryOptionChange,
    handleSecondaryOptionChange,
    addOption,
    removeOption,
    resetOptions
  };
};

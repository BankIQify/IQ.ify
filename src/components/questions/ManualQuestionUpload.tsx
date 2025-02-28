
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { QuestionTypeSelector } from "./upload/QuestionTypeSelector";
import { QuestionText } from "./upload/QuestionText";
import { ImageUpload } from "./upload/ImageUpload";
import { MultipleChoiceOptions } from "./upload/MultipleChoiceOptions";
import { TextAnswer } from "./upload/TextAnswer";
import { useManualQuestionUpload } from "./hooks/useManualQuestionUpload";

export type QuestionType = Database["public"]["Enums"]["question_type"];

interface ManualQuestionUploadProps {
  subTopicId: string;
}

export const ManualQuestionUpload = ({ subTopicId }: ManualQuestionUploadProps) => {
  const {
    questionType,
    manualQuestion,
    questionImage,
    answerImage,
    options,
    correctAnswerIndex,
    correctTextAnswer,
    isProcessingManual,
    setQuestionType,
    setManualQuestion,
    setQuestionImage,
    setAnswerImage,
    handleOptionChange,
    setCorrectAnswerIndex,
    setCorrectTextAnswer,
    handleManualUpload
  } = useManualQuestionUpload(subTopicId);

  return (
    <div className="space-y-4">
      <QuestionTypeSelector 
        value={questionType}
        onChange={(value) => setQuestionType(value)}
      />

      <QuestionText
        value={manualQuestion}
        onChange={setManualQuestion}
      />

      <ImageUpload
        id="questionImage"
        label="Question Image"
        required={questionType === "image"}
        onChange={setQuestionImage}
      />

      {questionType === "multiple_choice" && (
        <MultipleChoiceOptions
          options={options}
          correctAnswerIndex={correctAnswerIndex}
          onOptionChange={handleOptionChange}
          onCorrectAnswerChange={setCorrectAnswerIndex}
        />
      )}

      {questionType === "text" && (
        <TextAnswer
          value={correctTextAnswer}
          onChange={setCorrectTextAnswer}
        />
      )}

      {questionType === "image" && (
        <ImageUpload
          id="answerImage"
          label="Answer Image"
          required
          onChange={setAnswerImage}
        />
      )}

      <Button
        onClick={handleManualUpload}
        disabled={isProcessingManual || !subTopicId}
        className="w-full"
      >
        {isProcessingManual ? "Processing..." : "Upload Question"}
      </Button>
    </div>
  );
};

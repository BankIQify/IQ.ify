
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionTypeSelector } from "./upload/QuestionTypeSelector";
import { QuestionText } from "./upload/QuestionText";
import { ImageUpload } from "./upload/ImageUpload";
import { MultipleChoiceOptions } from "./upload/MultipleChoiceOptions";
import { DualChoiceOptions } from "./upload/DualChoiceOptions";
import { TextAnswer } from "./upload/TextAnswer";
import { useManualQuestionUpload } from "./hooks/useManualQuestionUpload";
import { useQuestionData } from "@/hooks/useQuestionData";
import type { QuestionCategory, QuestionType } from "@/types/questions";

export const ManualQuestionUpload = () => {
  const [category, setCategory] = useState<QuestionCategory>("verbal");
  const [subTopicId, setSubTopicId] = useState<string>("");
  
  const { subTopics, isLoadingSubTopics } = useQuestionData(category, subTopicId);
  
  const {
    questionType,
    manualQuestion,
    explanation,
    questionImage,
    answerImage,
    options,
    correctAnswerIndex,
    correctTextAnswer,
    isProcessingManual,
    primaryOptions,
    secondaryOptions,
    correctPrimaryIndex,
    correctSecondaryIndex,
    handlePrimaryOptionChange,
    handleSecondaryOptionChange,
    setCorrectPrimaryIndex,
    setCorrectSecondaryIndex,
    setQuestionType,
    setManualQuestion,
    setExplanation,
    setQuestionImage,
    setAnswerImage,
    handleOptionChange,
    setCorrectAnswerIndex,
    setCorrectTextAnswer,
    handleManualUpload,
    addOption,
    removeOption
  } = useManualQuestionUpload(subTopicId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(value: QuestionCategory) => {
              setCategory(value);
              setSubTopicId("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verbal">Verbal Reasoning</SelectItem>
              <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
              <SelectItem value="brain_training">Brain Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="subTopic">Sub-topic</Label>
          <Select
            value={subTopicId}
            onValueChange={setSubTopicId}
            disabled={isLoadingSubTopics}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingSubTopics ? "Loading..." : "Select sub-topic"} />
            </SelectTrigger>
            <SelectContent>
              {subTopics?.map((subTopic) => (
                <SelectItem key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <QuestionTypeSelector 
        value={questionType}
        onChange={(value) => setQuestionType(value)}
      />

      <QuestionText
        value={manualQuestion}
        onChange={setManualQuestion}
      />
      
      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Provide an explanation for the answer"
          rows={3}
        />
      </div>

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
          onAddOption={addOption}
          onRemoveOption={removeOption}
        />
      )}

      {questionType === "dual_choice" && (
        <DualChoiceOptions
          primaryOptions={primaryOptions}
          secondaryOptions={secondaryOptions}
          correctPrimaryIndex={correctPrimaryIndex}
          correctSecondaryIndex={correctSecondaryIndex}
          onPrimaryOptionChange={handlePrimaryOptionChange}
          onSecondaryOptionChange={handleSecondaryOptionChange}
          onCorrectPrimaryChange={setCorrectPrimaryIndex}
          onCorrectSecondaryChange={setCorrectSecondaryIndex}
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

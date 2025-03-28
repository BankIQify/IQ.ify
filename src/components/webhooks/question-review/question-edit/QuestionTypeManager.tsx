
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { MultipleChoiceEditor } from "./MultipleChoiceEditor";
import { DualChoiceEditor } from "./DualChoiceEditor";
import { TextAnswerEditor } from "./TextAnswerEditor";
import { QuestionItem } from "../types";

interface QuestionTypeManagerProps {
  question: QuestionItem;
  onOptionChange: (index: number, value: string) => void;
  onPrimaryOptionChange?: (index: number, value: string) => void;
  onSecondaryOptionChange?: (index: number, value: string) => void;
  onCorrectAnswerChange: (value: string) => void;
  onCorrectPrimaryAnswerChange?: (value: string) => void;
  onCorrectSecondaryAnswerChange?: (value: string) => void;
  onAddOption?: () => void;
  onRemoveOption?: (index: number) => void;
  onConvertToTextAnswer?: () => void;
  onAddInitialOptions?: () => void;
  index?: number;
}

export const QuestionTypeManager = ({
  question,
  onOptionChange,
  onPrimaryOptionChange = () => {},
  onSecondaryOptionChange = () => {},
  onCorrectAnswerChange,
  onCorrectPrimaryAnswerChange = () => {},
  onCorrectSecondaryAnswerChange = () => {},
  onAddOption = () => {},
  onRemoveOption = () => {},
  onConvertToTextAnswer = () => {},
  onAddInitialOptions = () => {},
  index = 0
}: QuestionTypeManagerProps) => {
  const isDualChoice = !!question.primaryOptions && !!question.secondaryOptions;
  const hasMultipleChoice = !!question.options && Array.isArray(question.options);

  return (
    <>
      <QuestionTypeSelector
        hasMultipleChoice={hasMultipleChoice}
        onSelectTextAnswer={onConvertToTextAnswer}
        onSelectMultipleChoice={onAddInitialOptions}
      />

      {hasMultipleChoice && !isDualChoice && (
        <MultipleChoiceEditor
          options={question.options!}
          correctAnswer={question.correctAnswer}
          onOptionChange={onOptionChange}
          onCorrectAnswerChange={onCorrectAnswerChange}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
        />
      )}

      {isDualChoice && (
        <DualChoiceEditor
          primaryOptions={question.primaryOptions || []}
          secondaryOptions={question.secondaryOptions || []}
          correctPrimaryAnswer={question.correctPrimaryAnswer}
          correctSecondaryAnswer={question.correctSecondaryAnswer}
          onPrimaryOptionChange={onPrimaryOptionChange}
          onSecondaryOptionChange={onSecondaryOptionChange}
          onCorrectPrimaryAnswerChange={onCorrectPrimaryAnswerChange}
          onCorrectSecondaryAnswerChange={onCorrectSecondaryAnswerChange}
        />
      )}

      {(!hasMultipleChoice && !isDualChoice) && (
        <TextAnswerEditor
          correctAnswer={question.correctAnswer || ""}
          onCorrectAnswerChange={onCorrectAnswerChange}
          index={index}
        />
      )}
    </>
  );
};

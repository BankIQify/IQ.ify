
import { Card, CardContent } from "@/components/ui/card";
import { QuestionItem } from "./types";
import { QuestionBasicFields, DifficultySelector } from "./question-edit";
import { useQuestionEditState } from "./hooks/useQuestionEditState";
import { QuestionTypeManager } from "./question-edit/QuestionTypeManager";
import { SubTopicDisplay } from "./question-edit/SubTopicDisplay";

interface QuestionEditCardProps {
  question: QuestionItem;
  index: number;
  onUpdateQuestion: (updatedQuestion: QuestionItem) => void;
  category?: string;
  selectedSubTopicId?: string;
}

export const QuestionEditCard = ({ 
  question, 
  index, 
  onUpdateQuestion, 
  category = "verbal",
  selectedSubTopicId 
}: QuestionEditCardProps) => {
  const {
    editedQuestion,
    handleChange,
    handleOptionChange,
    handlePrimaryOptionChange,
    handleSecondaryOptionChange,
    addOption,
    removeOption,
    convertToTextAnswer,
    addInitialOptions
  } = useQuestionEditState(question, onUpdateQuestion, selectedSubTopicId);

  const shouldShowDifficulty = category === "brain_training";

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-4">
        <QuestionBasicFields
          question={editedQuestion.question || ""}
          explanation={editedQuestion.explanation || ""}
          onQuestionChange={(value) => handleChange("question", value)}
          onExplanationChange={(value) => handleChange("explanation", value)}
          index={index}
        />
        
        <QuestionTypeManager
          question={editedQuestion}
          onOptionChange={handleOptionChange}
          onPrimaryOptionChange={handlePrimaryOptionChange}
          onSecondaryOptionChange={handleSecondaryOptionChange}
          onCorrectAnswerChange={(value) => handleChange("correctAnswer", value)}
          onCorrectPrimaryAnswerChange={(value) => handleChange("correctPrimaryAnswer", value)}
          onCorrectSecondaryAnswerChange={(value) => handleChange("correctSecondaryAnswer", value)}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onConvertToTextAnswer={convertToTextAnswer}
          onAddInitialOptions={addInitialOptions}
          index={index}
        />

        {shouldShowDifficulty && (
          <DifficultySelector
            difficulty={editedQuestion.difficulty || "medium"}
            onDifficultyChange={(value) => handleChange("difficulty", value)}
            index={index}
          />
        )}

        <SubTopicDisplay subTopicId={editedQuestion.subTopicId} />
      </CardContent>
    </Card>
  );
};

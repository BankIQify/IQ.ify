import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionGenerator } from "@/components/questions/QuestionGenerator";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { useQuestionData } from "@/hooks/useQuestionData";
import type { QuestionCategory } from "@/types/questions";
import { getSubTopicLayout } from "@/components/questions/utils/answer-layouts";
import { QuestionWithDuplicateFlag } from "@/components/questions/utils/duplicationDetector";

interface GenerateQuestionsTabProps {
  category: QuestionCategory;
  subTopicId: string;
  onCategoryChange: (category: QuestionCategory) => void;
  onSubTopicChange: (id: string) => void;
}

export const GenerateQuestionsTab = ({
  category,
  subTopicId,
  onCategoryChange,
  onSubTopicChange
}: GenerateQuestionsTabProps) => {
  const { subTopics, questions, isLoading, isLoadingSubTopics } = useQuestionData(category, subTopicId);
  
  // Get the answer layout for the selected sub-topic
  const answerLayout = getSubTopicLayout(subTopicId, subTopics || [], category);

  // Convert questions to include hasSimilar property
  const questionsWithDuplicateFlags: QuestionWithDuplicateFlag[] = questions?.map(q => ({
    id: q.id,
    content: q.content,
    question_type: q.question_type,
    sub_topics: q.sub_topics.map((st: any) => ({
      id: st.id,
      name: st.name,
      question_sections: st.question_sections
    })),
    hasSimilar: false  // Default to false since we're not checking for duplicates here
  })) || [];

  return (
    <>
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value: QuestionCategory) => {
                onCategoryChange(value);
                onSubTopicChange("");
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
              onValueChange={onSubTopicChange}
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

          {answerLayout && (
            <div className="p-3 bg-muted/50 rounded-md">
              <h4 className="text-sm font-medium mb-1">Answer Format: {answerLayout.layout}</h4>
              <p className="text-sm text-muted-foreground">{answerLayout.description}</p>
              {answerLayout.layout === "dual_choice" ? (
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Primary Options: {answerLayout.optionsCount}</p>
                  <p className="text-xs text-muted-foreground">Secondary Options: {answerLayout.secondaryOptionsCount}</p>
                </div>
              ) : answerLayout.optionsCount && (
                <p className="text-xs text-muted-foreground mt-1">Options: {answerLayout.optionsCount}</p>
              )}
            </div>
          )}

          <QuestionGenerator 
            subTopicId={subTopicId} 
            category={category}
            answerLayout={answerLayout}
          />
        </div>
      </Card>

      {!subTopicId ? (
        <p className="text-gray-600">Select a sub-topic to view questions</p>
      ) : isLoading ? (
        <p className="text-gray-600">Loading questions...</p>
      ) : questionsWithDuplicateFlags.length > 0 ? (
        <QuestionsList questions={questionsWithDuplicateFlags} />
      ) : (
        <p className="text-gray-600">No questions generated yet.</p>
      )}
    </>
  );
};

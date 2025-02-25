
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionGenerator } from "@/components/questions/QuestionGenerator";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { useQuestionData } from "@/hooks/useQuestionData";
import type { QuestionCategory } from "@/types/questions";

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

          <QuestionGenerator 
            subTopicId={subTopicId} 
            category={category}
          />
        </div>
      </Card>

      {!subTopicId ? (
        <p className="text-gray-600">Select a sub-topic to view questions</p>
      ) : isLoading ? (
        <p className="text-gray-600">Loading questions...</p>
      ) : questions && questions.length > 0 ? (
        <QuestionsList questions={questions} />
      ) : (
        <p className="text-gray-600">No questions generated yet.</p>
      )}
    </>
  );
};

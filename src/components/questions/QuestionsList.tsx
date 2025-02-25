
import { Card } from "@/components/ui/card";
import type { QuestionContent } from "@/types/questions";

interface QuestionsListProps {
  questions: Array<{
    id: string;
    content: QuestionContent;
    sub_topics: {
      name: string;
    };
  }>;
}

export const QuestionsList = ({ questions }: QuestionsListProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Generated Questions</h2>
      {questions.map((question, index) => {
        const content = question.content;
        return (
          <Card key={question.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Question {index + 1}</h3>
                <span className="text-sm text-gray-500">
                  {question.sub_topics?.name}
                </span>
              </div>
              <p>{content.question}</p>
              {content.imageUrl && (
                <img 
                  src={content.imageUrl} 
                  alt="Question" 
                  className="max-w-full h-auto rounded-lg"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.options.map((option: string, i: number) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      option === content.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Explanation:</p>
                <p>{content.explanation}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

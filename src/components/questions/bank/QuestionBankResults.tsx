
import { Card } from "@/components/ui/card";
import { EditableQuestionsList } from "@/components/questions/editable-questions";
import { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";
import { Dispatch, SetStateAction } from "react";
import { Pagination } from "@/components/ui/pagination";

interface QuestionBankResultsProps {
  questions: QuestionWithDuplicateFlag[];
  isLoading: boolean;
  onQuestionDeleted?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: Dispatch<SetStateAction<number>>;
}

export const QuestionBankResults = ({ 
  questions, 
  isLoading, 
  onQuestionDeleted,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: QuestionBankResultsProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-center">Loading questions...</p>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-center">No questions match your current filters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <EditableQuestionsList 
        questions={questions} 
        onQuestionDeleted={onQuestionDeleted}
      />
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <Pagination.Content>
              <Pagination.Item
                onClick={() => onPageChange && onPageChange(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Pagination.Item>
              
              <Pagination.Item className="hidden sm:inline-flex">
                Page {currentPage} of {totalPages}
              </Pagination.Item>
              
              <Pagination.Item
                onClick={() => onPageChange && onPageChange(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
              >
                Next
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}

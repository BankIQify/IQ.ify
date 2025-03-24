
import { Card } from "@/components/ui/card";
import { EditableQuestionsList } from "@/components/questions/editable-questions";
import { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";
import { Dispatch, SetStateAction } from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

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
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange && onPageChange(prev => Math.max(prev - 1, 1))}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : 0}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              <PaginationItem className="hidden sm:inline-flex">
                <span className="flex h-9 items-center justify-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange && onPageChange(prev => Math.min(prev + 1, totalPages))}
                  aria-disabled={currentPage >= totalPages}
                  tabIndex={currentPage >= totalPages ? -1 : 0}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

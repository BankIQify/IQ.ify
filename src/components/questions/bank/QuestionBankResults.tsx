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
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Loader2, FileQuestion } from "lucide-react";

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
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-center text-blue-700 text-lg">Loading your questions...</p>
        </div>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="p-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
        <div className="flex flex-col items-center justify-center">
          <FileQuestion className="h-16 w-16 text-amber-500 mb-4" />
          <p className="text-center text-amber-800 font-medium text-lg">No questions match your current filters.</p>
          <p className="text-center text-gray-600 mt-2">Try adjusting your search criteria or adding new questions.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-blue-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
          <h3 className="text-lg font-medium text-blue-700">Questions ({questions.length})</h3>
        </div>
        <div className="p-4">
          <EditableQuestionsList 
            questions={questions} 
            onQuestionDeleted={onQuestionDeleted}
          />
        </div>
      </Card>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange && onPageChange(prev => Math.max(prev - 1, 1))}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : 0}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "bg-blue-50 border-blue-100 hover:bg-blue-100"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNum, index) => (
                pageNum === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => onPageChange && onPageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className={`${currentPage === pageNum ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'}`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange && onPageChange(prev => Math.min(prev + 1, totalPages))}
                  aria-disabled={currentPage >= totalPages}
                  tabIndex={currentPage >= totalPages ? -1 : 0}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "bg-blue-50 border-blue-100 hover:bg-blue-100"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

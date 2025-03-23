
import { EditableQuestionsList } from "../EditableQuestionsList";
import type { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface QuestionBankResultsProps {
  questions: QuestionWithDuplicateFlag[];
  isLoading: boolean;
  onQuestionDeleted?: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const QuestionBankResults = ({ 
  questions, 
  isLoading, 
  onQuestionDeleted,
  currentPage,
  totalPages,
  onPageChange
}: QuestionBankResultsProps) => {
  if (isLoading) {
    return <p className="text-gray-600">Loading questions...</p>;
  }
  
  if (questions.length === 0) {
    return <p className="text-gray-600">No questions found.</p>;
  }
  
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) {
        pages.push("ellipsis");
      }
    }
    
    // Calculate range of pages to show around current page
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Show ellipsis and last page if needed
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      <EditableQuestionsList questions={questions} onQuestionDeleted={onQuestionDeleted} />
      
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="px-4 py-2">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink 
                    href="#" 
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page as number);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};


import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface ExamPaginationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onJumpToQuestion: (index: number) => void;
}

const ExamPagination = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  onJumpToQuestion 
}: ExamPaginationProps) => {
  // Create pagination items
  const renderPaginationItems = () => {
    // For smaller exams, show all page numbers
    if (totalQuestions <= 10) {
      return Array.from({ length: totalQuestions }).map((_, index) => (
        <PaginationItem key={index}>
          <PaginationLink 
            isActive={currentQuestionIndex === index}
            onClick={() => onJumpToQuestion(index)}
            className="cursor-pointer"
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    }
    
    // For larger exams, show a subset with ellipsis
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentQuestionIndex === 0}
          onClick={() => onJumpToQuestion(0)}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Determine range around current page
    let startPage = Math.max(1, currentQuestionIndex - 1);
    let endPage = Math.min(totalQuestions - 2, currentQuestionIndex + 1);
    
    // Add ellipsis if needed before current range
    if (startPage > 1) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationLink className="cursor-pointer" onClick={() => onJumpToQuestion(Math.floor(startPage / 2))}>
            ...
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentQuestionIndex === i}
            onClick={() => onJumpToQuestion(i)}
            className="cursor-pointer"
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed after current range
    if (endPage < totalQuestions - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationLink className="cursor-pointer" onClick={() => onJumpToQuestion(Math.floor((endPage + totalQuestions - 1) / 2))}>
            ...
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Always show last page
    items.push(
      <PaginationItem key="last">
        <PaginationLink 
          isActive={currentQuestionIndex === totalQuestions - 1}
          onClick={() => onJumpToQuestion(totalQuestions - 1)}
          className="cursor-pointer"
        >
          {totalQuestions}
        </PaginationLink>
      </PaginationItem>
    );
    
    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        {renderPaginationItems()}
      </PaginationContent>
    </Pagination>
  );
};

export default ExamPagination;

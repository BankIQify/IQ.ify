
import { useMemo } from "react";
import { useQuestionBank } from "./hooks/useQuestionBank";
import { QuestionBankFilters } from "./bank/QuestionBankFilters";
import { QuestionBankResults } from "./bank/QuestionBankResults";

export const CompleteQuestionBank = () => {
  const {
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    subTopicId,
    setSubTopicId,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    showDuplicatesOnly,
    setShowDuplicatesOnly,
    subTopics,
    isLoading,
    processedQuestions,
    refreshQuestions,
    totalCount
  } = useQuestionBank();

  // Calculate total pages based on item count and items per page
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / itemsPerPage);
  }, [totalCount, itemsPerPage]);

  return (
    <div className="space-y-6">
      <QuestionBankFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        subTopicId={subTopicId}
        onSubTopicChange={setSubTopicId}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        showDuplicatesOnly={showDuplicatesOnly}
        onShowDuplicatesOnlyChange={setShowDuplicatesOnly}
        subTopics={subTopics}
      />

      <QuestionBankResults
        questions={processedQuestions}
        isLoading={isLoading}
        onQuestionDeleted={refreshQuestions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

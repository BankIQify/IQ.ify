
import { useManageQuestions } from "@/hooks/useManageQuestions";
import { QuestionManagementLayout } from "@/components/manage-questions/QuestionManagementLayout";

const ManageQuestions = () => {
  const {
    user,
    isAdmin,
    hasDataInputRole,
    pendingCount,
    activeTab,
    handleTabChange,
    showHomepageTab,
    showWebhooksTab
  } = useManageQuestions();

  if (!user || (!isAdmin && !hasDataInputRole)) {
    return null;
  }

  return (
    <QuestionManagementLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      showHomepageTab={showHomepageTab}
      showWebhooksTab={showWebhooksTab}
      pendingCount={pendingCount}
    />
  );
};

export default ManageQuestions;

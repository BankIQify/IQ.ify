
import { TabHeader } from "@/components/manage-questions/TabHeader";
import { TabContent } from "@/components/manage-questions/TabContent";
import { useManageQuestions } from "@/components/manage-questions/useManageQuestions";

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
    <div className="page-container">
      <h1 className="section-title">Question Management</h1>

      <TabHeader
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        showHomepageTab={showHomepageTab}
        showWebhooksTab={showWebhooksTab}
        pendingCount={pendingCount}
      />

      <TabContent
        activeTab={activeTab}
        showHomepageTab={showHomepageTab}
        showWebhooksTab={showWebhooksTab}
      />
    </div>
  );
};

export default ManageQuestions;

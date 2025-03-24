
import { TabHeader } from "@/components/manage-questions/TabHeader";
import { TabContent } from "@/components/manage-questions/TabContent";

interface QuestionManagementLayoutProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  showHomepageTab: boolean;
  showWebhooksTab: boolean;
  pendingCount: number;
}

export const QuestionManagementLayout = ({
  activeTab,
  handleTabChange,
  showHomepageTab,
  showWebhooksTab,
  pendingCount
}: QuestionManagementLayoutProps) => {
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


import { Tabs } from "@/components/ui/tabs";
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
    <div className="page-container p-4 md:p-6">
      <h1 className="section-title text-2xl font-bold mb-6">Question Management</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="bank">
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
      </Tabs>
    </div>
  );
};

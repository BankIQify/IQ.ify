import { useManageQuestions } from "@/hooks/useManageQuestions";
import { Tabs } from "@/components/ui/tabs";
import { TabHeader } from "./TabHeader";
import { TabContent } from "./TabContent";

export const QuestionManagementLayout = () => {
  const {
    activeTab,
    handleTabChange,
    showHomepageTab,
    showWebhooksTab,
    pendingCount
  } = useManageQuestions();

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage Questions</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
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

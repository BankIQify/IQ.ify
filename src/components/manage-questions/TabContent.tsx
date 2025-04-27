import { TabsContent } from "@/components/ui/tabs";
import { ManualQuestionUpload } from "@/components/questions/ManualQuestionUpload";
import { CategoryManager } from "@/components/questions/CategoryManager";
import { CompleteQuestionBank } from "@/components/questions/CompleteQuestionBank";
import { HomepageEditor } from "@/components/homepage/HomepageEditor";
import { GamePuzzlesManager } from "@/components/puzzles/GamePuzzlesManager";
import { WebhookQuestionReview } from "@/components/webhooks/question-review";

interface TabContentProps {
  activeTab: string;
  showHomepageTab: boolean;
  showWebhooksTab: boolean;
}

export const TabContent = ({ 
  activeTab, 
  showHomepageTab, 
  showWebhooksTab 
}: TabContentProps) => {
  console.log("TabContent rendering with activeTab:", activeTab);
  
  return (
    <>
      <TabsContent value="bank" className="mt-4">
        <CompleteQuestionBank />
      </TabsContent>

      <TabsContent value="manual" className="mt-4">
        <ManualQuestionUpload />
      </TabsContent>

      <TabsContent value="categories" className="mt-4">
        <CategoryManager />
      </TabsContent>

      <TabsContent value="puzzles" className="mt-4">
        <GamePuzzlesManager />
      </TabsContent>

      {showHomepageTab && (
        <TabsContent value="homepage" className="mt-4">
          <HomepageEditor />
        </TabsContent>
      )}

      {showWebhooksTab && (
        <TabsContent value="webhooks" className="mt-4">
          <WebhookQuestionReview />
        </TabsContent>
      )}
    </>
  );
};


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
  return (
    <>
      <TabsContent value="bank">
        <CompleteQuestionBank />
      </TabsContent>

      <TabsContent value="manual">
        <ManualQuestionUpload />
      </TabsContent>

      <TabsContent value="categories">
        <CategoryManager />
      </TabsContent>

      <TabsContent value="puzzles">
        <GamePuzzlesManager />
      </TabsContent>

      {showHomepageTab && (
        <TabsContent value="homepage">
          <HomepageEditor />
        </TabsContent>
      )}

      {showWebhooksTab && (
        <TabsContent value="webhooks">
          <WebhookQuestionReview />
        </TabsContent>
      )}
    </>
  );
};

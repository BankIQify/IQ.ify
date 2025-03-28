
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TabHeaderProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  showHomepageTab: boolean;
  showWebhooksTab: boolean;
  pendingCount: number;
}

export const TabHeader = ({
  activeTab,
  handleTabChange,
  showHomepageTab,
  showWebhooksTab,
  pendingCount,
}: TabHeaderProps) => {
  console.log("TabHeader rendering with activeTab:", activeTab);
  
  return (
    <TabsList className={`grid w-full ${showHomepageTab && showWebhooksTab ? 'grid-cols-6' : showHomepageTab || showWebhooksTab ? 'grid-cols-5' : 'grid-cols-4'}`}>
      <TabsTrigger value="bank" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
        Complete Question Bank
      </TabsTrigger>
      <TabsTrigger value="manual" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
        Manual Upload
      </TabsTrigger>
      <TabsTrigger value="categories" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
        Manage Categories
      </TabsTrigger>
      <TabsTrigger value="puzzles" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
        Puzzle Games
      </TabsTrigger>
      
      {showHomepageTab && (
        <TabsTrigger value="homepage" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2">
          Edit Homepage
        </TabsTrigger>
      )}
      
      {showWebhooksTab && (
        <TabsTrigger value="webhooks" className="whitespace-normal text-center text-xs sm:text-sm h-auto py-2 relative">
          AI Webhooks
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs absolute -top-2 -right-2">
              {pendingCount}
            </Badge>
          )}
        </TabsTrigger>
      )}
    </TabsList>
  );
};

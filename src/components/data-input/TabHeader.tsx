import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataInput } from "@/hooks/useDataInput";

export const TabHeader = () => {
  const { questions, webhookData } = useDataInput();

  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="manual-upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Manual Upload
      </TabsTrigger>
      <TabsTrigger value="webhook" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Webhook ({webhookData.filter(w => w.status === 'pending').length})
      </TabsTrigger>
      <TabsTrigger value="questions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Questions ({questions.length})
      </TabsTrigger>
    </TabsList>
  );
};

import { Tabs } from "@/components/ui/tabs";
import { TabHeader } from "./TabHeader";
import { TabContent } from "./TabContent";
import { useDataInput } from "@/hooks/useDataInput";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const DataInputLayout = () => {
  const { user, isDataInput, authInitialized } = useAuth();
  const { questions, webhookData, loading, error } = useDataInput();

  // Redirect if not authorized
  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || !isDataInput) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Data Input Dashboard</h1>
      
      <Tabs defaultValue="manual-upload" className="w-full">
        <TabHeader />
        <TabContent questions={questions} webhookData={webhookData} />
      </Tabs>
    </div>
  );
};

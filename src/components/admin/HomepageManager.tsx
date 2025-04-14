import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { AboutIqifyEditor } from "./AboutIqifyEditor";
import { WhyChooseIqifyEditor } from "./WhyChooseIqifyEditor";
import { HighlightsEditor } from "./HighlightsEditor";
import { ReviewsEditor } from "./ReviewsEditor";
import { LogoCarouselEditor } from "./LogoCarouselEditor";
import { AdminWrapper } from "./AdminWrapper";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const tabs = [
  { id: "hero", label: "Hero Section", component: <HeroSectionEditor /> },
  { id: "about", label: "About IQify", component: <AboutIqifyEditor /> },
  { id: "why-choose", label: "Why Choose IQify", component: <WhyChooseIqifyEditor /> },
  { id: "highlights", label: "Highlights from HQ", component: <HighlightsEditor /> },
  { id: "reviews", label: "Reviews", component: <ReviewsEditor /> },
  { id: "companies", label: "Global Companies", component: <LogoCarouselEditor /> },
];

export const HomepageManager = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTabChange = useCallback(async (value: string) => {
    try {
      setIsLoading(true);
      setActiveTab(value);
    } catch (error) {
      console.error("Error changing tab:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to switch tabs. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Homepage Content Management</h2>
        <p className="text-muted-foreground text-base">
          Manage all sections of your homepage content from one place.
        </p>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                disabled={isLoading}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  {tab.component}
                </TabsContent>
              ))
            )}
          </Card>
        </Tabs>
      </div>
    </AdminWrapper>
  );
}; 
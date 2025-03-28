import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarPreview } from "./avatar/AvatarPreview";
import { BasicTab } from "./avatar/BasicTab";
import { AccessoriesTab } from "./avatar/AccessoriesTab";
import { ExpressionTab } from "./avatar/ExpressionTab";
import { useAvatarCreator } from "./avatar/useAvatarCreator";
import { useEffect } from "react";

export const AvatarCreator = () => {
  const {
    config,
    avatarUrl,
    loading,
    updateAvatarConfig,
    saveAvatar,
    refreshAvatar,
    profile
  } = useAvatarCreator();

  // Log whenever avatar URL changes
  useEffect(() => {
    console.log("Avatar Creator received URL:", avatarUrl);
  }, [avatarUrl]);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <AvatarPreview 
            avatarUrl={avatarUrl}
            loading={loading}
            saveAvatar={saveAvatar}
            profile={profile}
            refreshAvatar={refreshAvatar}
          />
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="expression">Expression</TabsTrigger>
            </TabsList>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <TabsContent value="basic" className="mt-0">
                <BasicTab 
                  config={config} 
                  updateAvatarConfig={updateAvatarConfig} 
                />
              </TabsContent>
              
              <TabsContent value="accessories" className="mt-0">
                <AccessoriesTab 
                  config={config} 
                  updateAvatarConfig={updateAvatarConfig} 
                />
              </TabsContent>
              
              <TabsContent value="expression" className="mt-0">
                <ExpressionTab 
                  config={config} 
                  updateAvatarConfig={updateAvatarConfig} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

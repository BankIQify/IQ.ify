<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
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
<<<<<<< HEAD
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
=======
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AvatarPreview 
          avatarUrl={avatarUrl}
          loading={loading}
          saveAvatar={saveAvatar}
          profile={profile}
          refreshAvatar={refreshAvatar}
        />
        
        <div className="md:w-2/3">
          <Tabs defaultValue="basic">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
              <TabsTrigger value="accessories" className="flex-1">Accessories</TabsTrigger>
              <TabsTrigger value="expression" className="flex-1">Expression</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6 mt-4">
              <BasicTab 
                config={config} 
                updateAvatarConfig={updateAvatarConfig} 
              />
            </TabsContent>
            
            <TabsContent value="accessories" className="space-y-6 mt-4">
              <AccessoriesTab 
                config={config} 
                updateAvatarConfig={updateAvatarConfig} 
              />
            </TabsContent>
            
            <TabsContent value="expression" className="space-y-6 mt-4">
              <ExpressionTab 
                config={config} 
                updateAvatarConfig={updateAvatarConfig} 
              />
            </TabsContent>
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

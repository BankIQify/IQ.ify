import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarPreview } from "./avatar/AvatarPreview";
import { BasicTab } from "./avatar/BasicTab";
import { AccessoriesTab } from "./avatar/AccessoriesTab";
import { ExpressionTab } from "./avatar/ExpressionTab";
import { useAvatarCreator } from "./avatar/useAvatarCreator";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AvatarCreatorProps {
  avatarConfig: Record<string, any>;
  onConfigChange: (config: Record<string, any>) => void;
}

const AvatarCreator = ({ avatarConfig, onConfigChange }: AvatarCreatorProps) => {
  const {
    config,
    avatarUrl,
    loading,
    updateAvatarConfig,
    saveAvatar,
    refreshAvatar,
    profile
  } = useAvatarCreator();

  const [selectedStyle, setSelectedStyle] = useState(avatarConfig.style || "modern");
  const [selectedColor, setSelectedColor] = useState(avatarConfig.color || "blue");
  const [selectedExpression, setSelectedExpression] = useState(avatarConfig.expression || "happy");

  const styles = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "futuristic", name: "Futuristic" }
  ];

  const colors = [
    { id: "blue", name: "Blue", hex: "#0070F3" },
    { id: "green", name: "Green", hex: "#00C851" },
    { id: "purple", name: "Purple", hex: "#AA00FF" },
    { id: "orange", name: "Orange", hex: "#FF9800" }
  ];

  const expressions = [
    { id: "happy", name: "Happy" },
    { id: "serious", name: "Serious" },
    { id: "excited", name: "Excited" },
    { id: "calm", name: "Calm" }
  ];

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    updateAvatarConfig({ ...config, style });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    updateAvatarConfig({ ...config, color });
  };

  const handleExpressionChange = (expression: string) => {
    setSelectedExpression(expression);
    updateAvatarConfig({ ...config, expression });
  };

  const handleReset = () => {
    setSelectedStyle("modern");
    setSelectedColor("blue");
    setSelectedExpression("happy");
    updateAvatarConfig({ style: "modern", color: "blue", expression: "happy" });
  };

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

      <div className="space-y-6 mt-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Avatar className="w-48 h-48 border-4 border-white shadow-lg">
            <AvatarImage
              src={`/avatars/${selectedStyle}/${selectedColor}/${selectedExpression}.svg`}
              alt="Custom Avatar"
            />
          </Avatar>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleReset}
          >
            Reset to Default
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Style</h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const dropdown = document.querySelector(`#style-dropdown`);
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
              >
                {styles.find(s => s.id === selectedStyle)?.name || "Select Style"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <div
                id="style-dropdown"
                className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 hidden"
              >
                {styles.map(style => (
                  <button
                    key={style.id}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      style.id === selectedStyle ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleStyleChange(style.id)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Color</h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const dropdown = document.querySelector(`#color-dropdown`);
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
              >
                {colors.find(c => c.id === selectedColor)?.name || "Select Color"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <div
                id="color-dropdown"
                className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 hidden"
              >
                {colors.map(color => (
                  <button
                    key={color.id}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      color.id === selectedColor ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleColorChange(color.id)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Expression</h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const dropdown = document.querySelector(`#expression-dropdown`);
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
              >
                {expressions.find(e => e.id === selectedExpression)?.name || "Select Expression"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <div
                id="expression-dropdown"
                className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 hidden"
              >
                {expressions.map(expression => (
                  <button
                    key={expression.id}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      expression.id === selectedExpression ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleExpressionChange(expression.id)}
                  >
                    {expression.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvatarCreator;


import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

type AvatarConfig = {
  gender: 'male' | 'female';
  hairColor: string;
  skinColor: string;
  earrings: boolean;
  glasses: boolean;
  mood: 'angry' | 'sad' | 'confused' | 'happy' | 'joy';
};

const defaultConfig: AvatarConfig = {
  gender: 'male',
  hairColor: 'black',
  skinColor: 'light',
  earrings: false,
  glasses: false,
  mood: 'happy'
};

const hairColors = [
  { value: 'black', label: 'Black', className: 'bg-gray-900' },
  { value: 'brown', label: 'Brown', className: 'bg-amber-900' },
  { value: 'blonde', label: 'Blonde', className: 'bg-yellow-400' },
  { value: 'red', label: 'Red', className: 'bg-red-600' },
  { value: 'gray', label: 'Gray', className: 'bg-gray-400' },
];

const skinColors = [
  { value: 'light', label: 'Light', className: 'bg-orange-200' },
  { value: 'medium', label: 'Medium', className: 'bg-orange-300' },
  { value: 'dark', label: 'Dark', className: 'bg-amber-900' },
];

const moods = [
  { value: 'joy', label: 'Joyful' },
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'angry', label: 'Angry' },
  { value: 'confused', label: 'Confused' },
];

export const AvatarCreator = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<AvatarConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Initialize with user's existing avatar config if available
  useEffect(() => {
    if (profile?.avatar_config) {
      try {
        const savedConfig = profile.avatar_config as AvatarConfig;
        setConfig(prevConfig => ({
          ...prevConfig,
          ...savedConfig
        }));
      } catch (e) {
        console.error("Error parsing avatar config:", e);
      }
    }
    
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    } else {
      generateAvatarUrl(config);
    }
  }, [profile]);

  const generateAvatarUrl = (config: AvatarConfig) => {
    // Create URL for DiceBear Micah avatar
    const queryParams = new URLSearchParams({
      gender: config.gender,
      hair: config.hairColor,
      earrings: config.earrings ? 'true' : 'false',
      glasses: config.glasses ? 'true' : 'false',
      // Add skin color as baseColor parameter
      baseColor: config.skinColor === 'light' ? 'f8d5b8' : 
                 config.skinColor === 'medium' ? 'e3b085' : '8d5524',
      mood: config.mood
    });
    
    const url = `https://api.dicebear.com/6.x/micah/svg?${queryParams.toString()}`;
    setAvatarUrl(url);
    return url;
  };

  const updateAvatarConfig = (key: keyof AvatarConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      generateAvatarUrl(newConfig);
      return newConfig;
    });
  };

  const saveAvatar = async () => {
    setLoading(true);
    try {
      await updateProfile({
        avatar_url: avatarUrl,
        avatar_config: config
      });
      
      toast({
        title: "Avatar saved",
        description: "Your new avatar has been saved successfully!",
      });
    } catch (error) {
      console.error("Error saving avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your avatar. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Your Avatar</h2>
            <p className="text-gray-500">Customize your personal avatar</p>
          </div>
          
          <div className="relative">
            <Avatar className="w-48 h-48 mb-6">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="User avatar" />
              ) : (
                <AvatarFallback>
                  {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <Button 
            onClick={saveAvatar} 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Avatar"}
          </Button>
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="basic">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
              <TabsTrigger value="accessories" className="flex-1">Accessories</TabsTrigger>
              <TabsTrigger value="expression" className="flex-1">Expression</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6 mt-4">
              <div>
                <Label className="block mb-2">Gender</Label>
                <RadioGroup 
                  value={config.gender} 
                  onValueChange={(value) => updateAvatarConfig('gender', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block mb-2">Skin Tone</Label>
                <div className="flex space-x-2">
                  {skinColors.map((skin) => (
                    <button
                      key={skin.value}
                      onClick={() => updateAvatarConfig('skinColor', skin.value)}
                      className={`w-10 h-10 rounded-full ${skin.className} ${
                        config.skinColor === skin.value ? 'ring-2 ring-offset-2 ring-education-600' : ''
                      }`}
                      title={skin.label}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Hair Color</Label>
                <div className="flex space-x-2">
                  {hairColors.map((hair) => (
                    <button
                      key={hair.value}
                      onClick={() => updateAvatarConfig('hairColor', hair.value)}
                      className={`w-10 h-10 rounded-full ${hair.className} ${
                        config.hairColor === hair.value ? 'ring-2 ring-offset-2 ring-education-600' : ''
                      }`}
                      title={hair.label}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="accessories" className="space-y-6 mt-4">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="glasses"
                    checked={config.glasses}
                    onChange={(e) => updateAvatarConfig('glasses', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="glasses">Glasses</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="earrings"
                    checked={config.earrings}
                    onChange={(e) => updateAvatarConfig('earrings', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="earrings">Earrings</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="expression" className="space-y-6 mt-4">
              <div>
                <Label className="block mb-2">Mood</Label>
                <RadioGroup 
                  value={config.mood} 
                  onValueChange={(value: any) => updateAvatarConfig('mood', value)}
                  className="flex flex-wrap gap-4"
                >
                  {moods.map((mood) => (
                    <div key={mood.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={mood.value} id={mood.value} />
                      <Label htmlFor={mood.value}>{mood.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

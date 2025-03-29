export type AvatarConfig = {
  gender: 'male' | 'female';
  hairColor: string;
  skinColor: string;
  earrings: boolean;
  glasses: boolean;
  mood: 'angry' | 'sad' | 'confused' | 'happy' | 'joy';
};

export const defaultConfig: AvatarConfig = {
  gender: 'male',
  hairColor: 'black',
  skinColor: 'light',
  earrings: false,
  glasses: false,
  mood: 'happy'
};

export const hairColors = [
  { value: 'black', label: 'Black', className: 'bg-gray-900' },
  { value: 'brown', label: 'Brown', className: 'bg-amber-900' },
  { value: 'blonde', label: 'Blonde', className: 'bg-yellow-400' },
  { value: 'red', label: 'Red', className: 'bg-red-600' },
  { value: 'gray', label: 'Gray', className: 'bg-gray-400' },
];

export const skinColors = [
  { value: 'light', label: 'Light', className: 'bg-orange-200' },
  { value: 'medium', label: 'Medium', className: 'bg-orange-300' },
  { value: 'dark', label: 'Dark', className: 'bg-amber-900' },
];

export const moods = [
  { value: 'joy', label: 'Joyful' },
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'angry', label: 'Angry' },
  { value: 'confused', label: 'Confused' },
];

export const generateAvatarUrl = (config: AvatarConfig): string => {
  try {
    const baseUrl = "https://api.dicebear.com/7.x/adventurer/svg";
    const queryParams = new URLSearchParams();

    // Set a stable seed based on the config
    const seed = `${config.gender}-${config.hairColor}-${config.skinColor}`;
    queryParams.set('seed', seed);
    
    // Set background color (transparent)
    queryParams.set('backgroundColor', 'transparent');
    
    // Set gender
    queryParams.set('gender', config.gender);
    
    // Set hair color
    const hairColorMap: Record<string, string> = {
      black: '000000',
      brown: '592f2a',
      blonde: 'ffcd94',
      red: 'a55728',
      gray: '808080'
    };
    queryParams.set('hairColor', hairColorMap[config.hairColor] || '000000');
    
    // Set skin color
    const skinColorMap: Record<string, string> = {
      light: 'ffdbac',
      medium: 'f1c27d',
      dark: '8d5524'
    };
    queryParams.set('skinColor', skinColorMap[config.skinColor] || 'ffdbac');
    
    // Set accessories
    queryParams.set('accessories', config.glasses ? '100' : '0');
    queryParams.set('accessoriesProbability', config.glasses ? '100' : '0');
    queryParams.set('accessoriesColor', '000000');
    
    // Set emotions/expressions
    const moodMap: Record<string, string> = {
      joy: 'smile',
      happy: 'smile',
      sad: 'sad',
      angry: 'angry',
      confused: 'concerned'
    };
    queryParams.set('mouth', moodMap[config.mood] || 'smile');
    
    // Build the final URL
    const url = `${baseUrl}?${queryParams.toString()}`;
    console.log('Generated avatar URL:', url);
    return url;
    
  } catch (error) {
    console.error('Error generating avatar URL:', error);
    return 'https://api.dicebear.com/7.x/adventurer/svg?seed=fallback';
  }
};

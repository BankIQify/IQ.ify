<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
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
<<<<<<< HEAD
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
=======
  // Create URL for DiceBear Avatars API explicitly
  // Using Micah style from DiceBear
  try {
    const baseUrl = "https://api.dicebear.com/6.x/micah/svg";
    const queryParams = new URLSearchParams();
    
    // Generate a predictable but unique seed to ensure consistency
    const seed = `seed-${config.gender}-${config.hairColor}-${config.skinColor}-${Date.now().toString(36)}`;
    queryParams.set('seed', seed);
    
    // Set common parameters
    queryParams.set('radius', '50');
    queryParams.set('size', '200');
    
    // Map our config values to DiceBear parameters
    if (config.gender === 'male' || config.gender === 'female') {
      queryParams.set('gender', config.gender);
    }
    
    // Set hair color if available
    if (config.hairColor) {
      queryParams.set('hair', config.hairColor);
    }
    
    // Set accessories
    queryParams.set('earrings', config.earrings ? 'true' : 'false');
    queryParams.set('glasses', config.glasses ? 'true' : 'false');
    
    // Set mood if available
    if (config.mood) {
      queryParams.set('mood', config.mood);
    }
    
    // Map skin colors to hex values for the baseColor parameter
    if (config.skinColor === 'light') {
      queryParams.set('baseColor', 'f8d5b8');
    } else if (config.skinColor === 'medium') {
      queryParams.set('baseColor', 'e3b085');
    } else {
      queryParams.set('baseColor', '8d5524');
    }
    
    // Build the full URL with the correct API endpoint
    const url = `${baseUrl}?${queryParams.toString()}`;
    console.log('Generated DiceBear URL:', url);
    
    return url;
  } catch (error) {
    console.error('Error generating avatar URL:', error);
    // Return a fallback URL if there's an error
    return 'https://api.dicebear.com/6.x/micah/svg?seed=fallback';
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  }
};

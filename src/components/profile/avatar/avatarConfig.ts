
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
  // Create URL for DiceBear Avatars API explicitly
  // Using Micah style from DiceBear
  const queryParams = new URLSearchParams();
  
  // Set all parameters with their correct values
  queryParams.set('seed', Math.random().toString(36).substring(7)); // Add random seed to prevent caching
  queryParams.set('radius', '50');
  queryParams.set('size', '150');
  
  // Map our config values to DiceBear parameters
  queryParams.set('gender', config.gender);
  queryParams.set('hair', config.hairColor);
  queryParams.set('earrings', config.earrings ? 'true' : 'false');
  queryParams.set('glasses', config.glasses ? 'true' : 'false');
  queryParams.set('mood', config.mood);
  
  // Map skin colors to hex values for the baseColor parameter
  if (config.skinColor === 'light') {
    queryParams.set('baseColor', 'f8d5b8');
  } else if (config.skinColor === 'medium') {
    queryParams.set('baseColor', 'e3b085');
  } else {
    queryParams.set('baseColor', '8d5524');
  }
  
  // Build the full URL with the correct API endpoint
  const url = `https://api.dicebear.com/6.x/micah/svg?${queryParams.toString()}`;
  console.log('Generated DiceBear URL:', url);
  
  return url;
};

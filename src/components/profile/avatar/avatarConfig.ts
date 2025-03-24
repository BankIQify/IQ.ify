
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
  
  return `https://api.dicebear.com/6.x/micah/svg?${queryParams.toString()}`;
};

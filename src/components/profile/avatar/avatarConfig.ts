
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
  // Create URL for DiceBear Micah avatar with explicit parameters
  const queryParams = new URLSearchParams();
  
  // Set all parameters explicitly with correct values
  queryParams.set('gender', config.gender);
  queryParams.set('hair', config.hairColor);
  queryParams.set('earrings', config.earrings ? 'true' : 'false');
  queryParams.set('glasses', config.glasses ? 'true' : 'false');
  queryParams.set('mood', config.mood);
  
  // Add skin color as baseColor parameter with hex values
  if (config.skinColor === 'light') {
    queryParams.set('baseColor', 'f8d5b8');
  } else if (config.skinColor === 'medium') {
    queryParams.set('baseColor', 'e3b085');
  } else {
    queryParams.set('baseColor', '8d5524');
  }
  
  // Log the generated URL to help with debugging
  const url = `https://api.dicebear.com/6.x/micah/svg?${queryParams.toString()}`;
  console.log('Generated avatar URL:', url);
  
  return url;
};

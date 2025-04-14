export interface ColorOption {
  value: string;
  label: string;
  className: string;
}

export const hairColors: ColorOption[] = [
  { value: 'Black', label: 'Black', className: 'bg-gray-900' },
  { value: 'Brown', label: 'Brown', className: 'bg-amber-900' },
  { value: 'BlondeGolden', label: 'Blonde', className: 'bg-yellow-400' },
  { value: 'Auburn', label: 'Auburn', className: 'bg-red-700' },
  { value: 'Red', label: 'Red', className: 'bg-red-600' },
  { value: 'Platinum', label: 'Platinum', className: 'bg-gray-300' },
];

export const skinColors: ColorOption[] = [
  { value: 'Light', label: 'Light', className: 'bg-orange-200' },
  { value: 'Pale', label: 'Pale', className: 'bg-orange-100' },
  { value: 'Tanned', label: 'Tanned', className: 'bg-orange-300' },
  { value: 'Yellow', label: 'Yellow', className: 'bg-yellow-300' },
  { value: 'Brown', label: 'Brown', className: 'bg-amber-700' },
  { value: 'DarkBrown', label: 'Dark Brown', className: 'bg-amber-900' },
  { value: 'Black', label: 'Black', className: 'bg-gray-900' },
];

export interface AvatarConfig {
  gender: 'male' | 'female';
  topType: string;
  accessoriesType: string;
  hatColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
}

export type AvatarOptionKey = keyof AvatarConfig;

export interface AvatarOptionValues {
  gender: readonly ['male', 'female'];
  topType: readonly string[];
  accessoriesType: readonly string[];
  hatColor: readonly string[];
  facialHairType: readonly string[];
  facialHairColor: readonly string[];
  clotheType: readonly string[];
  clotheColor: readonly string[];
  eyeType: readonly string[];
  eyebrowType: readonly string[];
  mouthType: readonly string[];
  skinColor: readonly string[];
}

export const avatarOptions: AvatarOptionValues = {
  gender: ['male', 'female'] as const,
  topType: [
    'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1',
    'WinterHat2', 'WinterHat3', 'WinterHat4', 'LongHairBigHair',
    'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy',
    'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand',
    'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace',
    'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand',
    'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle',
    'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat',
    'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides',
    'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
  ] as const,
  accessoriesType: [
    'Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'
  ] as const,
  hatColor: [
    'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather',
    'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink',
    'Red', 'White'
  ] as const,
  facialHairType: [
    'Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'
  ] as const,
  facialHairColor: [
    'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark',
    'Platinum', 'Red'
  ] as const,
  clotheType: [
    'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt',
    'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck',
    'ShirtVNeck'
  ] as const,
  clotheColor: [
    'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather',
    'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow',
    'Pink', 'Red', 'White'
  ] as const,
  eyeType: [
    'Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts',
    'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'
  ] as const,
  eyebrowType: [
    'Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural',
    'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned',
    'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'
  ] as const,
  mouthType: [
    'Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad',
    'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'
  ] as const,
  skinColor: [
    'Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'
  ] as const
} as const;

export const defaultConfig: AvatarConfig = {
  gender: 'male',
  topType: 'ShortHairShortWaved',
  accessoriesType: 'Blank',
  hatColor: 'Black',
  facialHairType: 'Blank',
  facialHairColor: 'Black',
  clotheType: 'BlazerShirt',
  clotheColor: 'Black',
  eyeType: 'Default',
  eyebrowType: 'Default',
  mouthType: 'Default',
  skinColor: 'Light'
};

export function generateAvatarUrl(config: Partial<AvatarConfig> = {}): string {
  const finalConfig = { ...defaultConfig, ...config };
  const baseUrl = 'https://avataaars.io/';
  const params = new URLSearchParams();

  // Add each config option to the URL parameters
  Object.entries(finalConfig).forEach(([key, value]) => {
    params.append(key, value);
  });

  return `${baseUrl}?${params.toString()}`;
}

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "avataaars";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AvatarProps {
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
}

const initialAvatarProps: AvatarProps = {
  topType: "ShortHairShortCurly",
  accessoriesType: "Blank",
  hairColor: "BrownDark",
  facialHairType: "Blank",
  facialHairColor: "BrownDark",
  clotheType: "Hoodie",
  clotheColor: "Blue03",
  eyeType: "Default",
  eyebrowType: "Default",
  mouthType: "Default",
  skinColor: "Light"
};

const TOP_TYPES = [
  "NoHair", "ShortHairShortCurly", "ShortHairShortFlat", "ShortHairShortWaved",
  "ShortHairSides", "ShortHairTheCaesar", "ShortHairTheCaesarSidePart",
  "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly",
  "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro",
  "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides",
  "LongHairMiaWallace", "LongHairStraight", "LongHairStraight2",
  "LongHairStraightStrand"
];

const ACCESSORIES = [
  "Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses",
  "Wayfarers"
];

const HAIR_COLORS = [
  "Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink",
  "Platinum", "Red", "SilverGray"
];

const CLOTHES = [
  "BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie",
  "Overall", "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck"
];

const CLOTHE_COLORS = [
  "Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather",
  "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow",
  "Pink", "Red", "White"
];

const EYES = [
  "Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side",
  "Squint", "Surprised", "Wink", "WinkWacky"
];

const EYEBROWS = [
  "Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural",
  "RaisedExcited", "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural",
  "UnibrowNatural", "UpDown", "UpDownNatural"
];

const MOUTHS = [
  "Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen",
  "Serious", "Smile", "Tongue", "Twinkle", "Vomit"
];

const SKIN_COLORS = [
  "Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black"
];

const categories = [
  {
    id: "hair",
    label: "Hair Style",
    props: TOP_TYPES,
    currentIndex: 0
  },
  {
    id: "accessories",
    label: "Accessories",
    props: ACCESSORIES,
    currentIndex: 0
  },
  {
    id: "eyes",
    label: "Eyes",
    props: EYES,
    currentIndex: 0
  },
  {
    id: "eyebrows",
    label: "Eyebrows",
    props: EYEBROWS,
    currentIndex: 0
  },
  {
    id: "mouth",
    label: "Mouth",
    props: MOUTHS,
    currentIndex: 0
  },
  {
    id: "clothes",
    label: "Clothing",
    props: CLOTHES,
    currentIndex: 0
  },
  {
    id: "colors",
    label: "Colors",
    props: CLOTHE_COLORS,
    currentIndex: 0
  }
];

export const AvatarCustomizer = () => {
  const [avatarProps, setAvatarProps] = useState<AvatarProps>(initialAvatarProps);
  const [categoryIndices, setCategoryIndices] = useState<{ [key: string]: number }>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {})
  );

  const updateAvatarProp = (prop: keyof AvatarProps, value: string) => {
    setAvatarProps(prev => ({ ...prev, [prop]: value }));
  };

  const handleCategoryScroll = (categoryId: string, direction: 'left' | 'right') => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const currentIndex = categoryIndices[categoryId];
    const newIndex = direction === 'left' 
      ? (currentIndex - 1 + category.props.length) % category.props.length
      : (currentIndex + 1) % category.props.length;

    setCategoryIndices(prev => ({ ...prev, [categoryId]: newIndex }));
    updateAvatarProp(categoryId as keyof AvatarProps, category.props[newIndex]);
  };

  const handleOptionSelect = (categoryId: string, option: string) => {
    const propMap: { [key: string]: keyof AvatarProps } = {
      'hair': 'topType',
      'accessories': 'accessoriesType',
      'eyes': 'eyeType',
      'eyebrows': 'eyebrowType',
      'mouth': 'mouthType',
      'clothes': 'clotheType',
      'colors': 'clotheColor'
    };

    const propName = propMap[categoryId];
    if (propName) {
      setAvatarProps(prev => ({ ...prev, [propName]: option }));
    }
  };

  const randomizeAvatar = () => {
    setAvatarProps({
      topType: TOP_TYPES[Math.floor(Math.random() * TOP_TYPES.length)],
      accessoriesType: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)],
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      facialHairType: "Blank",
      facialHairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      clotheType: CLOTHES[Math.floor(Math.random() * CLOTHES.length)],
      clotheColor: CLOTHE_COLORS[Math.floor(Math.random() * CLOTHE_COLORS.length)],
      eyeType: EYES[Math.floor(Math.random() * EYES.length)],
      eyebrowType: EYEBROWS[Math.floor(Math.random() * EYEBROWS.length)],
      mouthType: MOUTHS[Math.floor(Math.random() * MOUTHS.length)],
      skinColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)]
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Avatar Preview */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-72 h-72 rounded-full bg-white/10 p-4 shadow-lg">
          <Avatar
            style={{ width: '100%', height: '100%' }}
            avatarStyle="Circle"
            {...avatarProps}
          />
        </div>
        <Button
          onClick={randomizeAvatar}
          className="mt-6 bg-bright-pink hover:bg-bright-pink/90 text-white text-lg px-6 py-2"
        >
          Randomize
        </Button>
      </div>

      {/* Customizer */}
      <div className="flex-1 min-w-[400px]">
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category.id} className="space-y-3">
              <Label className="text-[#1EAEDB] font-display text-lg">{category.label}</Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCategoryScroll(category.id, 'left')}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div 
                  className="flex-1 flex justify-center cursor-pointer"
                  onClick={() => handleOptionSelect(category.id, category.props[categoryIndices[category.id]])}
                >
                  <motion.div
                    key={categoryIndices[category.id]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      backgroundColor: avatarProps[category.id as keyof AvatarProps] === category.props[categoryIndices[category.id]]
                        ? 'rgba(72, 187, 120, 0.2)'
                        : 'rgba(255, 255, 255, 0.2)'
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`px-4 py-2 rounded-lg text-center min-w-[200px] ${
                      avatarProps[category.id as keyof AvatarProps] === category.props[categoryIndices[category.id]]
                        ? 'text-black shadow-lg shadow-neon-green/30'
                        : 'text-white'
                    }`}
                  >
                    {category.props[categoryIndices[category.id]]}
                  </motion.div>
                </div>

                <button
                  onClick={() => handleCategoryScroll(category.id, 'right')}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
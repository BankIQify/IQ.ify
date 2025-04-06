import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { avatarOptions, type AvatarConfig, defaultConfig } from './avatarConfig';
import { CustomAvatar } from './CustomAvatar';

interface AvatarCreatorProps {
  className?: string;
}

const formatOptionName = (name: string): string => {
  const formatted = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();

  // Custom replacements for better British English
  return formatted
    .replace('Color', 'Colour')
    .replace('Type', '')
    .replace('Clothe', 'Clothing');
};

const CarouselButton = ({ direction, onClick, disabled }: { direction: 'up' | 'down'; onClick: () => void; disabled: boolean }) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "absolute left-1/2 -translate-x-1/2 z-10",
      "w-8 h-8 flex items-center justify-center",
      "bg-white/10 hover:bg-white/20 rounded-full",
      "text-white transition-all",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer shadow-lg",
      direction === 'up' ? "-top-4" : "-bottom-4"
    )}
    whileHover={disabled ? {} : { scale: 1.1 }}
    whileTap={disabled ? {} : { scale: 0.95 }}
    initial={false}
  >
    {direction === 'up' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </motion.button>
);

export const AvatarCreator = ({ className }: AvatarCreatorProps) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basics');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultConfig);
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScroll = useCallback((optionKey: string, direction: 'up' | 'down') => {
    const container = scrollContainerRefs.current[optionKey];
    if (!container) return;

    const scrollAmount = direction === 'up' ? -100 : 100;
    const currentScroll = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;

    // Prevent scrolling beyond boundaries
    if (direction === 'up' && currentScroll <= 0) return;
    if (direction === 'down' && currentScroll >= maxScroll) return;

    container.scrollTo({
      top: Math.max(0, Math.min(currentScroll + scrollAmount, maxScroll)),
      behavior: 'smooth'
    });
  }, []);

  // Add scroll event listeners to handle scroll buttons visibility
  useEffect(() => {
    const containers = Object.values(scrollContainerRefs.current).filter(Boolean);
    
    const handleScrollEvent = (e: Event) => {
      const container = e.target as HTMLDivElement;
      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      // Update scroll button states if needed
      const upButton = container.previousElementSibling as HTMLButtonElement;
      const downButton = container.nextElementSibling as HTMLButtonElement;
      
      if (upButton) {
        upButton.style.opacity = scrollTop <= 0 ? '0.5' : '1';
      }
      if (downButton) {
        downButton.style.opacity = scrollTop >= maxScroll ? '0.5' : '1';
      }
    };

    containers.forEach(container => {
      container?.addEventListener('scroll', handleScrollEvent);
    });

    return () => {
      containers.forEach(container => {
        container?.removeEventListener('scroll', handleScrollEvent);
      });
    };
  }, [activeTab]);

  const tabs = [
    {
      id: 'basics',
      label: 'Basic Features',
      options: ['gender', 'skinColor'],
      description: 'Set your basic appearance'
    },
    { 
      id: 'hair', 
      label: 'Hair', 
      options: ['topType', 'hairColor'],
      description: 'Style your hair',
      filter: (value: string) => 
        !value.includes('Hat') && 
        !value.includes('Hijab') && 
        !value.includes('Turban') && 
        !value.includes('Eyepatch') &&
        (value.includes('Hair') || value === 'NoHair')
    },
    { 
      id: 'facial-features', 
      label: 'Facial Features', 
      options: ['facialHairType', 'facialHairColor', 'eyeType', 'eyebrowType', 'mouthType'],
      description: 'Customise your facial features'
    },
    { 
      id: 'accessories', 
      label: 'Accessories', 
      options: ['accessoriesType'],
      description: 'Add glasses and other accessories'
    },
    { 
      id: 'clothing', 
      label: 'Clothing', 
      options: ['clotheType', 'clotheColor'],
      description: 'Choose your outfit'
    },
    { 
      id: 'headwear', 
      label: 'Headwear', 
      options: ['topType', 'hatColor'],
      description: 'Add hats and other headwear',
      filter: (value: string) => 
        value.includes('Hat') || 
        value.includes('Hijab') || 
        value.includes('Turban')
    }
  ];

  const handleOptionChange = (category: keyof AvatarConfig, value: string) => {
    if (category === 'gender') {
      setAvatarConfig(prev => ({
        ...prev,
        gender: value as 'male' | 'female'
      }));
      return;
    }
    setAvatarConfig(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const randomizeAvatar = () => {
    const newConfig = { ...avatarConfig };
    (Object.keys(avatarOptions) as Array<keyof typeof avatarOptions>).forEach(key => {
      const options = avatarOptions[key];
      if (key === 'gender') {
        const randomGender = options[Math.floor(Math.random() * options.length)];
        newConfig.gender = randomGender as 'male' | 'female';
      } else {
        (newConfig as any)[key] = options[Math.floor(Math.random() * options.length)];
      }
    });
    setAvatarConfig(newConfig);
  };

  const resetAvatar = () => {
    setAvatarConfig(defaultConfig);
  };

  const saveAvatar = async () => {
    try {
      await updateProfile({
        avatar_config: avatarConfig,
      });
      toast({
        title: "Success",
        description: "Your avatar has been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your avatar. Please try again.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-8 p-6 bg-royal-blue rounded-xl max-w-6xl mx-auto", className)}>
      {/* Avatar Preview */}
      <div className="lg:sticky lg:top-24 lg:h-fit lg:w-80">
        <motion.div 
          className="flex-shrink-0 w-64 h-64 mx-auto bg-white rounded-full shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CustomAvatar config={avatarConfig} username={profile?.username || 'U'} />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <motion.button
            onClick={randomizeAvatar}
            className="flex-1 py-2 px-4 bg-bright-blue text-white rounded-lg font-semibold font-inter hover:bg-bright-blue/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Randomise
          </motion.button>
          <motion.button
            onClick={resetAvatar}
            className="flex-1 py-2 px-4 bg-yellow text-royal-blue rounded-lg font-semibold font-inter hover:bg-yellow/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={saveAvatar}
          className="w-full py-3 px-4 bg-neon-green text-royal-blue rounded-lg font-semibold font-inter mt-4 hover:bg-neon-green/90"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Avatar
        </motion.button>
      </div>

      {/* Customisation Interface */}
      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Customise Your Avatar</h2>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-bright-pink text-white shadow-[0_0_15px_rgba(255,20,147,0.5)]"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Active Tab Description */}
        <p className="text-white/80 mb-6">
          {tabs.find(t => t.id === activeTab)?.description}
        </p>

        {/* Options */}
        <div className="space-y-6">
          {tabs.find(t => t.id === activeTab)?.options.map(option => {
            const currentTab = tabs.find(t => t.id === activeTab);
            const values = avatarOptions[option as keyof typeof avatarOptions] || [];
            const filteredValues = currentTab?.filter && Array.isArray(values)
              ? values.filter(value => currentTab.filter?.(value))
              : values;

            if (!Array.isArray(filteredValues) || filteredValues.length === 0) {
              return null;
            }

            return (
              <div key={option} className="space-y-2">
                <h3 className="text-white font-semibold capitalize">
                  {formatOptionName(option)}
                </h3>
                <div className="relative">
                  {/* Scroll Buttons */}
                  <button
                    onClick={() => handleScroll(option, 'up')}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white"
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleScroll(option, 'down')}
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>

                  {/* Options Grid */}
                  <div
                    ref={el => scrollContainerRefs.current[option] = el}
                    className="max-h-[240px] overflow-y-auto scrollbar-hide grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 scroll-smooth"
                  >
                    {filteredValues.map(value => (
                      <motion.button
                        key={value}
                        onClick={() => handleOptionChange(option as keyof AvatarConfig, value)}
                        className={cn(
                          "p-3 rounded-lg text-xs font-medium whitespace-nowrap",
                          "transition-all duration-300 ease-out",
                          avatarConfig[option as keyof typeof avatarConfig] === value
                            ? "bg-bright-pink text-white shadow-[0_0_15px_rgba(255,20,147,0.5)]"
                            : "bg-white/10 text-white hover:bg-white/20"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {formatOptionName(value)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 
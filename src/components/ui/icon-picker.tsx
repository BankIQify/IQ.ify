import * as React from "react";
import {
  Lightbulb,
  Star,
  Trophy,
  LineChart,
  Rocket,
  Shield,
  Puzzle,
  Brain,
  Medal,
  Target,
  Sparkles,
  Award,
  GraduationCap,
  BookOpen,
  BookMarked,
  Book,
  School,
  University,
  Library,
  PenTool,
  Pencil,
  Highlighter,
  Notebook,
  NotebookPen,
  ClipboardList,
  ClipboardCheck,
  CheckCircle,
  CheckSquare,
  ThumbsUp,
  Heart,
  Smile,
  Crown,
  Gem,
  Diamond,
  Coins,
  Globe,
  Map,
  Compass,
  Flag,
  Anchor,
  Plane,
  Car,
  Train,
  Bus,
  Satellite,
  Telescope,
  Microscope,
  Beaker,
  TestTube,
  Atom,
  Dna,
  HeartPulse,
  Eye,
  Hand,
  Skull,
  Ghost,
  Cat,
  Dog,
  Fish,
  Bird,
  House,
  Rainbow,
  type LucideIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const iconMap = {
  Lightbulb,
  Star,
  Trophy,
  LineChart,
  Rocket,
  Shield,
  Puzzle,
  Brain,
  Medal,
  Target,
  Sparkles,
  Award,
  GraduationCap,
  BookOpen,
  BookMarked,
  Book,
  School,
  University,
  Library,
  PenTool,
  Pencil,
  Highlighter,
  Notebook,
  NotebookPen,
  ClipboardList,
  ClipboardCheck,
  CheckCircle,
  CheckSquare,
  ThumbsUp,
  Heart,
  Smile,
  Crown,
  Gem,
  Diamond,
  Coins,
  Globe,
  Map,
  Compass,
  Flag,
  Anchor,
  Plane,
  Car,
  Train,
  Bus,
  Satellite,
  Telescope,
  Microscope,
  Beaker,
  TestTube,
  Atom,
  Dna,
  HeartPulse,
  Eye,
  Hand,
  Skull,
  Ghost,
  Cat,
  Dog,
  Fish,
  Bird,
  House,
  Rainbow,
} as const;

type IconName = keyof typeof iconMap;

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  availableIcons?: string[];
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, availableIcons }) => {
  const iconNames = (availableIcons || Object.keys(iconMap)) as IconName[];

  const SelectedIcon = iconMap[value as IconName];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2">
            {SelectedIcon && <SelectedIcon className="w-4 h-4" />}
            <span>{value}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {iconNames.map((iconName) => {
          const Icon = iconMap[iconName];
          return (
            <SelectItem key={iconName} value={iconName}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{iconName}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}; 
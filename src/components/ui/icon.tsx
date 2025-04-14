import * as icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className = "" }: IconProps) => {
  // Convert the name to PascalCase to match Lucide's naming convention
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = icons[pascalName as keyof typeof icons] as LucideIcon;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  return <IconComponent className={className} />;
}; 
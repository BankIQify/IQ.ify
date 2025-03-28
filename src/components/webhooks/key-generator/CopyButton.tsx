
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CopyButtonProps {
  text: string;
  description: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const CopyButton = ({ 
  text, 
  description, 
  className, 
  variant = "outline", 
  size = "sm" 
}: CopyButtonProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description,
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Button 
      size={size} 
      variant={variant} 
      className={className}
      onClick={copyToClipboard}
    >
      <Clipboard className={size === "sm" ? "h-3.5 w-3.5 mr-1" : "h-4 w-4 mr-2"} />
      {size !== "icon" && "Copy"}
    </Button>
  );
};

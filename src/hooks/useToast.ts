import { useToast as useShadcnToast } from "@/components/ui/use-toast";

export const useToast = () => {
  const { toast } = useShadcnToast();

  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      toast({
        ...props,
        duration: 5000,
      });
    },
  };
}; 
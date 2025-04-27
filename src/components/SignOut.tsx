import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSignOut = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Navigate to auth page
      navigate('/auth', { replace: true });
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { signOut };
};

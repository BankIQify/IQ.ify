
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // Only check for admin role - no longer treat data_input as admin equivalent
      const { data: adminRoleCheck, error: adminCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        return;
      }

      // Set isAdmin based only on admin role
      setIsAdmin(!!adminRoleCheck);
      console.log('Setting isAdmin to:', !!adminRoleCheck);

    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    }
  };

  return { isAdmin, checkAdminStatus };
};

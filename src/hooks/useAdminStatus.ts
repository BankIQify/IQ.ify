import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // Check for admin role first
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

      // If user already has admin role, set isAdmin to true
      if (adminRoleCheck) {
        console.log('User has admin role');
        setIsAdmin(true);
        return;
      }

      // Otherwise check if user has data_input role (which may have some admin privileges)
      const { data: dataInputRoleCheck, error: dataInputCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'data_input')
        .maybeSingle();

      if (dataInputCheckError) {
        console.error('Error checking data_input role status:', dataInputCheckError);
        return;
      }

      console.log('Admin check result:', adminRoleCheck);
      console.log('Data input role check result:', dataInputRoleCheck);
      
      // Set isAdmin based on having either role
      setIsAdmin(!!(adminRoleCheck || dataInputRoleCheck));
      console.log('Setting isAdmin to:', !!(adminRoleCheck || dataInputRoleCheck));

    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    }
  };

  return { isAdmin, checkAdminStatus };
};

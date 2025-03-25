
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useManageQuestions = () => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("bank");
  const [hasDataInputRole, setHasDataInputRole] = useState(false);

  // Extract the tab from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["bank", "manual", "categories", "puzzles", "homepage", "webhooks"].includes(tab)) {
      setActiveTab(tab);
      console.log("Setting active tab from URL:", tab);
    }
  }, [location]);

  // Check for data_input role specifically
  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) {
        setHasDataInputRole(false);
        return;
      }
      
      try {
        console.log("Checking data_input role for user:", user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        if (error) {
          console.error('Error checking data_input role:', error);
          return;
        }

        console.log("Data input role check result:", data);
        setHasDataInputRole(!!data);
      } catch (error) {
        console.error('Error in checkDataInputRole:', error);
      }
    };

    checkDataInputRole();
  }, [user]);

  // Fetch sections for the CategoriesTable
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data: sectionsData, error } = await supabase
          .from("question_sections")
          .select(`
            id,
            name,
            category,
            sub_topics (
              id,
              name
            )
          `);

        if (error) throw error;
        if (sectionsData) {
          setSections(sectionsData);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast({
          title: "Error",
          description: "Failed to fetch sections data.",
          variant: "destructive",
        });
      }
    };

    if (user && (isAdmin || hasDataInputRole)) {
      fetchSections();
    }
  }, [toast, user, isAdmin, hasDataInputRole]);

  // Fetch pending webhook events count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from("webhook_events")
          .select("*", { count: "exact" })
          .eq("processed", false);
          
        if (error) throw error;
        setPendingCount(count || 0);
      } catch (error) {
        console.error("Error fetching pending webhook count:", error);
      }
    };
    
    if (user && (isAdmin || hasDataInputRole)) {
      fetchPendingCount();
      
      // Set up a polling interval to refresh the count
      const interval = setInterval(fetchPendingCount, 30000); // every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, isAdmin, hasDataInputRole]);

  const handleTabChange = (value: string) => {
    console.log("Tab change requested to:", value);
    setActiveTab(value);
    // Update URL with current tab
    const params = new URLSearchParams(location.search);
    params.set("tab", value);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };

  return {
    user,
    isAdmin,
    hasDataInputRole,
    sections,
    pendingCount,
    activeTab,
    handleTabChange,
    showHomepageTab: isAdmin,
    showWebhooksTab: isAdmin
  };
};

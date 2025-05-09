
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useWebhookKeyGeneration = () => {
  const [keyName, setKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [webhookKey, setWebhookKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Set the webhook URL based on the current environment
  useEffect(() => {
    // Get the Supabase URL from environment or fall back to a default
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dqaihawavxlacegykwqu.supabase.co";
    
    // Ensure the URL has proper format
    let formattedUrl = supabaseUrl;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    const webhookEndpoint = `${formattedUrl}/functions/v1/process-ai-webhook`;
    console.log('Setting up webhook URL in useWebhookKeyGeneration:', webhookEndpoint);
    setWebhookUrl(webhookEndpoint);
  }, []);

  const generateKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your webhook key",
        variant: "destructive",
      });
      return;
    }

    setGeneratingKey(true);
    setError(null);
    
    try {
      console.log('Generating webhook key with name:', keyName);
      
      // Call the function with the correct parameter name
      const { data, error } = await supabase.functions.invoke("generate-webhook-key", {
        body: { keyName: keyName.trim() }
      });
      
      console.log('Response from generate-webhook-key:', { data, error });
      
      if (error) {
        console.error("Supabase functions error:", error);
        throw new Error(error.message || "Failed to connect to the server");
      }
      
      if (!data) {
        throw new Error('No data returned from the server');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.key && !data.success) {
        throw new Error('Server returned an invalid response');
      }
      
      setWebhookKey(data.key);
      toast({
        title: "Success",
        description: "Webhook key generated successfully",
      });
    } catch (error) {
      console.error("Error generating webhook key:", error);
      setError(error.message || "Failed to generate webhook key. Please try again.");
      toast({
        title: "Error",
        description: error.message || "Failed to generate webhook key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  return {
    keyName,
    setKeyName,
    generatingKey,
    webhookKey,
    webhookUrl,
    error,
    generateKey
  };
};

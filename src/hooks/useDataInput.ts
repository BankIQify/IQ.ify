import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Question {
  id: string;
  content: {
    title: string;
    description?: string;
    category: string;
    difficulty: string;
    options?: string[];
    correct_answer: string;
    explanation?: string;
  };
  question_type: string;
  created_at: string;
}

export interface WebhookData {
  id: string;
  event_type: string;
  payload: any;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  created_at: string;
  updated_at: string;
}

export const useDataInput = () => {
  const { user, isDataInput, authInitialized } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [webhookData, setWebhookData] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data) {
        setError("No questions found in the database");
        throw new Error("No data returned");
      }

      const transformedQuestions = data.map((q: any) => ({
        id: q.id,
        content: q.content,
        question_type: q.question_type,
        created_at: q.created_at
      }));

      setQuestions(transformedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhookData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('webhook_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data) {
        setError("No webhook data found");
        throw new Error("No data returned");
      }

      setWebhookData(data);
    } catch (err) {
      console.error('Error fetching webhook data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authInitialized && user && isDataInput) {
      fetchQuestions();
      fetchWebhookData();
    }
  }, [authInitialized, user, isDataInput]);

  return {
    questions,
    webhookData,
    loading,
    error,
    fetchQuestions,
    fetchWebhookData
  };
};

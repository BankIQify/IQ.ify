
import { supabase } from "@/integrations/supabase/client";

export const uploadQuestionImage = async (
  imageFile: File, 
  prefix: 'question' | 'answer'
): Promise<string | null> => {
  const fileExt = imageFile.name.split('.').pop();
  const filePath = `${prefix}_${crypto.randomUUID()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('question-images')
    .upload(filePath, imageFile);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('question-images')
    .getPublicUrl(filePath);
    
  return publicUrl;
};

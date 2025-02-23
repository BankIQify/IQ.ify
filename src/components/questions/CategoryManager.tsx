
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionForm } from "./sections/SectionForm";
import { SubTopicForm } from "./sections/SubTopicForm";
import { CategoriesTable } from "./sections/CategoriesTable";

export const CategoryManager = () => {
  // Fetch all sections and their sub-topics
  const { data: sections, refetch: refetchSections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_sections')
        .select(`
          *,
          sub_topics (
            id,
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <SectionForm onSectionAdded={refetchSections} />
      <SubTopicForm sections={sections} onSubTopicAdded={refetchSections} />
      <CategoriesTable sections={sections} />
    </div>
  );
};


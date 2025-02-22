
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

export function StandardExamForm() {
  const { toast } = useToast();
  const [standardCategory, setStandardCategory] = useState<QuestionCategory | ''>('');

  const handleCreateStandardExam = async () => {
    if (!standardCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('exams')
        .insert({
          name: `Standard ${standardCategory.replace('_', ' ')} Test`,
          category: standardCategory,
          question_count: 20,
          is_standard: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Standard exam created successfully"
      });

      setStandardCategory('');
    } catch (error) {
      console.error('Error creating standard exam:', error);
      toast({
        title: "Error",
        description: "Failed to create standard exam",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="standardCategory">Category</Label>
        <Select 
          value={standardCategory} 
          onValueChange={(value: QuestionCategory) => setStandardCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verbal">Verbal Reasoning</SelectItem>
            <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
            <SelectItem value="brain_training">Brain Training</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleCreateStandardExam} className="w-full">
        Create Standard Exam
      </Button>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

export function StandardExamForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [standardCategory, setStandardCategory] = useState<QuestionCategory | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateStandardExam = async () => {
    if (!standardCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const examName = `Standard ${standardCategory.replace('_', ' ')} Test`;
      
      const { data, error } = await supabase
        .from('exams')
        .insert({
          name: examName,
          category: standardCategory,
          question_count: 20,
          is_standard: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Standard exam created successfully"
      });

      // Navigate to the practice page for this exam
      if (data) {
        // For now, just navigate to the Practice page
        // In a future enhancement, this could go directly to the exam
        navigate(`/practice/${standardCategory}`);
      }

      setStandardCategory('');
    } catch (error) {
      console.error('Error creating standard exam:', error);
      toast({
        title: "Error",
        description: "Failed to create standard exam",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

      <Button 
        onClick={handleCreateStandardExam} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Standard Exam"}
      </Button>
    </div>
  );
}

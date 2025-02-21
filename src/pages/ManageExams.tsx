
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

const ManageExams = () => {
  const { toast } = useToast();
  const [standardCategory, setStandardCategory] = useState<QuestionCategory | ''>('');
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState<QuestionCategory[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [timeLimit, setTimeLimit] = useState<number | undefined>();

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_sections')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

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

  const handleCreateCustomExam = async () => {
    if (!customName || customCategory.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (questionCount < 10 || questionCount > 40) {
      toast({
        title: "Error",
        description: "Question count must be between 10 and 40",
        variant: "destructive"
      });
      return;
    }

    if (timeLimit && (timeLimit < 1 || timeLimit > 120)) {
      toast({
        title: "Error",
        description: "Time limit must be between 1 and 120 minutes",
        variant: "destructive"
      });
      return;
    }

    // Validate that Brain Training is not combined with VR or NVR
    const hasBrainTraining = customCategory.includes('brain_training');
    const hasOthers = customCategory.includes('verbal') || customCategory.includes('non_verbal');
    if (hasBrainTraining && hasOthers) {
      toast({
        title: "Error",
        description: "Brain Training cannot be combined with Verbal or Non-Verbal Reasoning",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('exams')
        .insert({
          name: customName,
          category: customCategory[0], // Using first category as primary
          question_count: questionCount,
          time_limit_minutes: timeLimit,
          is_standard: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom exam created successfully"
      });

      // Reset form
      setCustomName("");
      setCustomCategory([]);
      setQuestionCount(20);
      setTimeLimit(undefined);
    } catch (error) {
      console.error('Error creating custom exam:', error);
      toast({
        title: "Error",
        description: "Failed to create custom exam",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Exams</h1>
      
      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard">Standard Exams</TabsTrigger>
          <TabsTrigger value="custom">Custom Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card>
            <CardContent className="space-y-4 pt-6">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="customName">Exam Name</Label>
                <Input
                  id="customName"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter exam name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories">Categories</Label>
                <Select
                  value={customCategory[0]}
                  onValueChange={(value: QuestionCategory) => setCustomCategory([value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                    <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
                    <SelectItem value="brain_training">Brain Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionCount">Number of Questions (10-40)</Label>
                <Input
                  id="questionCount"
                  type="number"
                  min="10"
                  max="40"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  max="120"
                  value={timeLimit || ""}
                  onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Enter time limit (1-120 minutes)"
                />
              </div>

              <Button onClick={handleCreateCustomExam} className="w-full">
                Create Custom Exam
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageExams;


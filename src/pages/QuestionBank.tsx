import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Question {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  options: string[];
}

export default function QuestionBank() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    answer: "",
    category: "",
    difficulty: "medium",
    options: []
  });

  const handleAddQuestion = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('questions')
        .insert([newQuestion]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Question added successfully",
      });
      
      // Reset form
      setNewQuestion({
        question: "",
        answer: "",
        category: "",
        difficulty: "medium",
        options: []
      });
      
      // Refresh questions
      await fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setQuestions(data as Question[]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Question Bank</h1>
      
      <Tabs defaultValue="add" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add">Add Question</TabsTrigger>
          <TabsTrigger value="view">View Questions</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label>Question</label>
                <Textarea 
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  placeholder="Enter the question"
                />
              </div>
              
              <div className="space-y-2">
                <label>Answer</label>
                <Input 
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                  placeholder="Enter the answer"
                />
              </div>
              
              <div className="space-y-2">
                <label>Category</label>
                <Input 
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                  placeholder="Enter the category"
                />
              </div>
              
              <div className="space-y-2">
                <label>Difficulty</label>
                <Select
                  value={newQuestion.difficulty}
                  onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddQuestion}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Adding..." : "Add Question"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>All Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <p className="font-semibold">{question.question}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Category: {question.category} | Difficulty: {question.difficulty}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bulk import functionality coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
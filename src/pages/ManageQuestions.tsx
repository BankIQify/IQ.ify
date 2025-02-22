import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionContent = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl?: string; // Added imageUrl as optional property
};

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

const ManageQuestions = () => {
  const [category, setCategory] = useState<QuestionCategory>('verbal');
  const [subTopicId, setSubTopicId] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Manual upload states
  const [manualQuestion, setManualQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [isProcessingManual, setIsProcessingManual] = useState(false);

  // Fetch sub-topics based on selected category
  const { data: subTopics } = useQuery({
    queryKey: ['subTopics', category],
    queryFn: async () => {
      const { data: sections } = await supabase
        .from('question_sections')
        .select('id')
        .eq('category', category)
        .single();

      if (!sections?.id) return [];

      const { data, error } = await supabase
        .from('sub_topics')
        .select('*')
        .eq('section_id', sections.id);

      if (error) throw error;
      return data;
    }
  });

  const generateQuestion = async () => {
    if (!subTopicId) {
      toast({
        title: "Error",
        description: "Please select a sub-topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: { category, prompt: customPrompt || undefined }
      });

      if (error) throw error;

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: data,
          sub_topic_id: subTopicId,
          generation_prompt: customPrompt || null,
          ai_generated: true,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "New question generated and saved.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuestionImage(e.target.files[0]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleManualUpload = async () => {
    if (!subTopicId) {
      toast({
        title: "Error",
        description: "Please select a sub-topic",
        variant: "destructive"
      });
      return;
    }

    if (!manualQuestion || options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingManual(true);

    try {
      let imageUrl = null;
      if (questionImage) {
        const fileExt = questionImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, questionImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('question-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // Generate AI explanation for the manual question
      const { data: explanationData, error: explanationError } = await supabase.functions.invoke('generate-explanation', {
        body: {
          question: manualQuestion,
          options: options,
          correctAnswer: options[correctAnswerIndex],
          imageUrl: imageUrl
        }
      });

      if (explanationError) throw explanationError;

      const questionContent: QuestionContent = {
        question: manualQuestion,
        options: options,
        correctAnswer: options[correctAnswerIndex],
        explanation: explanationData.explanation,
        imageUrl: imageUrl
      };

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: questionContent,
          sub_topic_id: subTopicId,
          ai_generated: false,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Question uploaded successfully with AI-generated explanation.",
      });

      // Reset form
      setManualQuestion("");
      setQuestionImage(null);
      setOptions(["", "", "", ""]);
      setCorrectAnswerIndex(0);
    } catch (error) {
      console.error('Error uploading question:', error);
      toast({
        title: "Error",
        description: "Failed to upload question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingManual(false);
    }
  };

  // Fetch existing questions
  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', subTopicId],
    queryFn: async () => {
      if (!subTopicId) return [];

      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          sub_topics (
            name
          )
        `)
        .eq('sub_topic_id', subTopicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!subTopicId,
  });

  return (
    <div className="page-container">
      <h1 className="section-title">Question Management</h1>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value: QuestionCategory) => {
                setCategory(value);
                setSubTopicId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
                <SelectItem value="brain_training">Brain Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subTopic">Sub-topic</Label>
            <Select
              value={subTopicId}
              onValueChange={setSubTopicId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-topic" />
              </SelectTrigger>
              <SelectContent>
                {subTopics?.map((subTopic) => (
                  <SelectItem key={subTopic.id} value={subTopic.id}>
                    {subTopic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Questions</TabsTrigger>
              <TabsTrigger value="manual">Manual Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div>
                <Label htmlFor="prompt">Custom Generation Prompt (Optional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter a custom prompt for question generation..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="h-24"
                />
              </div>

              <Button 
                onClick={generateQuestion} 
                disabled={isGenerating || !subTopicId}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate New Question"}
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div>
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  placeholder="Enter your question..."
                  value={manualQuestion}
                  onChange={(e) => setManualQuestion(e.target.value)}
                  className="h-24"
                />
              </div>

              <div>
                <Label htmlFor="questionImage">Question Image (Optional)</Label>
                <Input
                  id="questionImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1"
                />
              </div>

              <div className="space-y-4">
                <Label>Answer Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswerIndex === index}
                      onChange={() => setCorrectAnswerIndex(index)}
                      className="mt-3"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handleManualUpload}
                disabled={isProcessingManual || !subTopicId}
                className="w-full"
              >
                {isProcessingManual ? "Processing..." : "Upload Question"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Generated Questions</h2>
        {!subTopicId ? (
          <p className="text-gray-600">Select a sub-topic to view questions</p>
        ) : isLoading ? (
          <p>Loading questions...</p>
        ) : questions && questions.length > 0 ? (
          questions.map((question, index) => {
            const content = question.content as QuestionContent;
            return (
              <Card key={question.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <span className="text-sm text-gray-500">
                      {question.sub_topics?.name}
                    </span>
                  </div>
                  <p>{content.question}</p>
                  {content.imageUrl && (
                    <img 
                      src={content.imageUrl} 
                      alt="Question" 
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.options.map((option: string, i: number) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          option === content.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Explanation:</p>
                    <p>{content.explanation}</p>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-600">No questions generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;

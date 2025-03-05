import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuestionsList } from "@/components/questions/QuestionsList";
import type { QuestionContent } from "@/types/questions";

export const WebhookQuestionReview = () => {
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editedQuestions, setEditedQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWebhookEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("webhook_events")
          .select("*")
          .eq("event_type", "question_generated")
          .eq("processed", false)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWebhookEvents(data || []);
      } catch (error) {
        console.error("Error fetching webhook events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch webhook events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebhookEvents();
    
    const interval = setInterval(fetchWebhookEvents, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    if (event.payload && event.payload.questions) {
      setEditedQuestions(event.payload.questions);
    }
  };

  const handleUpdateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleSaveQuestions = async () => {
    if (!selectedEvent || !editedQuestions.length) return;
    
    setIsLoading(true);
    try {
      const subTopicId = selectedEvent.payload.sub_topic_id;
      
      if (!subTopicId) {
        throw new Error("No sub-topic ID provided in webhook payload");
      }
      
      for (const question of editedQuestions) {
        const questionContent: QuestionContent = {
          question: question.question,
          explanation: question.explanation || "No explanation provided",
        };
        
        if (question.options && question.correctAnswer) {
          questionContent.options = question.options;
          questionContent.correctAnswer = question.correctAnswer;
        } else if (question.primaryOptions && question.secondaryOptions) {
          questionContent.primaryOptions = question.primaryOptions;
          questionContent.secondaryOptions = question.secondaryOptions;
          questionContent.correctPrimaryAnswer = question.correctPrimaryAnswer;
          questionContent.correctSecondaryAnswer = question.correctSecondaryAnswer;
        }
        
        const questionType = question.options ? "multiple_choice" : 
                            (question.imageUrl ? "image" : "text");
        
        const { error: insertError } = await supabase
          .from("questions")
          .insert({
            content: questionContent,
            sub_topic_id: subTopicId,
            ai_generated: true,
            question_type: questionType,
            generation_prompt: selectedEvent.payload.prompt || null,
          });
          
        if (insertError) throw insertError;
      }
      
      const { error: updateError } = await supabase
        .from("webhook_events")
        .update({ 
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq("id", selectedEvent.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: `${editedQuestions.length} questions saved successfully`,
      });
      
      setSelectedEvent(null);
      setEditedQuestions([]);
      
      const { data: updatedEvents, error } = await supabase
        .from("webhook_events")
        .select("*")
        .eq("event_type", "question_generated")
        .eq("processed", false)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setWebhookEvents(updatedEvents || []);
      
    } catch (error) {
      console.error("Error saving questions:", error);
      toast({
        title: "Error",
        description: "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardEvent = async () => {
    if (!selectedEvent) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("webhook_events")
        .update({ 
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq("id", selectedEvent.id);
        
      if (error) throw error;
      
      toast({
        title: "Event Discarded",
        description: "The webhook event has been marked as processed",
      });
      
      setSelectedEvent(null);
      setEditedQuestions([]);
      
      const { data: updatedEvents, error: fetchError } = await supabase
        .from("webhook_events")
        .select("*")
        .eq("event_type", "question_generated")
        .eq("processed", false)
        .order("created_at", { ascending: false });
        
      if (fetchError) throw fetchError;
      setWebhookEvents(updatedEvents || []);
      
    } catch (error) {
      console.error("Error discarding event:", error);
      toast({
        title: "Error",
        description: "Failed to discard event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPreviewQuestions = () => {
    if (!selectedEvent || !editedQuestions.length) return [];
    
    return editedQuestions.map((q: any, index: number) => ({
      id: `preview-${index}`,
      content: {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        primaryOptions: q.primaryOptions,
        secondaryOptions: q.secondaryOptions,
        correctPrimaryAnswer: q.correctPrimaryAnswer,
        correctSecondaryAnswer: q.correctSecondaryAnswer
      },
      sub_topics: {
        name: selectedEvent.payload.sub_topic_name || "Unknown"
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions to Review</CardTitle>
              <CardDescription>
                {isLoading 
                  ? "Loading..." 
                  : `${webhookEvents.length} sets of questions waiting for review`}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {webhookEvents.length === 0 && !isLoading ? (
                <div className="text-center py-6 text-muted-foreground">
                  No questions to review
                </div>
              ) : (
                <div className="space-y-2">
                  {webhookEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                        selectedEvent?.id === event.id ? 'border-primary bg-muted/50' : ''
                      }`}
                      onClick={() => handleSelectEvent(event)}
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{event.source}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.created_at)}
                        </span>
                      </div>
                      <div className="mt-2 font-medium">
                        {event.payload?.sub_topic_name || 'Unknown sub-topic'}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {event.payload?.questions?.length || 0} questions
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedEvent ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Edit Questions</CardTitle>
                    <CardDescription>
                      Review and edit questions before saving them to the database
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleDiscardEvent}
                      disabled={isLoading}
                    >
                      Discard
                    </Button>
                    <Button 
                      onClick={handleSaveQuestions}
                      disabled={isLoading || editedQuestions.length === 0}
                    >
                      Save All Questions
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Source</p>
                        <p className="text-sm">{selectedEvent.source}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Received</p>
                        <p className="text-sm">{formatDate(selectedEvent.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sub-topic</p>
                        <p className="text-sm">{selectedEvent.payload?.sub_topic_name || selectedEvent.payload?.sub_topic_id || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Questions</p>
                        <p className="text-sm">{editedQuestions.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {editedQuestions.map((question, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                            <Textarea
                              id={`question-${index}`}
                              value={question.question}
                              onChange={(e) => handleUpdateQuestion(index, 'question', e.target.value)}
                              className="mt-1"
                              rows={3}
                            />
                          </div>

                          {question.options && (
                            <div>
                              <Label>Options</Label>
                              <div className="space-y-2 mt-1">
                                {question.options.map((option: string, optionIndex: number) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[optionIndex] = e.target.value;
                                        
                                        let newCorrectAnswer = question.correctAnswer;
                                        if (question.correctAnswer === question.options[optionIndex]) {
                                          newCorrectAnswer = e.target.value;
                                        }
                                        
                                        const updatedQuestion = { 
                                          ...question, 
                                          options: newOptions,
                                          correctAnswer: newCorrectAnswer
                                        };
                                        
                                        const updatedQuestions = [...editedQuestions];
                                        updatedQuestions[index] = updatedQuestion;
                                        setEditedQuestions(updatedQuestions);
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant={option === question.correctAnswer ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handleUpdateQuestion(index, 'correctAnswer', option)}
                                    >
                                      {option === question.correctAnswer ? "Correct" : "Set as correct"}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {question.primaryOptions && question.secondaryOptions && (
                            <div className="space-y-4">
                              <div>
                                <Label>Primary Options</Label>
                                <div className="space-y-2 mt-1">
                                  {question.primaryOptions.map((option: string, optionIndex: number) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                      <Input
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...question.primaryOptions];
                                          newOptions[optionIndex] = e.target.value;
                                          
                                          let newCorrectPrimary = question.correctPrimaryAnswer;
                                          if (question.correctPrimaryAnswer === question.primaryOptions[optionIndex]) {
                                            newCorrectPrimary = e.target.value;
                                          }
                                          
                                          const updatedQuestion = { 
                                            ...question, 
                                            primaryOptions: newOptions,
                                            correctPrimaryAnswer: newCorrectPrimary
                                          };
                                          
                                          const updatedQuestions = [...editedQuestions];
                                          updatedQuestions[index] = updatedQuestion;
                                          setEditedQuestions(updatedQuestions);
                                        }}
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant={option === question.correctPrimaryAnswer ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleUpdateQuestion(index, 'correctPrimaryAnswer', option)}
                                      >
                                        {option === question.correctPrimaryAnswer ? "Correct" : "Set as correct"}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <Label>Secondary Options</Label>
                                <div className="space-y-2 mt-1">
                                  {question.secondaryOptions.map((option: string, optionIndex: number) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                      <Input
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...question.secondaryOptions];
                                          newOptions[optionIndex] = e.target.value;
                                          
                                          let newCorrectSecondary = question.correctSecondaryAnswer;
                                          if (question.correctSecondaryAnswer === question.secondaryOptions[optionIndex]) {
                                            newCorrectSecondary = e.target.value;
                                          }
                                          
                                          const updatedQuestion = { 
                                            ...question, 
                                            secondaryOptions: newOptions,
                                            correctSecondaryAnswer: newCorrectSecondary
                                          };
                                          
                                          const updatedQuestions = [...editedQuestions];
                                          updatedQuestions[index] = updatedQuestion;
                                          setEditedQuestions(updatedQuestions);
                                        }}
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant={option === question.correctSecondaryAnswer ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleUpdateQuestion(index, 'correctSecondaryAnswer', option)}
                                      >
                                        {option === question.correctSecondaryAnswer ? "Correct" : "Set as correct"}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label htmlFor={`explanation-${index}`}>Explanation</Label>
                            <Textarea
                              id={`explanation-${index}`}
                              value={question.explanation}
                              onChange={(e) => handleUpdateQuestion(index, 'explanation', e.target.value)}
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how the questions will appear in the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuestionsList questions={getPreviewQuestions()} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">No Questions Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a question set from the left to review and edit
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

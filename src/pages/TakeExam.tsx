import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

interface Question {
  id: string;
  content: {
    question: string;
    options?: string[];
    answer: string | number;
  };
  questionType: string;
}

const TakeExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user, authInitialized } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (authInitialized && !user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to take exams.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, authInitialized, navigate, toast]);

  useEffect(() => {
    if (!examId || !user) return;

    const fetchExam = async () => {
      try {
        const { data: examData, error: examError } = await supabase
          .from('exams')
          .select('*')
          .eq('id', examId)
          .single();
        
        if (examError) throw examError;
        setExam(examData);
        
        let query = supabase
          .from('questions')
          .select('id, content, question_type');
        
        if (examData.is_standard) {
          const sectionsQuery = await supabase
            .from('question_sections')
            .select('id')
            .eq('category', examData.category);
          
          if (sectionsQuery.error) throw sectionsQuery.error;
          
          const sectionIds = sectionsQuery.data.map(section => section.id);
          
          const subTopicsQuery = await supabase
            .from('sub_topics')
            .select('id')
            .in('section_id', sectionIds);
          
          if (subTopicsQuery.error) throw subTopicsQuery.error;
          
          const subTopicIds = subTopicsQuery.data.map(subTopic => subTopic.id);
          
          query = query.in('sub_topic_id', subTopicIds);
        } else {
          const { data: examSubTopics, error: subTopicsError } = await supabase
            .from('exam_sub_topics')
            .select('sub_topic_id')
            .eq('exam_id', examId);
          
          if (subTopicsError) throw subTopicsError;
          
          if (examSubTopics.length > 0) {
            const subTopicIds = examSubTopics.map(est => est.sub_topic_id);
            query = query.in('sub_topic_id', subTopicIds);
          }
        }
        
        query = query.limit(examData.question_count);
        
        const { data: questionsData, error: questionsError } = await query;
        
        if (questionsError) throw questionsError;
        
        const formattedQuestions = questionsData.map(q => ({
          id: q.id,
          content: q.content,
          questionType: q.question_type
        }));
        
        setQuestions(formattedQuestions);
      } catch (error: any) {
        console.error('Error fetching exam:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load exam",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, user, toast]);

  const handleSelectAnswer = (answerId: string | number) => {
    if (examCompleted) return;
    
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: answerId
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (Object.keys(answers).length === 0) {
      toast({
        title: "Warning",
        description: "Please answer at least one question before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      let correctAnswers = 0;
      
      questions.forEach(question => {
        if (answers[question.id] === question.content.answer) {
          correctAnswers++;
        }
      });
      
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      
      const { error } = await supabase
        .from('exam_results')
        .insert({
          exam_id: examId,
          score: finalScore,
          user_id: user?.id
        });
      
      if (error) throw error;
      
      setExamCompleted(true);
      
      toast({
        title: "Exam Completed",
        description: `Your score: ${finalScore}%`
      });
    } catch (error: any) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit exam",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!authInitialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="section-title">Exam</h1>
        </div>
        
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            This exam doesn't have any questions yet. Please try another exam or contact an administrator.
          </p>
          <Button onClick={() => navigate("/practice")}>Return to Practice</Button>
        </Card>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/practice")} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
          <h1 className="section-title">Exam Completed</h1>
        </div>
        
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">{exam.name}</h2>
          <div className="mb-6 mt-4">
            <p className="text-5xl font-bold text-primary mb-2">{score}%</p>
            <p className="text-gray-600">
              You answered {Object.keys(answers).length} out of {questions.length} questions
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate("/practice")}>Return to Practice</Button>
            <Button variant="outline" onClick={() => {
              setExamCompleted(false);
              setCurrentQuestionIndex(0);
            }}>
              Review Answers
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="page-container">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="section-title">{exam.name}</h1>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        {exam.time_limit_minutes && (
          <p className="text-sm font-medium">
            Time Limit: {exam.time_limit_minutes} minutes
          </p>
        )}
      </div>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.content.question}
        </h2>
        
        {currentQuestion.content.options && (
          <div className="space-y-3">
            {currentQuestion.content.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                  answers[currentQuestion.id] === index 
                    ? 'bg-primary/10 border border-primary' 
                    : 'hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {answers[currentQuestion.id] === index ? (
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 mr-3" />
                )}
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {currentQuestionIndex === questions.length - 1 && (
            <Button 
              onClick={handleSubmitExam} 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Exam'
              )}
            </Button>
          )}
          
          <Button 
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;

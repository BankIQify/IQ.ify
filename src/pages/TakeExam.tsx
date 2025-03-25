import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useExam } from "@/hooks/useExam";

// Components
import LoadingState from "@/components/exam/LoadingState";
import NoQuestions from "@/components/exam/NoQuestions";
import ExamCompleted from "@/components/exam/ExamCompleted";
import QuestionDisplay from "@/components/exam/QuestionDisplay";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamHeader from "@/components/exam/ExamHeader";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const TakeExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user, authInitialized } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle unauthenticated users
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

  // Use the custom exam hook
  const {
    loading,
    submitting,
    exam,
    questions,
    currentQuestionIndex,
    answers,
    examCompleted,
    score,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitExam,
    setCurrentQuestionIndex
  } = useExam({ 
    examId, 
    userId: user?.id 
  });

  // Loading state
  if (!authInitialized || loading) {
    return <LoadingState />;
  }

  // No questions state
  if (!exam || questions.length === 0) {
    return <NoQuestions />;
  }

  // Exam completed state
  if (examCompleted) {
    return (
      <ExamCompleted
        examName={exam.name}
        score={score}
        totalQuestions={questions.length}
        answeredQuestions={Object.keys(answers).length}
        onReviewAnswers={() => {
          // Reset to review mode
          // Keep answers but allow reviewing
          // currentQuestionIndex back to 0
          setCurrentQuestionIndex(0);
        }}
      />
    );
  }

  // Active exam state
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="page-container">
      <ExamHeader
        examName={exam.name}
        currentQuestionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        timeLimit={exam.time_limit_minutes}
      />
      
      <QuestionDisplay
        question={currentQuestion}
        currentAnswerId={answers[currentQuestion.id]}
        examCompleted={examCompleted}
        onSelectAnswer={handleSelectAnswer}
      />
      
      <ExamNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onSubmit={handleSubmitExam}
        submitting={submitting}
      />
    </div>
  );
};

export default TakeExam;

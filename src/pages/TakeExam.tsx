
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
    reviewMode,
    score,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitExam,
    startReviewMode,
    exitReviewMode
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

  // Exam completed state (only if not in review mode)
  if (examCompleted && !reviewMode) {
    return (
      <ExamCompleted
        examName={exam.name}
        score={score}
        totalQuestions={questions.length}
        answeredQuestions={Object.keys(answers).length}
        onReviewAnswers={startReviewMode}
      />
    );
  }

  // Active exam state or review mode
  const currentQuestion = questions[currentQuestionIndex];
  
  console.log('Current question:', currentQuestion);
  
  return (
    <div className="page-container">
      <ExamHeader
        examName={exam.name}
        currentQuestionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        timeLimit={exam.time_limit_minutes}
      />
      
      {currentQuestion ? (
        <QuestionDisplay
          question={currentQuestion}
          currentAnswerId={answers[currentQuestion.id]}
          examCompleted={examCompleted}
          onSelectAnswer={handleSelectAnswer}
          reviewMode={reviewMode}
        />
      ) : (
        <div className="text-center py-4 my-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-700">Question data could not be loaded.</p>
        </div>
      )}
      
      <ExamNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onSubmit={handleSubmitExam}
        submitting={submitting}
        reviewMode={reviewMode}
        onExitReview={exitReviewMode}
      />
    </div>
  );
};

export default TakeExam;

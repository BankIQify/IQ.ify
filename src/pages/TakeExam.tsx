
import { useParams, useNavigate, useEffect } from "react-router-dom";
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
import { Card } from "@/components/ui/card";

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

  // Add a cleanup effect when navigating away from the exam page
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      console.log('Leaving exam page - exam data will be discarded');
      // No need to do anything else here as React will naturally clean up the state
      // when the component unmounts
    };
  }, []);

  // Log exam loading state
  console.log('TakeExam component:', { 
    loading, 
    examId, 
    userId: user?.id,
    questionsLoaded: questions.length > 0,
    examLoaded: !!exam 
  });

  // Loading state
  if (!authInitialized || loading) {
    return <LoadingState />;
  }

  // No exam data state
  if (!exam) {
    return (
      <Card className="p-6 m-6">
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Exam Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the exam you're looking for. The exam may have been removed or the URL is incorrect.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </Card>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="page-container">
        <ExamHeader
          examName={exam.name}
          currentQuestionNumber={0}
          totalQuestions={0}
          timeLimit={exam.time_limit_minutes}
        />
        <NoQuestions />
      </div>
    );
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
        <Card className="p-6 mb-6">
          <div className="text-center py-4 my-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-700">Question data could not be loaded. Please try refreshing the page.</p>
          </div>
        </Card>
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

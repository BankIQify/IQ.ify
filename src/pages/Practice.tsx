<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

const Practice = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Immediately create standard exam when category is selected
  useEffect(() => {
    if (category) {
      createStandardExam(category);
    }
  }, [category]);

  const createStandardExam = async (examCategory: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create practice tests",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    
    try {
      console.log(`Creating standard exam for category: ${examCategory}`);
      
<<<<<<< HEAD
      const examName = `Standard ${getCategoryTitle(examCategory).toLowerCase()} test`;
      
      // Standard configuration for all exam categories
      const questionCount = 15;  // All exams have 15 questions
      const timeLimit = 20;      // All exams have 20 minutes
=======
      const examName = `Standard ${getCategoryTitle(examCategory).toLowerCase()} Test`;
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      
      const { data: exam, error } = await supabase
        .from('exams')
        .insert({
          name: examName,
          category: examCategory,
          is_standard: true,
<<<<<<< HEAD
          question_count: questionCount,
          time_limit_minutes: timeLimit,
=======
          question_count: 10,
          time_limit_minutes: 15,
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Exam created:', exam);
      navigate(`/take-exam/${exam.id}`);
    } catch (error) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error",
        description: "Failed to create exam. Please try again.",
        variant: "destructive"
      });
      navigate("/lets-practice");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = (categoryValue: string) => {
    switch(categoryValue) {
      case "verbal": return "Verbal Reasoning";
      case "non_verbal": return "Non-Verbal Reasoning";
      case "brain_training": return "Brain Training";
      default: return categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1).replace("_", " ");
    }
  };

  const getExamIcon = (examCategory: string) => {
    switch(examCategory) {
      case "verbal": return <BookOpen className="w-8 h-8 text-education-600 mb-4" />;
      case "non_verbal": return <Brain className="w-8 h-8 text-education-600 mb-4" />;
      case "brain_training": return <Brain className="w-8 h-8 text-education-600 mb-4" />;
      default: return <Brain className="w-8 h-8 text-education-600 mb-4" />;
    }
  };

  // If we're on a category page, show loading state until exam is created
  if (category && loading) {
    return (
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="section-title">Creating {getCategoryTitle(category)} Test</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner mb-4"></div>
            <p>Generating practice test...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main category selection page
  return (
    <div className="page-container">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="section-title">Practice Tests</h1>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Select a Category</h2>
        <div className="grid-responsive">
          <Link to="/practice/verbal">
            <Card className="p-6 card-hover cursor-pointer">
              <BookOpen className="w-8 h-8 text-education-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verbal Reasoning</h2>
              <p className="text-gray-600">
                Practice vocabulary, comprehension, and word relationships
              </p>
            </Card>
          </Link>
          <Link to="/practice/non_verbal">
            <Card className="p-6 card-hover cursor-pointer">
              <Brain className="w-8 h-8 text-education-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Non-Verbal Reasoning</h2>
              <p className="text-gray-600">
                Enhance spatial awareness and pattern recognition
              </p>
            </Card>
          </Link>
          <Link to="/practice/brain_training">
            <Card className="p-6 card-hover cursor-pointer">
              <Brain className="w-8 h-8 text-education-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Brain Training</h2>
              <p className="text-gray-600">
                Boost cognitive skills with targeted mental exercises
              </p>
            </Card>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Button asChild className="mt-4">
          <Link to="/lets-practice">Custom Practice Tests</Link>
        </Button>
      </div>
    </div>
  );
};

export default Practice;

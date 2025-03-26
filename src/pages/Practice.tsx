import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Practice = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we're on a category page, immediately create and navigate to an exam
    if (category && user) {
      createAndNavigateToExam(category);
    }
  }, [category, user]);

  const createAndNavigateToExam = async (categoryType: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to take exams",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const examName = `Standard ${categoryType.replace('_', ' ')} Test`;
      
      console.log('Creating standard exam:', { examName, category: categoryType, userId: user.id });
      
      const { data, error } = await supabase
        .from('exams')
        .insert({
          name: examName,
          category: categoryType,
          question_count: 20,
          is_standard: true,
          created_by: user.id
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating standard exam:', error);
        throw error;
      }

      // Navigate directly to take the exam
      if (data) {
        navigate(`/take-exam/${data.id}`);
      } else {
        throw new Error("No exam data returned");
      }
    } catch (error: any) {
      console.error('Error creating standard exam:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create standard exam",
        variant: "destructive"
      });
      // Navigate back to main practice page on error
      navigate("/practice");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    if (!category) return "All Practice Tests";
    
    switch(category) {
      case "verbal": return "Verbal Reasoning";
      case "non_verbal": return "Non-Verbal Reasoning";
      case "brain_training": return "Brain Training";
      default: return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
    }
  };

  if (loading) {
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
          <h1 className="section-title">{getCategoryTitle()}</h1>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg">Creating your practice test...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="section-title">{getCategoryTitle()}</h1>
      </div>

      {!category && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose a Category</h2>
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
      )}
    </div>
  );
};

export default Practice;

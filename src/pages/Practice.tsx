
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Practice = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        let query = supabase.from('exams').select('*');
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        setExams(data || []);
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast({
          title: "Error",
          description: "Failed to load exams",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [category, toast]);

  const getCategoryTitle = () => {
    if (!category) return "All Practice Tests";
    
    switch(category) {
      case "verbal": return "Verbal Reasoning";
      case "non_verbal": return "Non-Verbal Reasoning";
      case "brain_training": return "Brain Training";
      default: return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
    }
  };

  const getExamIcon = (examCategory: string) => {
    switch(examCategory) {
      case "verbal": return <BookOpen className="w-8 h-8 text-education-600 mb-4" />;
      case "non_verbal": return <Brain className="w-8 h-8 text-education-600 mb-4" />;
      case "brain_training": return <Brain className="w-8 h-8 text-education-600 mb-4" />;
      default: return <FileText className="w-8 h-8 text-education-600 mb-4" />;
    }
  };

  const handleExamClick = (examId: string) => {
    navigate(`/take-exam/${examId}`);
  };

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
        <h1 className="section-title">{getCategoryTitle()} Practice</h1>
      </div>

      {loading ? (
        <div className="grid-responsive">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-8 mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </Card>
          ))}
        </div>
      ) : exams.length > 0 ? (
        <div className="grid-responsive">
          {exams.map(exam => (
            <Card 
              key={exam.id} 
              className="p-6 card-hover cursor-pointer" 
              onClick={() => handleExamClick(exam.id)}
            >
              {getExamIcon(exam.category)}
              <h2 className="text-xl font-semibold mb-2">{exam.name}</h2>
              <p className="text-gray-600 mb-2">
                {exam.question_count} questions
              </p>
              <p className="text-sm text-gray-500">
                {exam.is_standard ? "Standard Test" : "Custom Test"}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No exams found for this category.</p>
          <Button asChild>
            <Link to="/lets-practice">Create an Exam</Link>
          </Button>
        </div>
      )}

      {!category && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
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

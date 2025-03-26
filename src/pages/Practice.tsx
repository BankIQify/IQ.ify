
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Practice = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getCategoryTitle = () => {
    if (!category) return "All Practice Tests";
    
    switch(category) {
      case "verbal": return "Verbal Reasoning";
      case "non_verbal": return "Non-Verbal Reasoning";
      case "brain_training": return "Brain Training";
      default: return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
    }
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
        <h1 className="section-title">{getCategoryTitle()}</h1>
      </div>

      {category ? (
        <div className="text-center py-8">
          <p className="text-xl font-semibold mb-4">Create a New {getCategoryTitle()} Test</p>
          <p className="text-gray-500 mb-6">
            Practice tests are generated based on your needs and are not saved after completion.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/lets-practice")}
            className="px-8"
          >
            Create New Test
          </Button>
        </div>
      ) : (
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

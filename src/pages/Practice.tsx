
import { Card } from "@/components/ui/card";
import { BookOpen, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Practice = () => {
  return (
    <div className="page-container">
      <h1 className="section-title">Practice Tests</h1>
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
        <Link to="/practice/non-verbal">
          <Card className="p-6 card-hover cursor-pointer">
            <Brain className="w-8 h-8 text-education-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Non-Verbal Reasoning</h2>
            <p className="text-gray-600">
              Enhance spatial awareness and pattern recognition
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Practice;


import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NoQuestions = () => {
  const navigate = useNavigate();
  
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
};

export default NoQuestions;

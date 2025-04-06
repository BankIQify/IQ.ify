import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const QuestionEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "data_input") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Question Editor</h1>
      <div className="bg-card rounded-lg p-6">
        <p className="text-muted-foreground">
          This section is for editing and managing questions. The interface will be implemented soon.
        </p>
      </div>
    </div>
  );
};

export default QuestionEditor; 
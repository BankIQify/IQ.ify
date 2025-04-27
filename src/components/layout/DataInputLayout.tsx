import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function DataInputLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Data Input Dashboard</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/data-input/questions")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Questions
            </Button>
            <Button
              onClick={() => navigate("/data-input/webhook")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Webhook Data
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

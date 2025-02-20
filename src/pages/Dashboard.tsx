
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="page-container">
      <h1 className="section-title">Your Progress Dashboard</h1>
      <div className="grid-responsive">
        <Card className="p-6 card-hover">
          <BookOpen className="w-8 h-8 text-education-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Verbal Reasoning</h2>
          <p className="text-gray-600">Track your verbal reasoning progress</p>
        </Card>
        <Card className="p-6 card-hover">
          <Brain className="w-8 h-8 text-education-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Non-Verbal Reasoning</h2>
          <p className="text-gray-600">Monitor your non-verbal reasoning skills</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

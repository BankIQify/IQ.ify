
import { Link } from "react-router-dom";
import { BookOpen, Brain, Trophy, Lock, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-education-600" />,
      title: "Comprehensive Practice",
      description:
        "Access a wide range of verbal and non-verbal reasoning questions tailored for 11+ exam preparation.",
      benefits: [
        "Diverse question types",
        "Structured learning paths",
        "Regular content updates"
      ]
    },
    {
      icon: <Brain className="w-12 h-12 text-education-600" />,
      title: "Brain Training Games",
      description:
        "Enhance cognitive skills with fun, interactive games and puzzles designed to boost learning.",
      benefits: [
        "Memory games",
        "Sudoku challenges",
        "Word puzzles",
        "Geography quizzes"
      ]
    },
    {
      icon: <Trophy className="w-12 h-12 text-education-600" />,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and performance tracking.",
      benefits: [
        "Detailed statistics",
        "Progress visualization",
        "Performance insights"
      ]
    },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Master the 11+ Exam
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comprehensive preparation for verbal and non-verbal reasoning with
          interactive practice and brain training.
        </p>
        {user ? (
          <div className="space-y-4">
            <Link
              to="/lets-practice"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors mx-2"
            >
              Start Practicing
            </Link>
            <Link
              to="/brain-training"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-education-600 border-2 border-education-600 rounded-lg hover:bg-education-50 transition-colors mx-2"
            >
              Play Brain Games
            </Link>
          </div>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors"
          >
            Get Started
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm card-hover"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
            {!user && (
              <div className="mt-4 flex items-center text-gray-500">
                <Lock className="w-4 h-4 mr-2" />
                Sign in to unlock
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="text-center bg-education-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Join now to access all our features and start improving your skills today.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Index;

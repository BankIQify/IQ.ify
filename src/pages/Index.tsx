
import { Link } from "react-router-dom";
import { BookOpen, Brain, Trophy } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-education-600" />,
      title: "Comprehensive Practice",
      description:
        "Access a wide range of verbal and non-verbal reasoning questions tailored for 11+ exam preparation.",
    },
    {
      icon: <Brain className="w-12 h-12 text-education-600" />,
      title: "Brain Training",
      description:
        "Enhance cognitive skills with fun, interactive games and puzzles designed to boost learning.",
    },
    {
      icon: <Trophy className="w-12 h-12 text-education-600" />,
      title: "Track Progress",
      description:
        "Monitor your improvement with detailed analytics and performance tracking.",
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
        <Link
          to="/practice"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors"
        >
          Start Practicing
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid-responsive">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm card-hover"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

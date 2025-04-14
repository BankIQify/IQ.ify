import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle, Sparkles, Brain, Zap, Trophy, Puzzle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CustomExamForm } from '@/components/exams/CustomExamForm';

const LoadingCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Loading...</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </CardContent>
  </Card>
);

const ErrorCard = ({ error }: { error: Error }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-destructive">Error</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center gap-4 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-center text-muted-foreground">{error.message}</p>
      </div>
    </CardContent>
  </Card>
);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const categoryCards = [
  {
    title: "Non-verbal Reasoning",
    description: "Visual and spatial problem solving",
    icon: Brain,
    color: "from-blue-50 to-purple-50",
    link: "/practice/non-verbal",
    features: [
      "Pattern recognition",
      "Spatial visualization",
      "Abstract reasoning",
      "Visual sequence completion"
    ]
  },
  {
    title: "Verbal Reasoning",
    description: "Language and comprehension skills",
    icon: Sparkles,
    color: "from-green-50 to-teal-50",
    link: "/practice/verbal",
    features: [
      "Word relationships",
      "Text comprehension",
      "Vocabulary skills",
      "Logical deduction"
    ]
  },
  {
    title: "Brain Training",
    description: "Cognitive enhancement exercises",
    icon: Puzzle,
    color: "from-orange-50 to-amber-50",
    link: "/practice/brain-training",
    features: [
      "Memory improvement",
      "Processing speed",
      "Mental flexibility",
      "Focus enhancement"
    ]
  }
];

const LetsPractice = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Sign in to Practice</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access practice tests and track your progress.
            </p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Practice Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our standard categories or create your own custom practice test
        </p>
      </div>

      <div className="space-y-12">
        {/* Standard Practice Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-center">Standard Practice Tests</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((category, index) => (
              <ErrorBoundary key={category.title}>
                <Suspense fallback={<LoadingCard />}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                  >
                    <Card className={`h-full bg-gradient-to-br ${category.color} border-2 hover:border-primary transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <category.icon className="h-6 w-6 text-primary" />
                          <CardTitle>{category.title}</CardTitle>
                        </div>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                            {category.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                          <Link to={category.link}>
                            <Button className="w-full bg-primary hover:bg-primary/90">
                              Start Practice
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Suspense>
              </ErrorBoundary>
            ))}
          </div>
        </section>

        {/* Custom Practice Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-center">Custom Practice Test</h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <ErrorBoundary>
              <Suspense fallback={<LoadingCard />}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="bg-gradient-to-br from-pink-50 to-orange-50 border-2 hover:border-primary transition-all duration-300">
                    <CardHeader>
                      <CardDescription className="text-center">
                        Create your own personalized practice test by selecting specific topics and difficulty levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CustomExamForm />
                    </CardContent>
                  </Card>
                </motion.div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LetsPractice; 
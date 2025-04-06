import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Let's Practice</h1>
        <Link to="/manage-exams">
          <Button variant="outline">Create Custom Test</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Standard Practice Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Choose from our curated collection of practice tests designed to help you improve.
                    </p>
                    <Link to="/practice">
                      <Button className="w-full">Start Standard Test</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Custom Practice Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Take tests you've created or shared by others in your network.
                    </p>
                    <Link to="/manage-exams">
                      <Button className="w-full">Manage Custom Tests</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default LetsPractice; 
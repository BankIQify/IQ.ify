
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[rgba(30,174,219,0.05)] via-white to-[rgba(255,105,180,0.05)] p-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="bg-red-50 w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center">
          <span className="text-6xl font-bold text-red-500">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Page not found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
          <br />
          <span className="text-gray-500 text-sm">
            Attempted path: {location.pathname}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

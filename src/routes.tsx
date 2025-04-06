import { Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import { AboutUs } from "./pages/AboutUs";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import LetsPractice from "./pages/LetsPractice";
import BrainTraining from "./pages/BrainTraining";
import Profile from "./pages/Profile";
import SubjectProgress from "./pages/SubjectProgress";
import Practice from "./pages/Practice";
import TakeExam from "./pages/TakeExam";
import AvatarCreator from "./pages/AvatarCreator";
import { TestimonialForm } from "./components/testimonials/TestimonialForm";
import ManageSubscription from "./pages/subscription/ManageSubscription";
import ManageQuestions from "./pages/ManageQuestions";
import NotFound from "./pages/NotFound";
import { DataInputLayout } from "./components/layout/DataInputLayout";
import WebhookDataPage from "./pages/WebhookDataPage";
import QuestionEditor from "./pages/QuestionEditor";
import Navigation from "@/components/Navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DataInputProtectedRoute } from "@/components/auth/DataInputProtectedRoute";

export const routes = [
  {
    element: (
      <div className="min-h-screen bg-gradient-to-b from-[rgba(30,174,219,0.05)] via-white to-[rgba(255,105,180,0.05)]">
        <Navigation />
        <Outlet />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/about",
        element: <AboutUs />
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        element: <DataInputProtectedRoute />,
        children: [
          {
            path: "/data-input",
            element: <DataInputLayout />,
            children: [
              {
                path: "/data-input/webhook",
                element: <WebhookDataPage />
              },
              {
                path: "/data-input/questions",
                element: <QuestionEditor />
              },
              {
                path: "/data-input/manage-questions",
                element: <ManageQuestions />
              }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/lets-practice",
            element: <LetsPractice />
          },
          {
            path: "/brain-training",
            element: <BrainTraining />
          },
          {
            path: "/profile",
            element: <Profile />
          },
          {
            path: "/progress/:subject",
            element: <SubjectProgress />
          },
          {
            path: "/practice/:category",
            element: <Practice />
          },
          {
            path: "/practice",
            element: <Practice />
          },
          {
            path: "/take-exam/:examId",
            element: <TakeExam />
          },
          {
            path: "/avatar-creator",
            element: <AvatarCreator />
          },
          {
            path: "/testimonials/new",
            element: <TestimonialForm />
          },
          {
            path: "/subscription/manage",
            element: <ManageSubscription />
          },
          {
            path: "/manage-questions",
            element: <ManageQuestions />
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]; 
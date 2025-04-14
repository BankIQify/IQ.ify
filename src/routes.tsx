import { createRoutesFromElements, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ManageQuestions from "./pages/ManageQuestions";
import BrainTraining from "./pages/BrainTraining";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SubjectProgress from "./pages/SubjectProgress";
import Practice from "./pages/Practice";
import TakeExam from "./pages/TakeExam";
import Profile from "./pages/Profile";
import LetsPractice from "./pages/LetsPractice";
import UserLogs from "./pages/UserLogs";
import AvatarCreator from "./pages/AvatarCreator";
import { TestimonialForm } from "./components/testimonials/TestimonialForm";
import ManageSubscription from "./pages/subscription/ManageSubscription";
import AboutUs from "./pages/AboutUs";
import QuestionBank from "./pages/QuestionBank";
import GameData from "./pages/GameData";
import HomepageEditor from "./pages/HomepageEditor";
import { SignUp } from "./pages/SignUp";

export const routes = createRoutesFromElements(
  <Route id="routes">
    <Route id="index" path="/" element={<Index />} />
    <Route id="auth" path="/auth" element={<Auth />} />
    <Route id="signup" path="/signup" element={<SignUp />} />
    <Route id="about" path="/about" element={<AboutUs />} />
    
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/brain-training" element={<BrainTraining />} />
      <Route path="/subject-progress" element={<SubjectProgress />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/take-exam" element={<TakeExam />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/lets-practice" element={<LetsPractice />} />
      <Route path="/avatar-creator" element={<AvatarCreator />} />
      <Route path="/testimonial-form" element={<TestimonialForm />} />
      <Route path="/manage-subscription" element={<ManageSubscription />} />
    </Route>

    <Route element={<AdminProtectedRoute />}>
      <Route path="/manage-questions" element={<ManageQuestions />} />
      <Route path="/user-logs" element={<UserLogs />} />
      <Route path="/question-bank" element={<QuestionBank />} />
      <Route path="/game-data" element={<GameData />} />
      <Route path="/homepage-editor" element={<HomepageEditor />} />
    </Route>
    
    <Route id="not-found" path="*" element={<NotFound />} />
  </Route>
);
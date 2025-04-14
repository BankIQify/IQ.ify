import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { MultiStepSignUp } from "@/components/auth/MultiStepSignUp";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithGoogle } = useAuth();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data } = await signInWithGoogle();
      if (data?.user) {
        // If this is a new user signing up with Google, show the sign-up form
        if (!data.user.user_metadata?.profile_completed) {
          setIsLogin(false);
        }
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-white to-[rgba(30,174,219,0.02)]">
      {/* Logo */}
      <Link to="/" className="absolute top-6 left-6 z-10">
        <div className="w-16 h-16 rounded-full bg-[#1EAEDB]/10 backdrop-blur-sm shadow-lg shadow-[#1EAEDB]/20 flex items-center justify-center hover:bg-[#1EAEDB]/20 transition-colors duration-200">
          <Logo className="w-10 h-auto" />
        </div>
      </Link>

      {/* Background Bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Edge bubbles */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 rounded-full bg-[#1EAEDB]"
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(15px)' }}
        />
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#FF6B6B]"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: 0.35, scale: 1.1 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(10px)' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#4ECDC4]"
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{ opacity: 0.35, scale: 1.2 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(18px)' }}
        />

        {/* Corner bubbles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#1EAEDB]"
          initial={{ opacity: 0.25, scale: 0.9 }}
          animate={{ opacity: 0.3, scale: 1.1 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(12px)' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-[#FF6B6B]"
          initial={{ opacity: 0.25, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(14px)' }}
        />

        {/* Center bubbles */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-[#1EAEDB]"
          initial={{ opacity: 0.2, scale: 0.9 }}
          animate={{ opacity: 0.25, scale: 1.1 }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(20px)' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-36 h-36 rounded-full bg-[#FF6B6B]"
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(15px)' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-[#4ECDC4]"
          initial={{ opacity: 0.2, scale: 0.9 }}
          animate={{ opacity: 0.25, scale: 1.1 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: 'blur(18px)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4">
        {isLogin ? (
          <LoginForm onToggleMode={toggleAuthMode} onGoogleSignIn={handleGoogleSignIn} />
        ) : (
          <MultiStepSignUp onToggleMode={toggleAuthMode} onGoogleSignIn={handleGoogleSignIn} />
        )}
      </div>
    </div>
  );
};

export default Auth;

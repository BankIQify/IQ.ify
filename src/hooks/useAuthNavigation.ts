import { useNavigate } from "react-router-dom";

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const navigateToAuth = () => {
    navigate('/auth', { replace: true });
  };

  return {
    navigateToAuth
  };
};

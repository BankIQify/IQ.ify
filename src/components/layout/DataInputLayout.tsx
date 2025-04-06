import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DataInputSidebar } from "./DataInputSidebar";

export const DataInputLayout = () => {
  const { user } = useAuth();

  // Check if user is data input role
  const isDataInput = user?.role === "data_input";

  if (!isDataInput) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen">
      <DataInputSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}; 
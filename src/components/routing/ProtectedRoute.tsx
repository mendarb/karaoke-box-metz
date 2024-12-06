import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isLoading: boolean;
  sessionChecked: boolean;
  isAuthOpen: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  isLoading,
  sessionChecked,
  isAuthOpen,
  children,
}: ProtectedRouteProps) => {
  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (isAuthOpen) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
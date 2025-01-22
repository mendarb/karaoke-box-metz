import { Navigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({
  children,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const { isLoading, sessionChecked, user, isAdmin } = useUserState();

  if (!sessionChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
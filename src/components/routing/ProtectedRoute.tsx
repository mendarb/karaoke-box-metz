import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Navbar } from "@/components/navigation/Navbar";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  hideNavbar?: boolean;
  onShowAuth?: () => void;
}

export const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  hideNavbar = false,
  onShowAuth = () => {} 
}: ProtectedRouteProps) => {
  const { session } = useAuthSession();
  const { isAdmin } = useAdminCheck();

  if (!session) {
    return <Navigate to="/" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {!hideNavbar && <Navbar onShowAuth={onShowAuth} />}
      {children}
    </>
  );
};
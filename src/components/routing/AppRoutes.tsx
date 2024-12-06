import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { Success } from "@/pages/Success";
import { AuthModal } from "@/components/auth/AuthModal";
import { ProtectedRoute } from "./ProtectedRoute";

interface AppRoutesProps {
  isAuthOpen: boolean;
  setIsAuthOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  sessionChecked: boolean;
}

export const AppRoutes = ({
  isAuthOpen,
  setIsAuthOpen,
  isLoading,
  sessionChecked,
}: AppRoutesProps) => {
  const protectedRouteProps = {
    isLoading,
    sessionChecked,
    isAuthOpen,
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute {...protectedRouteProps}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/calendar"
        element={
          <ProtectedRoute {...protectedRouteProps}>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute {...protectedRouteProps}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <>
            <AuthModal
              isOpen={isAuthOpen}
              onClose={() => {
                setIsAuthOpen(false);
                window.location.href = '/';
              }}
            />
            {!isAuthOpen && <Navigate to="/" replace />}
          </>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
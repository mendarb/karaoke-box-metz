import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Terms from "@/pages/legal/Terms";
import Privacy from "@/pages/legal/Privacy";
import Cancellation from "@/pages/legal/Cancellation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AccountPage } from "@/components/account/AccountPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { MyBookings } from "@/pages/MyBookings";
import Success from "@/pages/Success";
import { Error } from "@/pages/Error";
import { DocumentationPage } from "@/components/admin/documentation/DocumentationPage";
import { Accounts } from "@/pages/Accounts";
import { EditAccountPage } from "@/components/admin/accounts/EditAccountPage";
import Box3D from "@/pages/Box3D";
import { ResetPassword } from "@/components/auth/ResetPassword";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/box-3d" element={<Box3D />} />
      <Route path="/success" element={<Success />} />
      <Route path="/error" element={<Error />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/cancellation" element={<Cancellation />} />
      <Route path="/account/reset-password" element={<ResetPassword />} />
      
      {/* Routes protégées pour l'admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/calendar"
        element={
          <ProtectedRoute adminOnly>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute adminOnly>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts"
        element={
          <ProtectedRoute adminOnly>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditAccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/documentation"
        element={
          <ProtectedRoute adminOnly>
            <DocumentationPage />
          </ProtectedRoute>
        }
      />

      {/* Routes protégées pour les utilisateurs */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
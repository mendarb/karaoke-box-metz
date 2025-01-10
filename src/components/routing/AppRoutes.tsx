import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Box3D from "@/pages/Box3D";
import Success from "@/pages/Success";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { Error } from "@/pages/Error";
import Terms from "@/pages/legal/Terms";
import Privacy from "@/pages/legal/Privacy";
import Cancellation from "@/pages/legal/Cancellation";
import { AccountPage } from "@/components/account/AccountPage";
import MyBookings from "@/pages/MyBookings";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { Accounts } from "@/pages/Accounts";
import { EditAccountPage } from "@/components/admin/accounts/EditAccountPage";
import { DocumentationPage } from "@/components/admin/documentation/DocumentationPage";
import { AuthCallback } from "@/components/auth/AuthCallback";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/box-3d" element={<Box3D />} />
      <Route path="/success" element={<Success />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account/reset-password" element={<ResetPassword />} />
      <Route path="/error" element={<Error />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/cancellation" element={<Cancellation />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
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

      {/* Admin Routes */}
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
    </Routes>
  );
};
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
import { MyBookings } from "@/pages/MyBookings";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./route-groups/AdminRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/box-3d" element={<Box3D />} />
      <Route path="/success" element={<Success />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/error" element={<Error />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/cancellation" element={<Cancellation />} />

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
      <AdminRoutes />
    </Routes>
  );
};
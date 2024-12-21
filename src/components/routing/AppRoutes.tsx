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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/cancellation" element={<Cancellation />} />
      
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
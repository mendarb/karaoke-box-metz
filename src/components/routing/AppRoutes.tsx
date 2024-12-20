import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Terms from "@/pages/legal/Terms";
import Privacy from "@/pages/legal/Privacy";
import Cancellation from "@/pages/legal/Cancellation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BookingHistory } from "@/components/booking/BookingHistory";
import { AccountPage } from "@/components/account/AccountPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { MyBookings } from "@/pages/MyBookings";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/cancellation" element={<Cancellation />} />
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
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
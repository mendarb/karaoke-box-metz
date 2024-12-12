import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { MyBookings } from "@/pages/MyBookings";
import { Success } from "@/pages/Success";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { ProtectedRoute } from "./ProtectedRoute";
import { AccountPage } from "@/components/account/AccountPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
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
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Calendar />
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
    </Routes>
  );
};
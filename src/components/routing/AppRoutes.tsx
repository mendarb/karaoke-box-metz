import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { Success } from "@/pages/Success";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { BookingsPage } from "@/pages/Bookings";
import { MyBookingsPage } from "@/pages/MyBookings";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
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
        path="/admin/bookings"
        element={
          <ProtectedRoute adminOnly>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
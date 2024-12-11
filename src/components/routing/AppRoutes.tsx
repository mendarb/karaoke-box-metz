import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { MyBookings } from "@/pages/MyBookings";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
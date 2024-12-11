import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { MyBookings } from "@/pages/MyBookings";
import { ProtectedRoute } from "./ProtectedRoute";

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
    </Routes>
  );
};
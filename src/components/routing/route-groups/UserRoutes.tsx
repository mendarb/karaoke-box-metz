import { Routes, Route } from "react-router-dom";
import { AccountPage } from "@/components/account/AccountPage";
import MyBookings from "@/pages/MyBookings";
import { ProtectedRoute } from "../ProtectedRoute";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
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
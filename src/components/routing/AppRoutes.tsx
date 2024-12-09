import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { Success } from "@/pages/Success";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { ProtectedRoute } from "./ProtectedRoute";
import { BookingsPage } from "@/pages/Bookings";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute adminOnly>
            <Calendar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute adminOnly>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bookings" 
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
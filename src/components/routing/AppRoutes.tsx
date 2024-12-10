import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import { Success } from "@/pages/Success";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
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
    </Routes>
  );
};
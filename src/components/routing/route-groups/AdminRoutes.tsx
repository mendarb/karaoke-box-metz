import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { Accounts } from "@/pages/Accounts";
import { EditAccountPage } from "@/components/admin/accounts/EditAccountPage";
import { DocumentationPage } from "@/components/admin/documentation/DocumentationPage";
import { Analytics } from "@/pages/Analytics";
import { ProtectedRoute } from "../ProtectedRoute";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
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
        path="/accounts"
        element={
          <ProtectedRoute adminOnly>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditAccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documentation"
        element={
          <ProtectedRoute adminOnly>
            <DocumentationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute adminOnly>
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
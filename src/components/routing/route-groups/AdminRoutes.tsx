import { Route } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { Accounts } from "@/pages/Accounts";
import { EditAccountPage } from "@/components/admin/accounts/EditAccountPage";
import { DocumentationPage } from "@/components/admin/documentation/DocumentationPage";
import { ProtectedRoute } from "../ProtectedRoute";

export const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly hideNavbar>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/calendar"
        element={
          <ProtectedRoute adminOnly hideNavbar>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute adminOnly hideNavbar>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts"
        element={
          <ProtectedRoute adminOnly hideNavbar>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts/:id"
        element={
          <ProtectedRoute adminOnly hideNavbar>
            <EditAccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/documentation"
        element={
          <ProtectedRoute adminOnly hideNavbar>
            <DocumentationPage />
          </ProtectedRoute>
        }
      />
    </>
  );
};
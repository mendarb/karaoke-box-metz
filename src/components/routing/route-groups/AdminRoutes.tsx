import { Route } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { Accounts } from "@/pages/Accounts";
import { EditAccountPage } from "@/components/admin/accounts/EditAccountPage";
import { DocumentationPage } from "@/components/admin/documentation/DocumentationPage";
import { LandingPages } from "@/pages/LandingPages";
import { ProtectedRoute } from "../ProtectedRoute";

export const AdminRoutes = () => {
  return (
    <>
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
        path="/admin/accounts"
        element={
          <ProtectedRoute adminOnly>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditAccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/documentation"
        element={
          <ProtectedRoute adminOnly>
            <DocumentationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/landing-pages"
        element={
          <ProtectedRoute adminOnly>
            <LandingPages />
          </ProtectedRoute>
        }
      />
    </>
  );
};
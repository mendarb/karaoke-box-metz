import { Routes } from "react-router-dom";
import { PublicRoutes } from "./route-groups/PublicRoutes";
import { AdminRoutes } from "./route-groups/AdminRoutes";
import { UserRoutes } from "./route-groups/UserRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      <PublicRoutes />
      <AdminRoutes />
      <UserRoutes />
    </Routes>
  );
};
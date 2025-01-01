import { Routes } from "react-router-dom";
import { PublicRoutes } from "./routes/PublicRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { UserRoutes } from "./routes/UserRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      <PublicRoutes />
      <AdminRoutes />
      <UserRoutes />
    </Routes>
  );
};
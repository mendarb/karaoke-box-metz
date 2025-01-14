import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Box3D } from "@/pages/Box3D";
import { Success } from "@/pages/Success";
import { StaffCalendar } from "@/pages/StaffCalendar";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/box3d" element={<Box3D />} />
      <Route path="/success" element={<Success />} />
      <Route path="/staff" element={<StaffCalendar />} />
    </Routes>
  );
};
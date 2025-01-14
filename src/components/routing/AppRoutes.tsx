import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./route-groups/PublicRoutes";
import { UserRoutes } from "./route-groups/UserRoutes";
import { AdminRoutes } from "./route-groups/AdminRoutes";
import { Navbar } from "../navigation/Navbar";
import { AuthModal } from "../auth/AuthModal";
import { StaffCalendar } from "@/pages/StaffCalendar";

export const AppRoutes = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/account/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/staff" element={<StaffCalendar />} />
      </Routes>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};
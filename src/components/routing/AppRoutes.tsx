import { Routes, Route } from "react-router-dom";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountPage } from "@/components/account/AccountPage";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BookingsPage } from "@/pages/Bookings";
import { Calendar } from "@/pages/Calendar";
import Index from "@/pages/Index";
import { Settings } from "@/pages/Settings";
import Success from "@/pages/Success";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentError from "@/pages/PaymentError";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/success" element={<Success />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-error" element={<PaymentError />} />
      <Route path="/account" element={<AccountLayout><AccountPage /></AccountLayout>} />
      <Route path="/bookings" element={<AccountLayout><BookingsPage /></AccountLayout>} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};
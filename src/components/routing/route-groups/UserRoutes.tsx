import { Routes, Route } from "react-router-dom";
import { AccountPage } from "@/components/account/AccountPage";
import { BookingHistory } from "@/components/booking/BookingHistory";
import { ProtectedRoute } from "../ProtectedRoute";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="my-bookings" element={
        <ProtectedRoute>
          <main className="container max-w-4xl mx-auto py-8 px-4">
            <BookingHistory />
          </main>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
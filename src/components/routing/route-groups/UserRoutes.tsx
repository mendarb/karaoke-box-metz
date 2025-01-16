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
          <main className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <BookingHistory />
            </div>
          </main>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
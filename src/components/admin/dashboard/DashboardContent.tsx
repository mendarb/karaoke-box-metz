import React from "react";
import { AdminBookingForm } from "../BookingForm";

export const DashboardContent = () => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg">
        <AdminBookingForm />
      </div>
    </div>
  );
};
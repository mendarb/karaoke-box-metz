import { Booking } from "@/hooks/useBookings";
import { DashboardStats } from "../DashboardStats";
import { BookingsTable } from "../BookingsTable";

interface DashboardContentProps {
  bookings: Booking[];
  isLoading: boolean;
  onViewDetails: (booking: Booking) => void;
}

export const DashboardContent = ({ 
  bookings, 
  isLoading,
  onViewDetails 
}: DashboardContentProps) => {
  // onStatusChange is now handled directly by BookingActions component
  const dummyOnStatusChange = async () => {}; // Placeholder to satisfy type requirements

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      <div className="mb-8">
        <DashboardStats bookings={bookings} />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-2 md:p-6 overflow-x-auto">
        <BookingsTable
          data={bookings}
          onViewDetails={onViewDetails}
          onStatusChange={dummyOnStatusChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
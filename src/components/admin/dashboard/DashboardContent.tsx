import { Booking } from "@/hooks/useBookings";
import { BookingsTable } from "../BookingsTable";
import { DashboardStats } from "../DashboardStats";

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
  return (
    <div className="p-4 md:p-8 space-y-8 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Gérez vos réservations et consultez les statistiques</p>
      </div>

      <DashboardStats bookings={bookings} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Réservations récentes</h2>
        <BookingsTable 
          data={bookings}
          onStatusChange={async () => {}}
          onViewDetails={onViewDetails}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
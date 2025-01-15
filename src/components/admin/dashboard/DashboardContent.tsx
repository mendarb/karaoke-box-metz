import { Booking } from "@/hooks/useBookings";
import { BookingsTable } from "../BookingsTable";
import { DashboardStats } from "../DashboardStats";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

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
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 space-y-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos réservations et consultez les statistiques</p>
        </div>
        <Button 
          onClick={() => navigate("/admin/bookings/new")} 
          className="bg-kbox-coral hover:bg-kbox-orange-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle réservation
        </Button>
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
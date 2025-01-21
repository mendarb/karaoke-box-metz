import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingsTable } from "../BookingsTable";
import { useState } from "react";
import { AdminBookingForm } from "../BookingForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Booking } from "@/hooks/useBookings";
import { DashboardStats } from "../DashboardStats";
import { useBookingActions } from "@/hooks/useBookingActions";

interface DashboardContentProps {
  bookings: Booking[];
  isLoading: boolean;
  onViewDetails: (booking: Booking) => void;
}

export const DashboardContent = ({ bookings, isLoading, onViewDetails }: DashboardContentProps) => {
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { updateBookingStatus } = useBookingActions();

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos réservations et consultez les statistiques</p>
        </div>
        <Button 
          onClick={() => setIsBookingModalOpen(true)} 
          className="bg-kbox-coral hover:bg-kbox-orange-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle réservation
        </Button>
      </div>

      <DashboardStats bookings={bookings} />

      <BookingsTable 
        data={bookings}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
        onStatusChange={handleStatusChange}
      />

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-4xl">
          <AdminBookingForm onClose={() => setIsBookingModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
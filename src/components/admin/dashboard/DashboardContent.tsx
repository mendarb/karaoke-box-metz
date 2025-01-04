import { useState } from "react";
import { Booking } from "@/hooks/useBookings";
import { DashboardStats } from "../DashboardStats";
import { BookingsTable } from "../BookingsTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminBookingForm } from "../BookingForm";
import { Plus, Trash2 } from "lucide-react";
import { CleanupBookingsDialog } from "../actions/CleanupBookingsDialog";

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
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const dummyOnStatusChange = async () => {};

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => setIsCleanupDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Nettoyer les réservations
          </Button>
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle réservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle réservation</DialogTitle>
              </DialogHeader>
              <AdminBookingForm onClose={() => setIsBookingDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
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

      <CleanupBookingsDialog 
        isOpen={isCleanupDialogOpen}
        onClose={() => setIsCleanupDialogOpen(false)}
      />
    </div>
  );
};
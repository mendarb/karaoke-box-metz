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
  const dummyOnStatusChange = async () => {};

  return (
    <div className="p-4 md:p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Gestion des réservations et statistiques</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex w-full md:w-auto gap-2">
          <Button
            variant="destructive"
            onClick={() => setIsCleanupDialogOpen(true)}
            className="flex-1 md:flex-none text-sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Nettoyer
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 md:flex-none text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle réservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle réservation</DialogTitle>
              </DialogHeader>
              <AdminBookingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="mb-6">
        <DashboardStats bookings={bookings} />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
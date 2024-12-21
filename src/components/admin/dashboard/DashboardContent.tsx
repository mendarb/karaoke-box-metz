import { Booking } from "@/hooks/useBookings";
import { DashboardStats } from "../DashboardStats";
import { BookingsTable } from "../BookingsTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminBookingForm } from "../BookingForm";
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
  const dummyOnStatusChange = async () => {};

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        <Dialog>
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
            <AdminBookingForm />
          </DialogContent>
        </Dialog>
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
    </div>
  );
};
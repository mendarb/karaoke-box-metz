import { useState } from "react";
import { Booking } from "@/hooks/useBookings";
import { DashboardStats } from "../DashboardStats";
import { BookingsTable } from "../BookingsTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminBookingForm } from "../BookingForm";
import { Plus, Trash2 } from "lucide-react";
import { CleanupBookingsDialog } from "../actions/CleanupBookingsDialog";
import { Card } from "@/components/ui/card";

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

  // Calculer les statistiques des réservations
  const totalRevenue = bookings.reduce((sum, booking) => {
    if (booking.payment_status === 'paid') {
      return sum + (booking.price || 0);
    }
    return sum;
  }, 0);

  const paidBookings = bookings.filter(booking => booking.payment_status === 'paid').length;
  const pendingBookings = bookings.filter(booking => booking.payment_status === 'pending').length;

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
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Revenu total</h3>
          <p className="text-2xl font-bold">{totalRevenue}€</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Réservations payées</h3>
          <p className="text-2xl font-bold">{paidBookings}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Réservations en attente</h3>
          <p className="text-2xl font-bold">{pendingBookings}</p>
        </Card>
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
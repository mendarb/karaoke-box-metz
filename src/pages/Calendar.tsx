import { useState } from "react";
import { DashboardLayout } from "@/components/admin/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminBookingForm } from "@/components/admin/BookingForm";
import { FullCalendar } from "@/components/calendar/FullCalendar";
import { useBookings } from "@/hooks/useBookings";

export const Calendar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: bookings = [], isLoading } = useBookings();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calendrier des réservations</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle réservation
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <FullCalendar bookings={bookings} isLoading={isLoading} />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle réservation</DialogTitle>
            </DialogHeader>
            <AdminBookingForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
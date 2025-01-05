import { useState } from "react";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminBookingForm } from "@/components/admin/BookingForm";
import { BookingsList } from "@/components/admin/calendar/BookingsList";
import { useBookings, Booking } from "@/hooks/useBookings";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookingDetailsDialog } from "@/components/admin/BookingDetailsDialog";

export const Calendar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { data: bookings = [], isLoading } = useBookings();

  // Filtrer les réservations pour la date sélectionnée
  const filteredBookings = selectedDate
    ? bookings.filter(
        (booking) =>
          format(new Date(booking.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  // Créer un objet pour marquer les jours avec des réservations
  const bookedDays = bookings.reduce((acc: { [key: string]: boolean }, booking) => {
    const date = format(new Date(booking.date), "yyyy-MM-dd");
    acc[date] = true;
    return acc;
  }, {});

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    console.log("Date sélectionnée:", date);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    console.log("Détails de la réservation:", booking);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calendrier des réservations</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle réservation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={fr}
              modifiers={{
                booked: (date) =>
                  bookedDays[format(date, "yyyy-MM-dd")] === true,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "rgb(139 92 246 / 0.1)",
                  color: "rgb(139 92 246)",
                  fontWeight: "bold"
                }
              }}
              className="rounded-md border"
            />
          </Card>

          <BookingsList
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            selectedDate={selectedDate}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle réservation</DialogTitle>
            </DialogHeader>
            <AdminBookingForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        {selectedBooking && (
          <BookingDetailsDialog
            isOpen={!!selectedBooking}
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
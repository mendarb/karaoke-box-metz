import { Booking } from "@/hooks/useBookings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../BookingActions";

interface BookingsListProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
  selectedDate?: Date;
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>;
}

export const BookingsList = ({ 
  bookings, 
  onViewDetails,
  selectedDate,
  onStatusChange 
}: BookingsListProps) => {
  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {selectedDate ? (
          `Réservations du ${format(selectedDate, 'd MMMM yyyy', { locale: fr })}`
        ) : (
          'Sélectionnez une date'
        )}
      </h2>
      
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground">Aucune réservation pour cette date</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col space-y-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{booking.user_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.time_slot}h - {parseInt(booking.time_slot) + parseInt(booking.duration)}h
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">{booking.group_size} pers.</Badge>
                <Badge variant="outline">{booking.duration}h</Badge>
                <Badge variant="outline">{booking.price}€</Badge>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(booking)}
                >
                  Détails
                </Button>
                <BookingActions 
                  bookingId={booking.id}
                  currentStatus={booking.status}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
import { Booking } from "@/hooks/useBookings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../BookingActions";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import { Mail, Phone, User } from "lucide-react";

interface BookingsListProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
  selectedDate?: Date;
}

export const BookingsList = ({ 
  bookings, 
  onViewDetails,
  selectedDate
}: BookingsListProps) => {
  return (
    <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
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
          bookings.map((booking) => {
            const startHour = parseInt(booking.time_slot);
            const endHour = startHour + parseInt(booking.duration);
            
            return (
              <div
                key={booking.id}
                className="flex flex-col space-y-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-violet-500" />
                      <p className="font-medium">{booking.user_name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${booking.user_email}`} className="hover:text-violet-500">
                        {booking.user_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${booking.user_phone}`} className="hover:text-violet-500">
                        {booking.user_phone}
                      </a>
                    </div>
                  </div>
                  <BookingStatusBadge status={booking.status as BookingStatus} />
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {`${booking.time_slot}:00 - ${endHour}:00`}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {booking.group_size} pers.
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {booking.duration}h
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {booking.price}€
                  </Badge>
                </div>

                {booking.message && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {booking.message}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(booking)}
                  >
                    Détails
                  </Button>
                  <BookingActions 
                    bookingId={booking.id}
                    currentStatus={booking.status as BookingStatus}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
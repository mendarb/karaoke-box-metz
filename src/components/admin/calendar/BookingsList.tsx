import { Booking } from "@/hooks/useBookings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../BookingActions";
import { BookingStatus } from "@/integrations/supabase/types/booking";
import { Mail, Phone, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <Card className="bg-card border-none shadow-none">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold">
          {selectedDate ? (
            `Réservations du ${format(selectedDate, 'd MMMM yyyy', { locale: fr })}`
          ) : (
            'Sélectionnez une date'
          )}
        </h2>
      </div>
      
      <div className="divide-y">
        {bookings.length === 0 ? (
          <div className="p-4 text-muted-foreground">
            Aucune réservation pour cette date
          </div>
        ) : (
          bookings.map((booking) => {
            const startHour = parseInt(booking.time_slot);
            const endHour = startHour + parseInt(booking.duration);
            
            return (
              <div
                key={booking.id}
                className="p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-violet-500 shrink-0" />
                        <p className="font-medium truncate">{booking.user_name}</p>
                      </div>
                      {!isMobile && (
                        <>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <a href={`mailto:${booking.user_email}`} className="hover:text-violet-500 truncate">
                              {booking.user_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 shrink-0" />
                            <a href={`tel:${booking.user_phone}`} className="hover:text-violet-500">
                              {booking.user_phone}
                            </a>
                          </div>
                        </>
                      )}
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
                      currentStatus={booking.status as BookingStatus}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};